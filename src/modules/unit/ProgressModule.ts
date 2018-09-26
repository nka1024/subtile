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

export class ProgressModule implements IUnitModule {

  // Public
  public progress: number = 0;
  public width: number = 50;
  public text: string;

  // Private 
  private unit: IUnit;
  private scene: Scene;

  private textMain: Phaser.GameObjects.BitmapText;
  private textShadow2: Phaser.GameObjects.BitmapText;
  private textShadow1: Phaser.GameObjects.BitmapText;
  private lineFg: Phaser.GameObjects.Image;
  private lineBg: Phaser.GameObjects.Image;

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
      this.lineFg = this.scene.add.image(0, 0, 'progress_yellow_50x2');
      this.lineFg.depth = UI_DEPTH.PROGRESS + 1;
    }

    if (!this.lineBg) {
      this.lineBg = this.scene.add.image(0, 0, 'progress_black_50x2');
      this.lineBg.depth = UI_DEPTH.PROGRESS;
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
      for (let line of [this.lineFg, this.lineBg]) {
        line.x = this.unit.x;
        line.y = this.unit.y - 15;
      }

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