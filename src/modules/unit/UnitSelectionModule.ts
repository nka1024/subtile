/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { IUnitModule } from "../interface/IUnitModule";
import { IUnit } from "../../actors/IUnit";
import { Scene } from "phaser";

export class UnitSelectionModule implements IUnitModule {

  private unit: IUnit;
  private scene: Scene;

  private img: Phaser.GameObjects.Image;

  constructor(unit: IUnit, scene: Scene) {
    this.unit = unit;
    this.scene = scene;
  }

  update() {
    if (this.img) {
      this.img.x = this.unit.x;
      this.img.y = this.unit.y;
    }
  }

  destroy() {
    this.destroySelectionImage();
    this.unit = null;
    this.scene = null;
  }

  public show() {
    if (!this.img) {
      this.img = this.scene.add.image(0, 0, 'target_select_36x36');
    }
  }

  public hide() {
    this.destroySelectionImage();
  }

  private destroySelectionImage() {
    if (this.img) {
      this.img.destroy();
      this.img = null;
    }
  }
}