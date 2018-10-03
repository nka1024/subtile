/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { IUnitModule } from "../interface/IUnitModule";
import { BaseUnit } from "../../actors/BaseUnit";
import { UnitMoverModule } from "./UnitMoverModule";
import { TileGrid } from "../../TileGrid";
import { Scene } from "phaser";
import { FloatingText } from "../../FloatingText";

export class UnitCombatModule implements IUnitModule {
  private owner: BaseUnit;
  private scene: Scene;
  private grid: TileGrid;

  private mover: UnitMoverModule;

  public fightTarget: BaseUnit;
  public isFighting: boolean;
  private attackTimer: any;

  constructor(owner: BaseUnit, scene: Scene, mover: UnitMoverModule, grid: TileGrid) {
    this.owner = owner;
    this.mover = mover;
    this.grid = grid;
    this.scene = scene;
  }


  update() {
    this.fightUpdate();


    // start fight if attacker and defender are in the same tile
    if (this.owner.chase.target && !this.isFighting) {
      let spot = this.owner.chase.target.perimeter.spotOfUnit(this.owner);
      if (spot) {
        if (this.owner.side == 'attack') {
          if (spot.defender) {
            console.log('startFight with defender' + spot.defender.conf.id);
            this.startFight(spot.defender);
          }
        }
        else if (this.owner.side == 'defend') {
          if (spot.attacker) {
            console.log('startFight with attacker ' + spot.defender.conf.id);
            this.startFight(spot.attacker);
          }
        }
      }
    }
  }

  destroy() {
  }

  public startFight(target: BaseUnit) {
    console.log('start fight against: ' + target.conf.id);
    let direction = this.owner.perimeter.findRelativePerimeterSpot(target.x, target.y);
    this.isFighting = true;
    this.fightTarget = target;
    this.owner.flipX = direction.j == 0;
    this.mover.pauseUpdates(true);
    this.owner.playUnitAnim('fight', true);

    // this.flipOriginByDirection(direction, false);
    // same tile
    this.attackTimer = setInterval(() => { this.performAttack() }, 1000);
  }

  // reason: 'death', 'dead_target', 'no_target', 'return'
  public stopFight(reason: string) {
    console.log('stop fight: ' + this.owner.conf.id);
    if (this.fightTarget && !this.fightTarget.destroyed) {
      // this.fightTarget.perimeter.unclaimSpot(this.x, this.y);
    }
    if (this.mover) {
      this.mover.pauseUpdates(false);
    }
    this.isFighting = false;
    this.fightTarget = null;
    clearInterval(this.attackTimer);


    if (reason != 'death') {
      this.owner.chase.restartIfHasTarget();
    }
  }

  private performAttack() {
    if (!this.fightTarget || !this.fightTarget.active) {
      this.stopFight("no_target");
      return;
    }

    if (this.fightTarget.conf.health <= 0) {
      console.log('stopping attack: target is dead');
      this.stopFight("dead_target")
    } else {
      let damage = 0.3;//Math.random()/100 + Math.random()/50;
      this.fightTarget.combat.sufferAttack({ attacker: this.owner, damage: damage });
      console.log('performing attack');

      // floaty text

      let floatyX = this.fightTarget.x + Math.random() * 10 - 5;
      let floatyY = this.fightTarget.y - Math.random() * 10 - 10;
      let white = this.owner.conf.id.indexOf('enemy') != -1;
      new FloatingText(this.scene, floatyX, floatyY, Math.floor(damage * 1000).toString(), white);
    }
  }


  private fightUpdate() {
  }

  public sufferAttack(attack: { attacker: BaseUnit, damage: number }) {
    if (!this.isFighting) {
      this.startFight(attack.attacker);
    } else {
      if (this.owner.conf.health - attack.damage <= 0) {
        this.stopFight("death");
      }
    }

    this.owner.conf.health -= attack.damage;

    if (this.owner.conf.health <= 0) {
      this.owner.events.emit('death');
    }
  }

}