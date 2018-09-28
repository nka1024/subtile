/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { IUnitModule } from "../interface/IUnitModule";
import { TileGrid } from "../../TileGrid";
import { BaseUnit } from "../../actors/BaseUnit";

export class UnitPerimeterModule implements IUnitModule {
  private grid: TileGrid;
  private unit: BaseUnit;

  private perimeter: Array<Array<number>> = [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0]];

  constructor(unit: BaseUnit, grid: TileGrid) {
    this.grid = grid;
    this.unit = unit;
  }


  // Public

  public isSpotFree(x: number, y: number):boolean {
    let p = this.findPerimeterPos(x, y);
    return this.perimeter[p.i][p.j] == 0;
  }

  public claimSpot(x: number, y: number) {
    let p = this.findPerimeterPos(x, y);
    this.perimeter[p.i][p.j] = 1;
  }

  public unclaimSpot(x: number, y: number) {
    let p = this.findPerimeterPos(x, y);
    this.perimeter[p.i][p.j] = 0;
  }

  public findEmptySpot():{x: number, y: number} {
    let p = this.grid.worldToGrid(this.unit.x, this.unit.y);

    let checkOrder = [
      {i: 0, j: 1},
      {i: 0, j: -1},
      {i: - 1, j: 0},
      {i: 1, j: 0},
      {i: -1, j: -1},
      {i: -1, j: 1},
      {i: 1, j: -1},
      {i: 1, j: 1}
    ];

    // check if nearby spot is free on map and not occupied by another attacking unit
    for (let c of checkOrder) {
      if (this.grid.isFree(p.i + c.i, p.j + c.j) && this.perimeter[1 + c.i][1 + c.j] == 0) {
        return this.grid.gridToWorld(p.i + c.i, p.j + c.j);
      }
    }
    
    return null;
  }


  // Private
  
  public findPerimeterPos(x: number, y: number): { i: number, j: number } {
    let a = this.grid.worldToGrid(x, y);
    let b = this.grid.worldToGrid(this.unit.x, this.unit.y);
    let i = 0;
    let j = 0;

    if (a.i == b.i) i = 1
    else if (a.i < b.i) i = 0
    else if (a.i > b.i) i = 2

    if (a.j == b.j) j = 1;
    else if (a.j < b.j) j = 0;
    else if (a.j > b.j) j = 2;

    return { i: i, j: j };
  }

  update() {
  }

  destroy() {
    this.grid = null;
  }
}