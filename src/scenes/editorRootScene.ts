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
import { js as easystar } from "easystarjs";
import { Player } from "../actors/Player";


export class EditorRootScene extends Phaser.Scene {
  
  private grid: TileGrid;
  private list: ObjectsListPanel;
  private toolsPanel: ToolsPanel;
  private cursor: Phaser.GameObjects.Sprite;

  private player: Player;
  
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

    // var e = new easystar();
    // e.enableSync();
    // e.enableDiagonals();
    // e.setGrid([[0,0,0],[0,0,0],[0,0,0]]);
    // e.setAcceptableTiles([0]);
    // console.log('s: ' + e)
    // e.findPath(0,0,2,2, (path) => {
    //   console.log('found path: ' + path);
    // });
    // e.calculate();

    this.importMap(this.cache.json.get('map'));
    
    this.toolsPanel = new ToolsPanel();
    this.toolsPanel.show()

    var menu = new MenuPanel();
    menu.show();

    this.toolsPanel.playButton.addEventListener('click', () => {
      let player = new Player(this, 444,280);
      player.depth = player.y+16;
      this.add.existing(player);
      this.player = player;
    });

    // objects button
    menu.objectsButton.addEventListener('click', () => {
      if (this.list) {
        this.list.destroy();
        this.cursor.setTexture("cursor");
        // close if pressed again
        if (this.list.filenamePrefix.startsWith("tree")) {
          this.list = null;
          return;
        }
      }
      this.list = new ObjectsListPanel("tree", ASSETS.TREE_MAX, 40, 40);
      this.list.onObjectClick = (idx: number) => {
        this.cursor.setTexture("tree_" + idx);
      }
      this.list.show();
    })

    // grid button
    menu.gridButton.addEventListener('click', () => {
      this.grid.toggleGrid();
    });

    // terrain button
    menu.terrainButton.addEventListener('click', () => {
      if (this.list) {
        this.list.destroy()
        this.cursor.setTexture("cursor");
        // close if pressed again
        if (this.list.filenamePrefix.startsWith("terrain")) {
          this.list = null
          return
        }
      }
      this.list = new ObjectsListPanel("terrain", ASSETS.TERRAIN_MAX, 128, 128);
      this.list.onObjectClick = (idx: number) => {
        this.cursor.setTexture("terrain_" + idx);
      }
      this.list.show()
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
  }

  private cursorTouchHandler() {
    if (this.input.activePointer.isDown) {
      if (this.cursor.alpha != 0.5) {
        this.cursor.alpha = 0.5;
      }
    } else {
      if (this.cursor.alpha != 1) {
        this.cursor.alpha = 1;
        if (!this.grid.visible) {
          if (this.list != null) {
            this.createObject();
            this.cursor.setTexture("tree_" + this.getRandomInt(1, 9))
          }
        } else {
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
    if (this.list.filenamePrefix.startsWith("terrain")) {
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
