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
import { UnitData } from "../Hero";
import { FloatingText } from "../FloatingText";
import { CONST } from "../const/const";
import { UnitChaseModule } from "../modules/unit/UnitChaseModule";

export class SquadUnit extends BaseUnit implements IScoutable, ISelectable {

  public selection: UnitSelectionModule;
  public scoutee: ScouteeModule;
  public chase: UnitChaseModule;

  private squadType: number = 1;

  private static initialized: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, grid: TileGrid, conf: UnitData, squadType: number) {
    super(scene, x, y, CONST.SQUAD_SPEED, grid, conf, 'infantry_' + squadType + '_idle_48x48');

    this.squadType = squadType;
    this.selection = new UnitSelectionModule(this, scene);
    this.scoutee = new ScouteeModule(this.progress);
    this.chase = new UnitChaseModule(this, this.mover, grid);
    this.core.addModules([this.scoutee, this.selection, this.chase])

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

  update() {
    this.depth = this.y - 4;

    super.update();
    this.fightUpdate();
  }

  destroy() {
    this.scoutee = null;
    this.progress = null;
    this.selection = null;
    super.destroy()
  }


  // Fighting

  public fightTarget: BaseUnit;
  public isFighting: boolean;
  private attackTimer: any;
  public startFight(target: BaseUnit) {
    console.log('start fight: ' + this.conf.id);
    let direction = this.perimeter.findRelativePerimeterSpot(target.x, target.y);
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

    this.attackTimer = setInterval(() => { this.performAttack() }, 1000);
  }

  public stopFight() {
    console.log('stop fight: ' + this.conf.id);
    if (this.fightTarget && !this.fightTarget.destroyed) {
      // this.fightTarget.perimeter.unclaimSpot(this.x, this.y);
    }
    if (this.mover) {
      this.mover.pauseUpdates(false);
    }
    this.isFighting = false;
    this.fightTarget = null;
    clearInterval(this.attackTimer);
    this.originX = 0.5;
    this.originY = 0.5;
  }

  private performAttack() {
    if (this.fightTarget.conf.health <= 0) {
      console.log('stopping attack: target is dead');
      this.stopFight()
    } else {
      let damage = 0.3;//Math.random()/100 + Math.random()/50;
      this.fightTarget.sufferAttack({ attacker: this, damage: damage });
      console.log('performing attack');

      // floaty text
      
      let floatyX = this.fightTarget.x + Math.random() * 10 - 5;
      let floatyY = this.fightTarget.y - Math.random() * 10 - 10;
      let white = this.conf.id.indexOf('enemy') != -1;
      new FloatingText(this.scene, floatyX, floatyY, Math.floor(damage*1000).toString(), white);
    }
  }

  private fightUpdate() {
  }

  public sufferAttack(attack: {attacker: BaseUnit, damage: number}) {
    if (!this.isFighting) {
      this.startFight(attack.attacker);
    } else {
      if (this.conf.health - attack.damage <= 0) {
        this.stopFight();
      }
    }

    super.sufferAttack(attack);
  }


  public aggressedBy(who: BaseUnit) {
   this.chase.start(who, () => {}); 
  }
  
}