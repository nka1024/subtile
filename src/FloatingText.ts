/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { Scene, GameObjects } from "phaser";
import { UI_DEPTH } from "./const/const";

export class FloatingText {

  private x: number;
  private y: number;

  private scene: Scene;
  private text: string;

  private textMain: Phaser.GameObjects.BitmapText;
  private textShadow2: Phaser.GameObjects.BitmapText;
  private textShadow1: Phaser.GameObjects.BitmapText;

  constructor(scene: Scene, x: number, y: number, text: string, white: boolean = true) {
    this.scene = scene;
    this.text = text;
    this.x = x;
    this.y = y;

    this.createText(white);

    let onUpdate = () => {
      this.textShadow1.y -= 0.3;
      this.textShadow2.y -= 0.3;
      this.textMain.y -= 0.3;
      this.textShadow1.alpha -= 0.002
      this.textShadow2.alpha -= 0.002
      this.textMain.alpha -= 0.002

      if (this.textMain.alpha < 0.7) {
        // this.textMain.remo
        this.scene.events.removeListener('update', onUpdate, null, false);
        this.textShadow1.destroy();
        this.textShadow2.destroy();
        this.textMain.destroy();
      }
    }
    scene.events.addListener('update', onUpdate);
  }


  private createText(white: boolean) {
    let txt = this.text;
    let spacing = -1;

    if (!this.textShadow1 && !this.textShadow2) {
      this.textShadow2 = this.scene.add.bitmapText(this.x, this.y, 'pokemon-8-shadow', txt);
      this.textShadow1 = this.scene.add.bitmapText(this.x, this.y, 'pokemon-8-shadow', txt);
      this.textShadow2.letterSpacing = spacing;
      this.textShadow1.letterSpacing = spacing;
      this.textShadow1.depth = UI_DEPTH.FLOATING_TEXT;
      this.textShadow2.depth = UI_DEPTH.FLOATING_TEXT;
    }

    if (!this.textMain) {
      let font = white ? 'pokemon-8-white' : 'pokemon-8-red';
      this.textMain = this.scene.add.bitmapText(this.x, this.y, font, txt);
      this.textMain.letterSpacing = spacing;
      this.textMain.depth = UI_DEPTH.FLOATING_TEXT;
    }
  }

  public update
}