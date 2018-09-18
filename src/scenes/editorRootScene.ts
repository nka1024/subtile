/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { Button, ButtonType } from "../uikit/button";
import { OkPopup } from "../windows/OkPopup";
import { NewmapWindow } from "../windows/NewmapWindow";
import { MenuWindow } from "../windows/MenuWindow";
import { ObjectsListWindow } from "../windows/ObjectsListWindow";
import { CONST } from "../const/const";
import { ExportWindow } from "../windows/ExportWindow";

/// <reference path="./types/canvasinput.d.ts"/>


export class EditorRootScene extends Phaser.Scene {

  private list:ObjectsListWindow;

  constructor() {
    super({
      key: "EditorRootScene"
    });
  }

  preload() {
    this.load.image("placeholder", "./assets/placeholder.png");
  }

  create(data): void {
    this.addBackground();
    OkPopup.initialize();
    NewmapWindow.initialize();
    MenuWindow.initialize();
    ObjectsListWindow.initialize();
    ExportWindow.initialize();

    var menu = new MenuWindow();
    menu.gridButton.addEventListener('click', () => {
    
    });
    
    menu.show();
    

    menu.objectsButton.addEventListener('click', () => {
      if (this.list) {
        this.list.destroy()
      }
      this.list = new ObjectsListWindow("tree", CONST.TREE_MAX, 40, 40);
      this.list.show()
    })

    menu.landButton.addEventListener('click', () => {
      if (this.list) {
        this.list.destroy()
      }
      this.list = new ObjectsListWindow("land", CONST.LAND_MAX, 128, 128);
      this.list.show()
    });

    menu.exportButton.addEventListener('click', () => {
      var exportWindow = new ExportWindow("EXPORT MAP DATA");
      exportWindow.show();
    });
    

  }


  update(): void {
  }

  addBackground() {
    var bgX = this.sys.canvas.width/2;
    var bgY = this.sys.canvas.height/2;
    var placeholder = new Phaser.GameObjects.Sprite(this,bgX, bgY,"placeholder");
    placeholder.scaleX = placeholder.scaleY = 2;
    this.add.existing(placeholder);
  }

}
