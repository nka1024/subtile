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
import { UnitCombatModule } from "../modules/unit/UnitCombatModule";
import { UnitChaseModule } from "../modules/unit/UnitChaseModule";

export class BaseUnit extends Phaser.GameObjects.Sprite implements IUnit {

  public conf: UnitData;
  public destroyed: boolean;
  
  public grid: TileGrid;

  // modules
  public combat: UnitCombatModule;
  public mover: UnitMoverModule;
  public progress: ProgressModule;
  public hp: ProgressModule;
  public perimeter: UnitPerimeterModule;
  public events: Phaser.Events.EventEmitter;
  public chase: UnitChaseModule;


  protected core: UnitModuleCore;

  constructor(scene: Phaser.Scene, x: number, y: number, speed: number, grid: TileGrid, conf:UnitData, texture: string) {
    super(scene, x, y, texture);
    this.conf = conf;
    this.grid = grid;

    this.events = new Phaser.Events.EventEmitter();
    
    this.perimeter = new UnitPerimeterModule(this, grid);
    this.mover = new UnitMoverModule(this, scene, grid, speed);
    this.progress = new ProgressModule(this, scene, 'progress');
    this.hp = new ProgressModule(this, scene, 'hp');
    this.chase = new UnitChaseModule(this, this.mover, grid);
    this.combat = new UnitCombatModule(this, scene, this.mover, grid);
    this.core = new UnitModuleCore([this.mover, this.progress, this.perimeter, this.hp, this.chase, this.combat]);

    this.setInteractive();
  }

  public playUnitAnim(key: string, ignoreIfPlaying: boolean) {
    throw ("NOT IMPLEMENTED");
  }

  public update() {
    if (this.conf.health < 1) {
      this.hp.show();
    }
    this.hp.progress = this.conf.health
    this.core.update();
  }

  public destroy() {
    this.core.destroy();
    this.core = null;
    this.mover = null;
    this.progress = null;
    this.destroyed = true;
    super.destroy()
  }

  public positionIJ(): {i: number, j: number} {
    return this.grid.worldToGrid(this.x, this.y);
  }

  public aggressedBy(who: BaseUnit) {
    
  }
  
  public get side():string {
    return this.conf.id.includes("type_") ? "defend" : "attack";
  }
}