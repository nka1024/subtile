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
import { Tile } from "../types/Position";
import { UnitStateModule } from "../modules/unit/UnitStateModule";
import { UnitSelectionModule } from "../modules/unit/UnitSelectionModule";

export class BaseUnit extends Phaser.GameObjects.Sprite implements IUnit {

  public conf: UnitData;
  public destroyed: boolean;
  
  public grid: TileGrid;

  // modules
  public combat: UnitCombatModule;
  public selection: UnitSelectionModule;
  public mover: UnitMoverModule;
  public progress: ProgressModule;
  public hp: ProgressModule;
  public perimeter: UnitPerimeterModule;
  public events: Phaser.Events.EventEmitter;
  public chase: UnitChaseModule;
  public state: UnitStateModule;

  protected core: UnitModuleCore;

  constructor(scene: Phaser.Scene, x: number, y: number, speed: number, grid: TileGrid, conf:UnitData, texture: string) {
    super(scene, x, y, texture);
    this.conf = conf;
    this.grid = grid;

    this.events = new Phaser.Events.EventEmitter();
    
    this.selection = new UnitSelectionModule(this, scene);
    this.perimeter  = new UnitPerimeterModule(this, grid);
    this.state      = new UnitStateModule(this);
    this.mover      = new UnitMoverModule(this, scene, this.state, grid, speed);
    this.progress   = new ProgressModule(this, scene, 'progress');
    this.hp         = new ProgressModule(this, scene, 'hp');
    this.chase      = new UnitChaseModule(this, this.state, this.mover, grid);
    this.combat     = new UnitCombatModule(this, scene, this.mover, this.state, grid);

    this.core = new UnitModuleCore([this.selection, this.mover, this.progress, this.state, this.perimeter, this.hp, this.chase, this.combat]);

    this.setInteractive();

    this.on('pointerdown', this.onPointerDownWrapper);
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
    if (this.core) this.core.destroy();
    this.off('pointerdown', this.onPointerDownWrapper, null, false);

    this.core = null;
    this.mover = null;
    this.progress = null;
    this.destroyed = true;
    super.destroy()
  }

  public get tile(): Tile {
    return this.grid.worldToGrid(this);
  }

  public aggressedBy(who: BaseUnit) {
    
  }
  
  public get side():string {
    if (this.conf.id == "hero_squad") return "hero";
    return this.conf.id.includes("type_") ? "defend" : "attack";
  }


  /// tile sprite may be more than 32x32, so wrap clicks to only trigger at 32x32 area
  private onPointerDownWrapper = (pointer:any, localX: number, localY: number, camera: any) => {
    let clickSize = 28;
    let offsetX = (this.width - clickSize)/2;
    let offsetY = (this.height - clickSize)/2;
    if ((localX > offsetX && localX < (offsetX + clickSize)) && 
        (localY > offsetY && localY < (offsetY + clickSize))) 
        {
          this.emit('click_32');
        }
  }
}