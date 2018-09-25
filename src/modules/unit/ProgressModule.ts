/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { IUnit } from "../../actors/IUnit";
import { Scene } from "phaser";
import { IUnitModule } from "../interface/IUnitModule";

export class ProgressModule implements IUnitModule {

  // Public
  public progress: number = 0;
  public width: number = 50;
  public text: string;
  public lineColor: integer = 0xf3bd2f;
  public lineColorBg: integer = 0x222222;

  // Private 
  private unit: IUnit;
  private scene: Scene;

  private textMain: Phaser.GameObjects.BitmapText;
  private textShadow2: Phaser.GameObjects.BitmapText;
  private textShadow1: Phaser.GameObjects.BitmapText;
  private line: Phaser.GameObjects.Graphics;

  constructor(unit: IUnit, scene: Scene) {
    this.unit = unit;
    this.scene = scene;
  }


  // Public

  public update() {
    this.updateLine(this.progress);
    this.updateText();
  }

  public destroy() {
    this.destroyText();
    this.destroyLine();
    this.unit = null;
    this.scene = null;
  }

  public show() {
    this.createText();
    this.createLine();
  }

  public hide() {
    this.destroyText();
    this.destroyLine();
  }

  // Private 

  private createText() {
    let txt = this.text;
    let spacing = -2;

    if (!this.textShadow1 && !this.textShadow2) {
      this.textShadow2 = this.scene.add.bitmapText(0, 0, 'pokemon-8-shadow', txt);
      this.textShadow1 = this.scene.add.bitmapText(0, 0, 'pokemon-8-shadow', txt);
      this.textShadow2.letterSpacing = spacing;
      this.textShadow1.letterSpacing = spacing;
    }

    if (!this.textMain) {
      this.textMain = this.scene.add.bitmapText(0, 0, 'pokemon-8-white', txt);
      this.textMain.letterSpacing = spacing;
    }
  }

  private createLine() {
    if (!this.line){
      this.line = this.scene.add.graphics();
    }
  }

  private updateText() {
    let depth = this.unit.depth + 1;

    if (this.textMain) {
      this.textMain.depth = depth;
      this.textMain.text = this.text;
      this.textMain.x = this.unit.x - 25;
      this.textMain.y = this.unit.y - 30;
    }

    if (this.textShadow1 && this.textShadow2) {
      this.textShadow1.text = this.text;
      this.textShadow1.depth = depth;
      this.textShadow1.x = this.textMain.x + 1;
      this.textShadow1.y = this.textMain.y;

      this.textShadow2.text = this.text;
      this.textShadow2.depth = depth;
      this.textShadow2.x = this.textMain.x;
      this.textShadow2.y = this.textMain.y + 1;
    }
  }

  private updateLine(progress: number) {
    if (this.line) {
      this.line.depth = this.unit.depth + 1;;
      this.line.x = this.unit.x - 25;
      this.line.y = this.unit.y - 15;

      let line = this.line;
      line.clear();
      line.lineStyle(2, this.lineColorBg);
      line.moveTo(0, 0);
      line.lineTo(this.width, 0);
      line.closePath();
      line.strokePath();
      line.lineStyle(2, this.lineColor);
      line.moveTo(0, 0);
      line.lineTo(this.width * progress, 0);
      line.closePath();
      line.strokePath();
    }
  }

  private destroyText() {
    if (this.textMain) {
      this.textMain.destroy();
      this.textMain = null;
    }
    if (this.textShadow1) {
      this.textShadow1.destroy();
      this.textShadow1 = null;
    }
    if (this.textShadow2) {
      this.textShadow2.destroy();
      this.textShadow2 = null;
    }
  }

  private destroyLine() {
    if (this.line) {
      this.line.destroy();
      this.line = null;
    }
  }
}