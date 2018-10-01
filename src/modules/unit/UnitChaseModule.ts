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
import { UnitPerimeterSpot, UnitPerimeterModule } from "./UnitPerimeterModule";

export class UnitChaseModule implements IUnitModule {

  private owner: BaseUnit;
  private mover: UnitMoverModule;
  private grid: TileGrid;

  private target: BaseUnit;
  private tp: UnitPerimeterModule;

  private onChaseComplete: () => void;

  private lastDest: { i: number, j: number };

  private claimedSpot: UnitPerimeterSpot;

  constructor(owner: BaseUnit, mover: UnitMoverModule, grid) {
    this.owner = owner;
    this.mover = mover;
    this.grid = grid;
  }

  private onTargetClaimRevoked = () => {
    let distance = this.gridDistanceToTarget();
    
    // if distance is still claimable
    if (Math.abs(distance.i) <= 1 && Math.abs(distance.j) <= 1) {
      // try to claim same spot

      let spot = this.tp.findRelativePerimeterSpot(this.owner.x, this.owner.y);
      if (!spot.claimed) {
        this.claim(spot);
        return;
      } 
    }

    // find new spot and claim it
    this.start(this.target, this.onChaseComplete);
  }

  private trackTargetRevokes() {
    this.tp.on('revoke_all_claims', this.onTargetClaimRevoked);
  }
  private untrackTargetRevokes() {
    if (this.target) {
      this.tp.off('revoke_all_claims', this.onTargetClaimRevoked, null, false);
      this.claimedSpot = null;
    }
  }

  public start(target: BaseUnit, onComplete: () => void) {
    this.untrackTargetRevokes();
    this.target = target;
    this.tp = target.perimeter;
    this.trackTargetRevokes();
    this.onChaseComplete = onComplete;

    let onStepComplete = (stepsToGo: number, nextDest: { x: number, y: number }) => {
      if (stepsToGo == 1) {
        let spot = this.tp.findRelativePerimeterSpot(nextDest.x, nextDest.y);
        if (spot.claimed) {
          this.mover.onStepComplete = onStepComplete;
          this.mover.onPathComplete = onPathComplete;
          spot = this.tp.findEmptyPerimeterSpot(this.owner);
          
          if (!spot) {
            console.log('empty spots not found')
            target.perimeter.print();
          }

          this.claim(spot);
          let spotXY = this.tp.perimeterSpotToXY(spot);
          this.mover.moveTo(spotXY, true);
        }
      }
    }

    let onPathComplete = () => {
      let gp = this.grid.worldToGrid(target.x, target.y);
      if (this.lastDest.i != gp.i || this.lastDest.j != gp.j) {
        // target already left old position, chase it again
        this.start(target, onComplete);
      } else {
        let distance = this.gridDistanceToTarget();
        if (distance.i == 0 && distance.j == 0) {
          console.log('too close - can not stand in the same spot with target');
          this.mover.onStepComplete = onStepComplete;
          this.mover.onPathComplete = onPathComplete;

          let spot = target.perimeter.findEmptyPerimeterSpot(this.owner);
          if (!spot) {
            console.log('empty spots not found')
            target.perimeter.print();
          }
          this.claim(spot);
          let spotXY = this.tp.perimeterSpotToXY(spot);
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
    this.lastDest = this.grid.worldToGrid(target.x, target.y);
    this.mover.moveTo(target, true);
  }

  private unclaim() {
    if (this.claimedSpot) {
      this.claimedSpot.claimed = false;
    }
    this.claimedSpot = null;
  }

  private claim(spot:UnitPerimeterSpot) {
    this.unclaim();
    this.claimedSpot = spot;
    this.claimedSpot.claimed = true;
  }

  public stop() {
    this.mover.onPathComplete = null;
    this.mover.onStepComplete = null;
    this.target = null;
    this.onChaseComplete = null;
  }

  update() {
    if (this.target) {
      let tp = this.grid.worldToGrid(this.target.x, this.target.y);
      if (this.lastDest.i != tp.i || this.lastDest.j != tp.j) {
        if (!this.atMeleeToTarget()) {
          this.unclaim();
          this.start(this.target, this.onChaseComplete);
        }
      }
    }
  }

  private atMeleeToTarget(): boolean {
    let distance = this.gridDistanceToTarget();
    return Math.abs(distance.i) <= 1 && Math.abs(distance.j) <= 1;
  }

  private gridDistanceToTarget(): { i: number, j: number } {
    let tp = this.grid.worldToGrid(this.target.x, this.target.y);
    let op = this.grid.worldToGrid(this.owner.x, this.owner.y);
    return { i: op.i - tp.i, j: op.j - tp.j };
  }

  destroy() {

  }
}