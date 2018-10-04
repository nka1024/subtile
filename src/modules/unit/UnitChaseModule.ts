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


  public redeployDefender() {
    this.deployDefender(this.target);
  }

  public deployDefender(target: BaseUnit) {
    this.start(target, null);
  }


  public start(target: BaseUnit, onComplete: () => void) {
    this.setTarget(target);
    
    this.lastDest = this.grid.worldToGrid(target);
    let tile = this.grid.findClosestFreeTile(target.tile);

    let onStepComplete = (stepsToGo: number, nextDest: Point) => {
      if (stepsToGo == 1) {
        if (!this.grid.isFree(this.grid.worldToGrid(nextDest))) {
          this.start(target, onComplete);
        }
      }
    };
    let onPathComplete = () => {
      if (!this.mover.claimedTile) {
        this.start(target, onComplete);
      }
    };
    this.mover.onPathComplete = onPathComplete;
    this.mover.onStepComplete = onStepComplete;
    this.mover.moveTo(this.grid.gridToWorld(tile), true);
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
    if (this.target) {
      if (this.lastDest.i != this.target.tile.i || this.lastDest.j != this.target.tile.j) {
        if (!this.atMeleeToTarget()) {
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
    this.setTarget(null);
    this.owner = null;
    this.mover = null;
    this.grid = null;
    this.state = null;
    this.onChaseComplete = null;
    this.lastDest = null;
  }

}