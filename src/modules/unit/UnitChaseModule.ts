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

export class UnitChaseModule implements IUnitModule {

  private owner: BaseUnit;
  private mover: UnitMoverModule;
  private grid: TileGrid;

  private target: BaseUnit;

  private onChaseComplete: () => void;

  private lastDest: { i: number, j: number };

  private claimedSpot: { x: number, y: number };

  constructor(owner: BaseUnit, mover: UnitMoverModule, grid) {
    this.owner = owner;
    this.mover = mover;
    this.grid = grid;
  }

  public start(target: BaseUnit, onComplete: () => void) {
    this.target = target;
    this.onChaseComplete = onComplete;

    let onStepComplete = (stepsToGo: number, nextDest: { x: number, y: number }) => {
      if (stepsToGo == 1) {
        if (!target.perimeter.isSpotFree(nextDest.x, nextDest.y)) {
          this.mover.onStepComplete = onStepComplete;
          this.mover.onPathComplete = onPathComplete;
          this.claimedSpot = target.perimeter.findEmptySpot(this.owner);
          target.perimeter.claimSpot(this.claimedSpot.x, this.claimedSpot.y);
          this.mover.moveTo(this.claimedSpot, true);
        }
      }
    }

    let onPathComplete = () => {
      let gp = this.grid.worldToGrid(target.x, target.y);
      if (this.lastDest.i != gp.i || this.lastDest.j != gp.j) {
        this.start(target, onComplete);
      } else {

        let distance = this.gridDistanceToTarget();
        if (distance.i == 0 && distance.j == 0) {
          console.log('wrong!');

          this.mover.onStepComplete = onStepComplete;
          this.mover.onPathComplete = onPathComplete;
          this.claimedSpot = target.perimeter.findEmptySpot(this.owner);
          target.perimeter.claimSpot(this.claimedSpot.x, this.claimedSpot.y);
          this.mover.moveTo(this.claimedSpot, true);

        } else {
          if (this.onChaseComplete) {
            this.onChaseComplete();
          }
        }
      }
    };

    this.mover.onStepComplete = onStepComplete;
    this.mover.onPathComplete = onPathComplete;
    this.mover.moveTo(target, true);

    this.lastDest = this.grid.worldToGrid(target.x, target.y);
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
          this.target.perimeter.unclaimSpot(this.owner.x, this.owner.y);
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