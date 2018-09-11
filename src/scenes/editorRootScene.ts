/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { Button, ButtonType } from "../uikit/button";
import { OkPopup } from "../windows/OkPopup";

/// <reference path="./types/canvasinput.d.ts"/>


export class EditorRootScene extends Phaser.Scene {
  constructor() {
    super({
      key: "EditorRootScene"
    });
  }

  preload() {
    Button.load(this);
  }

  create(data): void {

    var wm = document.querySelector('.window_manager') as HTMLElement;
    OkPopup.initialize(document);
    
    var popup = new OkPopup(wm, "Hello", "This is an instance of OkPopup");
    popup.show();
    popup.okButton.addEventListener('click', () => {
      var popup2 = new OkPopup(wm, "Hello again", "I am the other instance of OkPopup");
      popup2.show();
    });

  }

  update(): void {
  }

}
