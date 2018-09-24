/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { MenuPanel } from "../windows/MenuPanel";
import { ObjectsListPanel } from "../windows/ObjectsListPanel";
import { ExportWindow } from "../windows/ExportWindow";

import { WindowManager } from "../windows/WindowManager";
import { ASSETS, AssetsLoader } from "../AssetsLoader";
import { ToolsPanel } from "../windows/ToolsPanel";
import { TileGrid } from "../TileGrid";
import { HeroUnit } from "../actors/HeroUnit";


export class EditorRootScene extends Phaser.Scene {
  
  private grid: TileGrid;
  private objectsListPanel: ObjectsListPanel;
  private toolsPanel: ToolsPanel;
  private cursor: Phaser.GameObjects.Sprite;

  private player: HeroUnit;
  
  constructor() {
    super({
      key: "EditorRootScene"
    });
  }

  preload() {
    AssetsLoader.preload(this);
  }

  create(data): void {
    this.cameras.main.setBackgroundColor(0x1f1f1f);
    WindowManager.initialize();

    this.grid = new TileGrid(this);
    this.cursor = this.add.sprite(150, 150, "cursor");
    this.cursor.depth = 1000;
    this.cursor.originX = 0.5;
    this.cursor.originY = 1;
    this.cursor.setInteractive();

    this.importMap(this.cache.json.get('map'));
    
    this.toolsPanel = new ToolsPanel();
    this.toolsPanel.show()

    var menu = new MenuPanel();
    menu.show();

    this.toolsPanel.playButton.addEventListener('click', () => {
      if (this.player) {
        this.player.destroy();
        this.player = null;
        this.toolsPanel.playButton.value = "PLAY";
      } else {
        let player = new HeroUnit(this, 444, 280, this.grid);
        player.depth = player.y+16;
        this.add.existing(player);
        this.player = player;
        this.toolsPanel.playButton.value = "STOP";
      }
    });

    // objects button
    menu.objectsButton.addEventListener('click', () => {
      if (this.objectsListPanel) {
        this.objectsListPanel.destroy();
        this.cursor.setTexture("cursor");
        // close if pressed again
        if (this.objectsListPanel.filenamePrefix.startsWith("tree")) {
          this.objectsListPanel = null;
          return;
        }
      }
      this.objectsListPanel = new ObjectsListPanel("tree", ASSETS.TREE_MAX, 40, 40);
      this.objectsListPanel.onObjectClick = (idx: number) => {
        this.cursor.setTexture(this.objectsListPanel.filenamePrefix + "_" + idx);
      }
      this.objectsListPanel.show();
    })

    // grid button
    menu.gridButton.addEventListener('click', () => {
      this.grid.toggleGrid();
    });

    // terrain button
    menu.terrainButton.addEventListener('click', () => {
      if (this.objectsListPanel) {
        this.objectsListPanel.destroy()
        this.cursor.setTexture("cursor");
        // close if pressed again
        if (this.objectsListPanel.filenamePrefix.startsWith("terrain")) {
          this.objectsListPanel = null
          return
        }
      }
      this.objectsListPanel = new ObjectsListPanel("terrain", ASSETS.TERRAIN_MAX, 128, 128);
      this.objectsListPanel.onObjectClick = (idx: number) => {
        this.cursor.setTexture("terrain_" + idx);
      }
      this.objectsListPanel.show()
    });

    // export button
    menu.exportButton.addEventListener('click', () => {
      this.showExportWindow();
    });
  }
  
  private importMap(map:any) {
    // cleanup
    for (let child of this.children.getAll()) {
      // exclude cursor
      if ((child as Phaser.GameObjects.Image).depth != 1000)
        child.destroy()
    }

    // create grid from config
    this.grid.import(map.grid);
    // create objects from config      
    for (let item of map.objects) {
      this.createObjectFromConfig(item);
    }
  }

  showExportWindow() {
    var w = new ExportWindow("EXPORT MAP DATA");
    w.show();
    w.populate(this.children.getAll(), this.grid.export());
    w.importButton.addEventListener('click', () => {
      let map = JSON.parse(w.getInputText());
      this.importMap(map);
    });
  }

