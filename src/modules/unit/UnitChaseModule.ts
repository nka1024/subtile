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

  constructor(owner: BaseUnit, mover: UnitMoverModule, grid) {
    this.owner = owner;
    this.mover = mover;
    this.grid = grid;
  }

  public start(target: BaseUnit, onComplete: () => void) {
    this.target = target;
    this.onChaseComplete = onComplete;

    this.mover.onPathComplete = () => {
      let gp = this.grid.worldToGrid(target.x, target.y);
      if (this.lastDest.i != gp.i || this.lastDest.j != gp.j) {
        this.start(target, onComplete);
      } else {
        if (this.onChaseComplete) {
          this.onChaseComplete();
        }
      }
    };
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
      let gp = this.grid.worldToGrid(this.target.x, this.target.y);
      if (this.lastDest.i != gp.i || this.lastDest.j != gp.j) {
        console.log('object changed position, restarting chase');
        this.start(this.target, this.onChaseComplete);
      }
    }
  }

    destroy() {

    }
  }