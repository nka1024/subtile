/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { IUnitModule } from "../interface/IUnitModule";
import { IUnit } from "../../actors/IUnit";
import { Scene } from "phaser";
import { UI_DEPTH } from "../../const/const";


export class UnitSelectionModule implements IUnitModule {

  private unit: IUnit;
  private scene: Scene;

  private softFrame: Phaser.GameObjects.Image;
  private hardFrame: Phaser.GameObjects.Image;

  constructor(unit: IUnit, scene: Scene) {
    this.unit = unit;
    this.scene = scene;
  }

  update() {
    if (this.softFrame) {
      this.softFrame.x = this.unit.x;
      this.softFrame.y = this.unit.y;
    }
    if (this.hardFrame) {
      this.hardFrame.x = this.unit.x;
      this.hardFrame.y = this.unit.y;
    }
  }

  destroy() {
    this.destroySoft();
    this.destroyHard();
    this.unit = null;
    this.scene = null;
  }

  public showSoft() {
    if (!this.softFrame) {
      this.softFrame = this.scene.add.image(0, 0, 'target_select_36x36');
      this.softFrame.depth = UI_DEPTH.SELECTION_SOFT;
      
    }
  }
  public showHard() {
    if (!this.hardFrame) {
      this.hardFrame = this.scene.add.image(0, 0, 'target_select_40x40');
      this.hardFrame.depth = UI_DEPTH.SELECTION_HARD;
    }
  }

  public hideSoft() {
    this.destroySoft();
  }

  public hideHard() {
    this.destroyHard();
  }

  private destroySoft() {
    if (this.softFrame) {
      this.softFrame.destroy();
      this.softFrame = null;
    }
  }

  private destroyHard() {
    if (this.hardFrame) {
      this.hardFrame.destroy();
      this.hardFrame = null;
    }
  }
}