  update(): void {
    this.cursorFollow();
    this.cameraDrag();
    this.cursorTouchHandler();

    if (this.player) this.player.update();
    if (this.grid) this.grid.update();
  }

  private cursorTouchHandler() {
    if (this.input.activePointer.isDown) {
      if (this.cursor.alpha != 0.5) {
        this.cursor.alpha = 0.5;
      }
    } else {
      if (this.cursor.alpha != 1) {
        this.cursor.alpha = 1;
        if (this.player != null) {
          // player movemenet
          this.player.mover.handleMoveTouch(this.cursor);
        } else if (!this.grid.visible) { 
          // object placement
          if (this.objectsListPanel != null) {
            this.createObject();
            this.cursor.setTexture("tree_" + this.getRandomInt(1, 9))
          }
        } else { 
          // tile placement
          this.grid.editTile(this.cursor, 'red');
        }
      }
    }
  }

  private cursorFollow() {
    let worldPosX = Math.round(this.input.activePointer.x / 2) * 2;
    let worldPosY = Math.round(this.input.activePointer.y / 2) * 2;

    // snap cursor to grid or pixel perfect follow
    if (this.grid.visible) {
      this.grid.cursorFollow(this.cursor);
    } else {
      this.cursor.x = Math.round(worldPosX + this.cameras.main.scrollX);
      this.cursor.y = Math.round(worldPosY + this.cameras.main.scrollY);
    }
    this.cursor.scaleX = 2;
    this.cursor.scaleY = 2;
    this.toolsPanel.positionText.innerHTML = this.cursor.x + ':' + this.cursor.y;
    let tile = this.grid.getTileXY(this.cursor.x, this.cursor.y);
    if (tile) {
      let walkable = tile.walkable ? 'free' : 'blocked';
      this.toolsPanel.statusText.innerHTML = tile.i + ':' + tile.j + ' ' + walkable;
    } else {
      this.toolsPanel.statusText.innerHTML = 'OFF GRID';
    }
  }

  private prevPointerX: number;
  private prevPointerY: number;
  private cameraDrag() {
    let ptr = this.input.activePointer;
    if (ptr.isDown) {
      if (!ptr.justDown) {
        this.cameras.main.scrollX -= (ptr.x - this.prevPointerX)
        this.cameras.main.scrollY -= (ptr.y - this.prevPointerY)
      }
      this.prevPointerX = ptr.x;
      this.prevPointerY = ptr.y
    }

    if (ptr.justUp) {
      this.prevPointerX = 0;
      this.prevPointerY = 0;
    }
  }

  private createObjectFromConfig(data: any) {
    let obj = new Phaser.GameObjects.Image(this, 0, 0, null);
    obj.scaleX = 2;
    obj.scaleY = 2;
    obj.originX = 0.5;
    obj.originY = 1;
    obj.setTexture(data.texture);
    obj.x = data.x;
    obj.y = data.y;
    obj.depth = data.depth;
    this.add.existing(obj);
  }

  private createObject() {
    let obj = new Phaser.GameObjects.Image(this, 0, 0, null);
    obj.scaleX = this.cursor.scaleX;
    obj.scaleY = this.cursor.scaleY;
    obj.originX = this.cursor.originX;
    obj.originY = this.cursor.originY;
    obj.setTexture(this.cursor.texture.key);
    obj.x = this.cursor.x;
    obj.y = this.cursor.y;
    // put terrain underneath everything
    if (this.objectsListPanel.filenamePrefix.startsWith("terrain")) {
      obj.depth = -Number.MAX_VALUE;
    } else {
      obj.depth = obj.y;
    }
    this.add.existing(obj);
  }

  addBackground() {
    var bgX = this.sys.canvas.width / 2;
    var bgY = this.sys.canvas.height / 2;
    var placeholder = new Phaser.GameObjects.Sprite(this, bgX, bgY, "placeholder");
    placeholder.scaleX = placeholder.scaleY = 2;
    this.add.existing(placeholder);
  }

  private getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
