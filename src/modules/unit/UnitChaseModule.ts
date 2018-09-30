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
  
  private lastDest: {i: number, j: number};
  
  constructor (owner: BaseUnit, mover: UnitMoverModule, grid) {
    this.owner = owner;
    this.mover = mover;
    this.grid = grid;
  }

  public start(target: BaseUnit, onComplete: () => void) {
    this.target = target;
    this.onChaseComplete = onComplete;

    this.mover.onStepComplete = (stepsToGo: number, nextStep: {x: number, y: number}) => {
      console.log('onStepComplete')
      let gp = this.grid.worldToGrid(target.x, target.y);
      if (this.lastDest.i != gp.i || this.lastDest.j != gp.j) {
        // console.log(this.lastDest.i + ' : ' + this.lastDest.j + ' != ' + gp.i + ' : ' + gp.j);
        console.log('object changed position, restarting chase');
        // find new path
        // this.mover.moveTo(target, true);    
        // this.lastDest = gp;
        this.start(target, onComplete);
      }
    };
    this.mover.onPathComplete = () => {
      console.log('onPathComplete')
      let gp = this.grid.worldToGrid(target.x, target.y);
      if (this.lastDest.i != gp.i || this.lastDest.j != gp.j) {
        console.log('object changed position, restarting chase');
        this.start(target, onComplete);
      } else {
        console.log('chase is compelte')
        if (this.onChaseComplete) {
          this.onChaseComplete();
        }
      }
      this.stop();
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

  update () {
  }

  destroy() {

  }
}