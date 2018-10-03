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
import { EventEmitter } from "events";
import { UnitStateModule } from "./UnitStateModule";

export class UnitCombatModule implements IUnitModule {
  private owner: BaseUnit;
  private scene: Scene;
  private grid: TileGrid;

  private state: UnitStateModule;
  private mover: UnitMoverModule;

  private attackTimer: any;
  private target: BaseUnit;

  public events: EventEmitter;

  constructor(owner: BaseUnit, scene: Scene, mover: UnitMoverModule, state: UnitStateModule, grid: TileGrid) {
    this.owner = owner;
    this.mover = mover;
    this.state = state;
    this.grid = grid;
    this.scene = scene;

    this.events = new EventEmitter();
  }

  private setTarget(target: BaseUnit) {
    this.target = target;
    this.state.fightTarget = target;
    this.state.isFighting = target != null;
  }



  // Overrides

  update() {
    // start fight if attacker and defender are in the same tile
    if (this.state.isChasing && !this.state.isFighting && !this.state.isMoving) {
      this.findTargets();
    }
  }

  destroy() {
    this.state.fightTarget = null;
    this.state.isFighting = false;
    this.owner = null;
    this.scene = null;
    this.grid = null;
    this.mover = null;
    this.state = null;

    clearInterval(this.attackTimer);
  }


  // public

  public sufferAttack(attack: { attacker: BaseUnit, damage: number }) {
    if (!this.state.isFighting) {
      this.startFight(attack.attacker);
    } else {
      if (this.owner.conf.health - attack.damage <= 0) {
        this.stopFight("death");
      }
    }

    // only destroy after all logic
    this.owner.conf.health -= attack.damage;

    if (this.owner.conf.health <= 0) {
      this.owner.events.emit('death');
    }
  }

  public startFight(target: BaseUnit) {
    console.log('start fight against: ' + target.conf.id);
    let direction = this.owner.perimeter.findRelativePerimeterSpot(target);
    this.setTarget(target);
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
    if (this.mover) {
      this.mover.pauseUpdates(false);
    }
    this.setTarget(null);
    clearInterval(this.attackTimer);

    if (reason != 'death' && reason != 'return') {
      this.events.emit('fight_end');
    }
  }


  // Private

  private performAttack() {
    if (!this.state.fightTarget || !this.state.fightTarget.active) {
      this.stopFight("no_target");
      return;
    }

    if (this.owner.conf.health <= 0) {
      console.log('stopping attack: target is dead');
      this.stopFight("dead_target")
    } else {
      let damage = (Math.random() / 100 + Math.random() / 50) * 2;
      this.target.combat.sufferAttack({ attacker: this.owner, damage: damage });
      // console.log('performing attack');

      this.showFloatyText(damage);
    }
  }

  private showFloatyText(damage: number) {
    let floatyX = this.target.x + Math.random() * 10 - 5;
    let floatyY = this.target.y - Math.random() * 10 - 10;
    let white = this.owner.conf.id.indexOf('enemy') != -1;
    new FloatingText(this.scene, floatyX, floatyY, Math.floor(damage * 1000).toString(), white);
  }

  private findTargets() {
    let spot = this.state.chaseTarget.perimeter.spotOfUnit(this.owner);
    if (spot) {
      if (this.owner.side == 'attack') {
        if (spot.defender) {
          console.log('startFight with defender' + spot.defender.conf.id);
          this.startFight(spot.defender);
        }
      }
      else if (this.owner.side == 'defend') {
        // defend nearby cells from attackers
        for (let spot_ of [spot, spot.prev, spot.next, spot.prev.prev, spot.next.next, spot.next.next.next, spot.prev.prev.prev, spot.next.next.next.next]) {
          if (spot_.attacker) {
            let atkr = spot_.attacker;
            let ownr = this.owner;
            let d = this.grid.distance(ownr.tile, atkr.tile, true)
            if (d.i > 1 || d.j > 1) {
              ownr.chase.redeployDefender();
            } else {
              this.startFight(spot_.attacker);
              if (atkr.tile.i == this.owner.tile.i && atkr.tile.j == this.owner.tile.j) {
                let tile = atkr.tile;
                let push = this.owner.perimeter.pushBackDistance(spot_);
                atkr.mover.placeToTile({ i: tile.i + push.i, j: tile.j + push.j })
              }

              break;
            }
          }
        }
      }
    }
  }

}