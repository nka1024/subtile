/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { MenuWindow } from "../windows/MenuWindow";
import { ObjectsListWindow } from "../windows/ObjectsListWindow";
import { ExportWindow } from "../windows/ExportWindow";

import { WindowManager } from "../windows/WindowManager";
import { ASSETS, AssetsLoader } from "../AssetsLoader";


/// <reference path="./types/canvasinput.d.ts"/>


export class EditorRootScene extends Phaser.Scene {

  private list:ObjectsListWindow;
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
    WindowManager.initialize();

    this.cursor = this.add.sprite(150,150,"tree_1");
    this.cursor.originX = 0.5;
    this.cursor.originY = 1;
    this.cursor.setInteractive();
    var menu = new MenuWindow();
    menu.show();

    menu.objectsButton.addEventListener('click', () => {
      if (this.list) {
        this.list.destroy()
      }
      this.list = new ObjectsListWindow("tree", ASSETS.TREE_MAX, 40, 40);
      this.list.onObjectClick = (idx:number) => {
        this.cursor.setTexture("tree_"+idx);
      }
      this.list.show()
    })

    menu.terrainButton.addEventListener('click', () => {
      if (this.list) {
        this.list.destroy()
      }
      this.list = new ObjectsListWindow("terrain", ASSETS.TERRAIN_MAX, 128, 128);
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
    this.cursor.x = Math.round(this.input.activePointer.x/2)*2
    this.cursor.y = Math.round(this.input.activePointer.y/2)*2
    this.cursor.scaleX = 2;
    this.cursor.scaleY = 2;
    this.cursor.depth = 1000;    

    if(this.input.activePointer.isDown) {
      if (this.cursor.alpha != 0.5) {
        this.cursor.alpha = 0.5;
      }
    } else {
      if (this.cursor.alpha != 1) {
        this.cursor.alpha = 1;
        this.createObject();
      }
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

}
