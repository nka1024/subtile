/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { IUnit } from "./IUnit";
import { UnitMoverModule } from "../modules/unit/UnitMoverModule";
import { ProgressModule } from "../modules/unit/ProgressModule";
import { UnitModuleCore } from "../modules/UnitModuleCore";
import { TileGrid } from "../TileGrid";

export class BaseUnit extends Phaser.GameObjects.Sprite implements IUnit{

  public id: string;
  public toDestroy: boolean;
  public mover: UnitMoverModule;
  public progress: ProgressModule

  protected core: UnitModuleCore;

  constructor(scene: Phaser.Scene, x: number, y: number, grid: TileGrid, texture: string) {
    super(scene, x, y, texture);
    this.mover = new UnitMoverModule(this, scene, grid);
    this.progress = new ProgressModule(this, scene);
    this.core = new UnitModuleCore([this.mover, this.progress]);

    this.setInteractive();
  }

  public playUnitAnim(key:string, ignoreIfPlaying:boolean) {
    throw("NOT IMPLEMENTED");
  }

  public update() {
    this.core.update();
    if (this.toDestroy) {
      this.destroy();
    }
  }

  public destroy() {
    this.core.destroy();
    this.core = null;
    this.mover = null;
    this.progress = null;
  }

}