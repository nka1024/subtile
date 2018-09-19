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


/// <reference path="./types/canvasinput.d.ts"/>


export class EditorRootScene extends Phaser.Scene {

  private list:ObjectsListPanel;
  private toolsPanel:ToolsPanel;
  private cursor:Phaser.GameObjects.Sprite;

  constructor() {
    super({
      key: "EditorRootScene"
    });
  }

  preload() {
    AssetsLoader.preload(this);
  }

  create(data): void {
    this.cameras.main.setBackgroundColor(0xb8b021);
    WindowManager.initialize();

    this.cursor = this.add.sprite(150,150, "cursor");
    this.cursor.originX = 0.5;
    this.cursor.originY = 1;
    this.cursor.setInteractive();

    this.toolsPanel = new ToolsPanel();
    this.toolsPanel.show()

    var menu = new MenuPanel();
    menu.show();

    menu.objectsButton.addEventListener('click', () => {
      if (this.list) {
        this.list.destroy()
        // close if pressed again
        if(this.list.filenamePrefix.startsWith("tree")) {
          this.list = null
          return
        }
      }
      this.list = new ObjectsListPanel("tree", ASSETS.TREE_MAX, 40, 40);
      this.list.onObjectClick = (idx:number) => {
        this.cursor.setTexture("tree_"+idx);
      }
      this.list.show()
    })

    menu.terrainButton.addEventListener('click', () => {
      if (this.list) {
        this.list.destroy()

        // close if pressed again
        if(this.list.filenamePrefix.startsWith("terrain")) {
          this.list = null
          return
        }
      }
      this.list = new ObjectsListPanel("terrain", ASSETS.TERRAIN_MAX, 128, 128);
      this.list.onObjectClick = (idx:number) => {
        this.cursor.setTexture("terrain_"+idx);
      }
      this.list.show()
    });

    menu.exportButton.addEventListener('click', () => {
      this.showExportWindow();
      
    });
  }

  showExportWindow() {
    var w = new ExportWindow("EXPORT MAP DATA");
    w.show();
    w.populate(this.children.getAll());
    w.importButton.addEventListener('click', () => {
      // cleanup
      for (let child of this.children.getAll()) {
        // exclude cursor
        if ((child as Phaser.GameObjects.Image).depth != 1000)
          child.destroy()
      }

      // create from config
      let data = JSON.parse(w.getInputText());
      console.log(data);
      for (let item of data) {
        this.createObjectFromConfig(item);
      }
    });
  }

  
  update(): void {
    this.cursorFollow();   
    this.cameraDrag();
    this.cursorTouchHandler();
  }

  private cursorTouchHandler() {
    if (!this.cursor.texture) return;

    if(this.input.activePointer.isDown) {
      if (this.cursor.alpha != 0.5) {
        this.cursor.alpha = 0.5;
      }
    } else {
      if (this.cursor.alpha != 1) {
        this.cursor.alpha = 1;
        if (this.list != null) {
          this.createObject();
          this.cursor.setTexture("tree_" + this.getRandomInt(1,9))
        }
      }
    }
  }

  private cursorFollow() {
    let worldPosX = Math.round(this.input.activePointer.x/2)*2;
    let worldPosY = Math.round(this.input.activePointer.y/2)*2;
    this.cursor.x = Math.round(worldPosX + this.cameras.main.scrollX);
    this.cursor.y = Math.round(worldPosY + this.cameras.main.scrollY);
    this.cursor.scaleX = 2;
    this.cursor.scaleY = 2;
    this.cursor.depth = 1000; 
    this.toolsPanel.cordLabel.innerHTML = this.cursor.x + ':' + this.cursor.y ;
  }

  private prevPointerX:number;
  private prevPointerY:number;
  private cameraDrag() {
    let ptr = this.input.activePointer;
    if(ptr.isDown) {
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

  private createObjectFromConfig(data:any) {
    let obj = new Phaser.GameObjects.Image(this, 0, 0, null);
    obj.scaleX = this.cursor.scaleX;
    obj.scaleY = this.cursor.scaleY;
    obj.originX = this.cursor.originX;
    obj.originY = this.cursor.originY;
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
    var bgX = this.sys.canvas.width/2;
    var bgY = this.sys.canvas.height/2;
    var placeholder = new Phaser.GameObjects.Sprite(this,bgX, bgY, "placeholder");
    placeholder.scaleX = placeholder.scaleY = 2;
    this.add.existing(placeholder);
  }

  private getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
