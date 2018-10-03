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
import { UnitPerimeterSpot } from "./UnitPerimeterModule";
import { Tile, Point } from "../../types/Position";
import { UnitStateModule } from "./UnitStateModule";

export class UnitChaseModule implements IUnitModule {

  private owner: BaseUnit;
  private mover: UnitMoverModule;
  private state: UnitStateModule;
  private grid: TileGrid;

  private onChaseComplete: () => void;
  private lastDest: { i: number, j: number };
  private claimedSpot: UnitPerimeterSpot;

  private target: BaseUnit;

  constructor(owner: BaseUnit, state: UnitStateModule, mover: UnitMoverModule, grid) {
    this.owner = owner;
    this.mover = mover;
    this.state = state;

    this.grid = grid;
  }

  private setTarget(target: BaseUnit) {
    this.target = target;
    this.state.chaseTarget = target;
    this.state.isChasing = target != null;
  }

  public deployDefender(target: BaseUnit) {
    this.untrackTargetRevokes();
    this.setTarget(target);

    this.target.perimeter = target.perimeter;
    this.trackTargetRevokes();
    this.lastDest = this.grid.worldToGrid(target);

    // find first attacked spot with no defenders
    let spots = this.target.perimeter.attackedSpots;
    let spot: UnitPerimeterSpot = null;
    if (spots.length > 0) {
      for (let attackedSpot of spots) {
        if (attackedSpot.defender == null) {
          spot = attackedSpot;
          let tile = spot.attacker.tile;
          let push = this.owner.perimeter.pushBackDistance(spot);

          spot.attacker.mover.placeToTile({ i: tile.i + push.i, j: tile.j + push.j })
        }
      }
    }

    // if nothing, find first empty spot
    if (!spot) {
      spot = this.target.perimeter.findEmptyPerimeterSpot(target, this.owner.side);
    }

    // claim and deploy to spot
    this.claim(spot);
    let spotXY = this.target.perimeter.perimeterSpotToXY(spot);
    this.mover.placeToPoint(spotXY);
  }

  public restartIfHasTarget() {
    if (this.target) {
      let targetMoved = this.lastDest.i != this.target.tile.i || this.lastDest.j != this.target.tile.j
      if (targetMoved || !this.atMeleeToTarget()) {
        let target = this.target;
        let onChaseComplete = this.onChaseComplete;
        this.unclaim();
        this.stop()
        this.start(target, onChaseComplete);
      }
    }
  }
  
  public start(target: BaseUnit, onComplete: () => void) {
    this.untrackTargetRevokes();
    this.setTarget(target);
    this.trackTargetRevokes();
    this.onChaseComplete = onComplete;

    let onStepComplete = (stepsToGo: number, nextDest: Point) => {
      if (stepsToGo == 1) {
        let spot = this.target.perimeter.findRelativePerimeterSpot(nextDest);
        if (this.isClaimed(spot)) {
          this.mover.onStepComplete = onStepComplete;
          this.mover.onPathComplete = onPathComplete;
          spot = this.target.perimeter.findEmptyPerimeterSpot(this.owner, this.owner.side);

          if (!spot) {
            console.log('empty spots not found')
          }

          this.claim(spot);
          let spotXY = this.target.perimeter.perimeterSpotToXY(spot);
          this.mover.moveTo(spotXY, true);
        }
      }
    }

    let onPathComplete = () => {
      if (this.lastDest.i != target.tile.i || this.lastDest.j != target.tile.j) {
        // target already left old position, chase it again
        this.start(target, onComplete);
      } else {
        let distance = this.gridDistanceToTarget();
        if (distance.i == 0 && distance.j == 0) {
          console.log('too close - can not stand in the same spot with target');
          this.mover.onStepComplete = onStepComplete;
          this.mover.onPathComplete = onPathComplete;

          let spot = this.target.perimeter.findEmptyPerimeterSpot(this.owner, this.owner.side);
          if (!spot) {
            console.log('empty spots not found')
          }
          this.claim(spot);
          let spotXY = this.target.perimeter.perimeterSpotToXY(spot);
          this.mover.moveTo(spotXY, true);
        } else {
          if (this.onChaseComplete) {
            this.onChaseComplete();
          }
        }
      }
    };

    this.mover.onStepComplete = onStepComplete;
    this.mover.onPathComplete = onPathComplete;
    this.lastDest = this.grid.worldToGrid(target);
    this.mover.moveTo(target, true);
  }


  private onTargetClaimRevoked = () => {
    let distance = this.gridDistanceToTarget();

    // if distance is still claimable
    if (Math.abs(distance.i) <= 1 && Math.abs(distance.j) <= 1) {
      // try to claim same spot

      let spot = this.target.perimeter.findRelativePerimeterSpot(this.owner);
      if (!this.isClaimed(spot)) {
        this.claim(spot);
        return;
      }
    }

    // find new spot and claim it
    this.start(this.target, this.onChaseComplete);
  }

  private trackTargetRevokes() {
    this.target.perimeter.on('revoke_all_claims', this.onTargetClaimRevoked);
  }

  private untrackTargetRevokes() {
    if (this.target) {
      this.target.perimeter.off('revoke_all_claims', this.onTargetClaimRevoked, null, false);
      this.claimedSpot = null;
    }
  }

  private unclaim() {
    if (this.claimedSpot) {
      if (this.owner.side == "attack") {
        this.claimedSpot.attacker = null;
      }
      if (this.owner.side == "defend") {
        this.claimedSpot.defender = null;
      }
    }
    this.claimedSpot = null;
  }

  private claim(spot: UnitPerimeterSpot) {
    this.unclaim();
    this.claimedSpot = spot;
    if (this.owner.side == "attack") {
      spot.attacker = this.owner;
    }
    if (this.owner.side == "defend") {
      spot.defender = this.owner;
    }
  }

  private isClaimed(spot: UnitPerimeterSpot) {
    if (this.owner.side == "attack") {
      return spot.attacker != null;
    }
    if (this.owner.side == "defend") {
      return spot.defender != null;
    }
  }

  public stop() {
    this.setTarget(null);
    this.mover.onPathComplete = null;
    this.mover.onStepComplete = null;
    this.onChaseComplete = null;
  }

  private atMeleeToTarget(): boolean {
    let distance = this.gridDistanceToTarget();
    return Math.abs(distance.i) <= 1 && Math.abs(distance.j) <= 1;
  }

  private gridDistanceToTarget(): Tile {
    return this.grid.distanceXY(this.owner, this.target);
  }


  // Overrides

  update() {
    if (this.target && !this.state.fightTarget) {
      if (this.lastDest.i != this.target.tile.i || this.lastDest.j != this.target.tile.j) {
        if (!this.atMeleeToTarget()) {
          this.unclaim();
          this.start(this.target, this.onChaseComplete);
        }
        else {
          this.lastDest.i = this.target.tile.i;
          this.lastDest.j = this.target.tile.j;
        }
      }
    }
  }

  destroy() {
    this.unclaim();
    this.untrackTargetRevokes();
    this.setTarget(null);
    this.owner = null;
    this.mover = null;
    this.grid = null;
    this.state = null;
    this.onChaseComplete = null;
    this.lastDest = null;
  }

}