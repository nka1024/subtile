/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { IUnit } from "../../actors/IUnit";
import { Scene } from "phaser";
import { IUnitModule } from "../interface/IUnitModule";
import { UI_DEPTH } from "../../const/const";
import { Point } from "../../types/Position";

export class ProgressModule implements IUnitModule {

  // Public
  public progress: number = 0;
  
  public text: string;

  // Private 
  private unit: IUnit;
  private scene: Scene;

  private textMain: Phaser.GameObjects.BitmapText;
  private textShadow2: Phaser.GameObjects.BitmapText;
  private textShadow1: Phaser.GameObjects.BitmapText;
  private lineFg: Phaser.GameObjects.Image;
  private lineBg: Phaser.GameObjects.Image;

  // settings
  private fgW: number;
  private fgH: number;
  private bgW: number;
  private bgH: number;
  private lineFgTexture: string;
  private lineBgTexture: string;
  private lineFgOffset: Point;
  private lineBgOffset: Point;

  constructor(unit: IUnit, scene: Scene, type: string) {
    this.unit = unit;
    this.scene = scene;

    if (type == 'hp') {
      this.bgW = 34;
      this.fgW = 32;
      this.bgH = 4;
      this.bgH = 2;
      this.lineFgTexture = 'progress_green_32x2';
      this.lineBgTexture = 'progress_black_34x4';
      this.lineBgOffset = {x: -17, y: -17};
      this.lineFgOffset = {x: -16, y: -16};
    } else {
      this.bgW = 50;
      this.fgW = 50;
      this.bgH = 2;
      this.fgH = 2;
      this.lineFgTexture = 'progress_yellow_50x2';
      this.lineBgTexture = 'progress_black_52x4';
      this.lineBgOffset = {x: -26, y: -17};
      this.lineFgOffset = {x: -25, y: -16};
    }
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
    if (this.text && this.text.length > 0) {
      this.createText();
    }
    this.createLine();
  }

  public hide() {
    this.destroyText();
    this.destroyLine();
  }

  // Private 

  private createText() {
    let txt = this.text;
    let spacing = -1;

    if (!this.textShadow1 && !this.textShadow2) {
      this.textShadow2 = this.scene.add.bitmapText(0, 0, 'pokemon-8-shadow', txt);
      this.textShadow1 = this.scene.add.bitmapText(0, 0, 'pokemon-8-shadow', txt);
      this.textShadow2.letterSpacing = spacing;
      this.textShadow1.letterSpacing = spacing;
      this.textShadow1.depth = UI_DEPTH.PROGRESS;
      this.textShadow2.depth = UI_DEPTH.PROGRESS;
    }

    if (!this.textMain) {
      this.textMain = this.scene.add.bitmapText(0, 0, 'pokemon-8-white', txt);
      this.textMain.letterSpacing = spacing;
      this.textMain.depth = UI_DEPTH.PROGRESS;
    }
  }

  private createLine() {
    if (!this.lineFg) {
      this.lineFg = this.scene.add.image(0, 0, this.lineFgTexture);
      this.lineFg.depth = UI_DEPTH.PROGRESS + 1;
      this.lineFg.originX = 1;
      this.lineFg.originY = 1;
    }

    if (!this.lineBg) {
      this.lineBg = this.scene.add.image(0, 0, this.lineBgTexture);
      this.lineBg.depth = UI_DEPTH.PROGRESS;
      this.lineBg.originX = 1;
      this.lineBg.originY = 1;
    }
  }

  private updateText() {
    if (this.textMain) {
      this.textMain.text = this.text;
      this.textMain.x = this.unit.x - 25;
      this.textMain.y = this.unit.y - 30;
    }

    if (this.textShadow1 && this.textShadow2) {
      this.textShadow1.text = this.text;
      this.textShadow1.x = this.textMain.x + 1;
      this.textShadow1.y = this.textMain.y;

      this.textShadow2.text = this.text;
      this.textShadow2.x = this.textMain.x;
      this.textShadow2.y = this.textMain.y + 1;
    }
  }

  private updateLine(progress: number) {
    if (this.lineBg && this.lineFg) {
      this.lineBg.x = this.unit.x + this.lineBgOffset.x;
      this.lineBg.y = this.unit.y + this.lineBgOffset.y;
      this.lineFg.x = this.unit.x + this.lineFgOffset.x;
      this.lineFg.y = this.unit.y + this.lineFgOffset.y;
      this.lineFg.setDisplayOrigin(0, 0);
      this.lineBg.setDisplayOrigin(0, 0);

      this.lineFg.scaleX = progress;
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
    if (this.lineFg) this.lineFg.destroy();
    if (this.lineBg) this.lineBg.destroy();
    this.lineBg = null;
    this.lineFg = null;
  }
}