/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { IScoutable } from "./IScouteable";

import { TileGrid } from "../TileGrid";
import { ScouteeModule } from "../modules/unit/ScouteeModule";
import { UnitSelectionModule } from "../modules/unit/UnitSelectionModule";
import { ISelectable } from "./ISelectable";
import { BaseUnit } from "./BaseUnit";

export class SquadUnit extends BaseUnit implements IScoutable, ISelectable {

  public selection: UnitSelectionModule;
  public scoutee: ScouteeModule;

  private squadType: number = 1;

  private static initialized: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, grid: TileGrid, squadType: number) {
    super(scene, x, y, grid, 'infantry_' + squadType + '_idle_48x48');

    this.squadType = squadType;
    this.selection = new UnitSelectionModule(this, scene);
    this.scoutee = new ScouteeModule(this.progress);
    this.core.addModules([this.scoutee, this.selection])

    this.initializeOnce();

    this.playUnitAnim('idle', true);
  }

  private initializeOnce() {
    if (!SquadUnit.initialized) {
      SquadUnit.initialized = true;
      for (let idx of [1, 2]) {
        var idleAnim = {
          key: 'unit_' + idx + '_idle',
          frames: this.scene.anims.generateFrameNumbers('infantry_' + idx + '_idle_48x48', { start: 0, end: 3 }),
          frameRate: 5,
          repeat: -1,
          repeatDelay: 0
        };
        this.scene.anims.create(idleAnim);
        var walkAnim = {
          key: 'unit_' + idx + '_walk',
          frames: this.scene.anims.generateFrameNumbers('infantry_' + idx + '_walk_48x48', { start: 0, end: 3 }),
          frameRate: 10,
          repeat: -1,
          repeatDelay: 0
        };
        this.scene.anims.create(walkAnim);
        var fightAnim = {
          key: 'unit_' + idx + '_fight',
          frames: this.scene.anims.generateFrameNumbers('infantry_' + idx + '_fight_48x48', { start: 0, end: 7 }),
          frameRate: 10,
          repeat: -1,
          repeatDelay: 0
        };
        this.scene.anims.create(fightAnim);
      }
    }
  }

  public playUnitAnim(key: string, ignoreIfPlaying: boolean) {
    let anim = 'unit_' + this.squadType + '_' + key;
    this.anims.play(anim, ignoreIfPlaying);
  }

  public fightTarget: BaseUnit;
  public isFighting: boolean;
  public startFight(target: BaseUnit) {
    
    let direction = this.perimeter.findPerimeterPos(target.x, target.y);
    this.isFighting = true;
    this.fightTarget = target;
    this.flipX = direction.j == 0;
    this.mover.pauseUpdates(true);
    this.playUnitAnim('fight', true);

    if (direction.j == 1) this.originX = 0.5
    else if (direction.j == 0) this.originX = this.flipX ? 0.25 : 0.75 ;
    else if (direction.j == 2) this.originX = this.flipX ? 0.75 : 0.25 ;
    
    if (direction.i == 1) this.originY = 0.5;
    else if (direction.i == 0) this.originY = 0.75;
    else if (direction.i == 2) this.originY = 0.25;
  }

  public stopFight() {
    this.fightTarget.perimeter.unclaimSpot(this.x, this.y);
    this.isFighting = false;
    this.fightTarget = null;
    this.mover.pauseUpdates(false);
    this.originX = 0.5;
    this.originY = 0.5;
  }

  update() {
    this.depth = this.y - 4;

    super.update();
  }

  destroy() {
    this.scoutee = null;
    this.progress = null;
    this.selection = null;
    super.destroy()
  }

}