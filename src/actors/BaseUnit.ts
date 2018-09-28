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
import { UnitPerimeterModule } from "../modules/unit/UnitPerimeterModule";
import { UnitData } from "../Hero";

export class BaseUnit extends Phaser.GameObjects.Sprite implements IUnit {

  public conf: UnitData;
  public destroyed: boolean;
  
  // modules
  public mover: UnitMoverModule;
  public progress: ProgressModule;
  public perimeter: UnitPerimeterModule;
  public events: Phaser.Events.EventEmitter;

  protected core: UnitModuleCore;

  constructor(scene: Phaser.Scene, x: number, y: number, grid: TileGrid, conf:UnitData, texture: string) {
    super(scene, x, y, texture);
    this.conf = conf;

    this.events = new Phaser.Events.EventEmitter();

    this.perimeter = new UnitPerimeterModule(this, grid);
    this.mover = new UnitMoverModule(this, scene, grid);
    this.progress = new ProgressModule(this, scene);
    this.core = new UnitModuleCore([this.mover, this.progress, this.perimeter]);

    this.setInteractive();
  }

  public playUnitAnim(key: string, ignoreIfPlaying: boolean) {
    throw ("NOT IMPLEMENTED");
  }

  public update() {
    this.core.update();
  }

  public destroy() {
    this.core.destroy();
    this.core = null;
    this.mover = null;
    this.progress = null;
    this.destroyed = true;
  }

  public sufferAttack(attack: {attacker: BaseUnit, damage: number}) {
    this.conf.health -= attack.damage;

    if (this.conf.health <= 0) {
      this.events.emit('death');
    }
  }

}