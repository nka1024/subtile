/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { Scene } from "phaser";
import { CONST } from "../const/const";

export enum ButtonType {
  plain,
  expand,
  check,
  back,
  ok
}
export class Button extends Phaser.GameObjects.Sprite {
  
  private outlineGfx: Phaser.GameObjects.Graphics;
  private textGfx: Phaser.GameObjects.Text;
  private isPressed: boolean;
  private buttonType: ButtonType;

  public text: string;
  public ondown: Function;
  public onclick: Function;
  public onmouseover: Function;
  public onmouseout: Function;

  initialize(): void {
    this.createOutline();
    this.createText();

    this.on('pointerdown', () => {
      this.internalOnMouseDown();
      if (this.ondown) this.ondown();
    });
    this.on('pointerup', () => {
      this.internalOnMouseUp();
      if (this.onclick) this.onclick();
    });
    this.on('pointerover', () => {
      this.internalOnMouseOver();
      if (this.onmouseover) this.onmouseover();
    });
    this.on('pointerout', () => {
      this.internalOnMouseOut();
      if (this.onmouseout) this.onmouseout();
    });
  }

  destroy() {
    this.removeAllListeners();
  }

  preUpdate() {
    var t = this.textGfx;
    if (t.text != this.text){
      t.text = this.text;
      t.updateText();
      t.update();
    }
    t.x = this.x - t.width/2;
    t.y = this.y - t.height/2;
    if (this.isPressed) {
      t.y += 2;
    }
    if (this.buttonType == ButtonType.ok) {
      t.x += 35 * CONST.BUTTON_SCALE;
    } else if (this.buttonType == ButtonType.plain) {
    } else {
      t.x -= 35 * CONST.BUTTON_SCALE;
    }
  }

  private internalOnMouseDown() {
    this.isPressed = true;
  }
  private internalOnMouseUp() {
    this.isPressed = false;
  }
  private internalOnMouseOver() {
    this.outlineGfx.visible = true;
  }
  private internalOnMouseOut() {
    this.outlineGfx.visible = false;
  }

  private createText() {
    this.textGfx = this.scene.add.text( this.x, this.y, "",
      { fontFamily: 'system-ui', fontSize: 12, color: '#ffffff' }
    );
  }
  private createOutline() {
    this.outlineGfx = new Phaser.GameObjects.Graphics(this.scene, { x: 0, y: 0 });
    this.scene.add.existing(this.outlineGfx);

    this.outlineGfx.x = this.x - this.width * CONST.BUTTON_SCALE / 2;
    this.outlineGfx.y = this.y - this.height * CONST.BUTTON_SCALE / 2;
    // this.outline.lineStyle(4, 0x577b8e);
    this.outlineGfx.lineStyle(2, 0xffffff);
    this.outlineGfx.strokeRect(0, 0, 
      CONST.BUTTON_W * CONST.BUTTON_SCALE, 
      CONST.BUTTON_H * CONST.BUTTON_SCALE
    );
    this.outlineGfx.visible = false;
  }


  // Static methods

  static create(scene: Scene, x: number, y: number, type: ButtonType, text?: string): Button {
    var button: Button = new Button(scene, x, y, Button.textureByType(type));
    button.text = text;
    button.setInteractive();
    button.scaleX = CONST.BUTTON_SCALE;
    button.scaleY = CONST.BUTTON_SCALE;
    scene.add.existing(button);
    button.initialize();
    button.buttonType = type;
    return button;
  }

  static load(scene: Scene) {
    var theme = CONST.UI_THEME;
    scene.load.image('button_ok', "./assets/" + theme + "/button_ok.png");
    scene.load.image('button_plain', "./assets/" + theme + "/button_plain.png");
    scene.load.image('button_checked', "./assets/" + theme + "/button_checked.png");
    scene.load.image('button_unchecked', "./assets/" + theme + "/button_unchecked.png");
    scene.load.image('button_back', "./assets/" + theme + "/button_back.png");
    scene.load.image('button_expand', "./assets/" + theme + "/button_expand.png");
  }

  private static textureByType(type: ButtonType): string {
    switch (type) {
      case ButtonType.plain: return "button_plain";
      case ButtonType.check: return "button_unchecked";
      case ButtonType.expand: return "button_expand";
      case ButtonType.back: return "button_back";
      case ButtonType.ok: return "button_ok";
    }
    return "";
  }
}