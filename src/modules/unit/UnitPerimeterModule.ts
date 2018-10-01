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
  private owner: BaseUnit;

  private perimeter: Array<Array<number>> = [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0]];

  constructor(unit: BaseUnit, grid: TileGrid) {
    this.grid = grid;
    this.owner = unit;
  }


  // Public

  public isSpotFree(x: number, y: number): boolean {
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

  public findPerimeterPos(x: number, y: number): { i: number, j: number } {
    let a = this.grid.worldToGrid(x, y);
    let b = this.grid.worldToGrid(this.owner.x, this.owner.y);
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



  // Overrides
  private lastIJ: { i: number, j: number };
  public update() {
    let currentIJ = this.grid.worldToGrid(this.owner.x, this.owner.y);

    // reset perimeter claims if unit position was changed
    if (this.lastIJ) {
      let positionChanged = this.lastIJ.i != currentIJ.i || this.lastIJ.j != currentIJ.j;
      if (positionChanged) {
        this.revokePerimeterClaims();
        this.notifyClaimsRevoked();
      }
    }

    this.lastIJ = currentIJ;
  }

  destroy() {
    this.owner = null;
    this.grid = null;
    this.perimeter = null;
  }



  // private 
  private revokePerimeterClaims() {
    this.perimeter[0][0] = 0;
    this.perimeter[0][1] = 0;
    this.perimeter[0][2] = 0;

    this.perimeter[1][0] = 0;
    this.perimeter[1][1] = 1; // this my position
    this.perimeter[1][2] = 0;

    this.perimeter[2][0] = 0;
    this.perimeter[2][1] = 0;
    this.perimeter[2][2] = 0;
  }

  private notifyClaimsRevoked() {
  }

  // Shit

  public findEmptySpot(startPos: { x: number, y: number }): { x: number, y: number } {
    let p = this.grid.worldToGrid(this.owner.x, this.owner.y);
    let s = this.grid.worldToGrid(startPos.x, startPos.y);

    let checkOrder = [];

    if (s.i == p.i && s.j == p.j) {
      checkOrder = [
        { i: 0, j: 1 },
        { i: 0, j: -1 },
        { i: - 1, j: 0 },
        { i: 1, j: 0 },
        { i: -1, j: -1 },
        { i: -1, j: 1 },
        { i: 1, j: -1 },
        { i: 1, j: 1 }
      ];
    }

    if (s.i < p.i && s.j < p.j) {
      checkOrder = [
        // x 0 0
        // 0   0
        // 0 0 0
        { i: -1, j: -1 },

        // 0 x 0
        // 0   0
        // 0 0 0
        { i: - 1, j: 0 },

        // 0 0 0
        // x   0
        // 0 0 0
        { i: 0, j: -1 },

        // 0 0 x
        // 0   0
        // 0 0 0
        { i: -1, j: 1 },

        // 0 0 0
        // 0   0
        // x 0 0
        { i: 1, j: -1 },

        // 0 0 0
        // 0   x
        // 0 0 0
        { i: 0, j: 1 },

        // 0 0 0
        // 0   0
        // 0 x 0
        { i: 1, j: 0 },

        // 0 0 0
        // 0   0
        // 0 0 x
        { i: 1, j: 1 }
      ];
    }

    if (s.i < p.i && s.j == p.j) {
      checkOrder = [
        // 0 x 0
        // 0   0
        // 0 0 0
        { i: - 1, j: 0 },

        // x 0 0
        // 0   0
        // 0 0 0
        { i: -1, j: -1 },

        // 0 0 x
        // 0   0
        // 0 0 0
        { i: -1, j: 1 },

        // 0 0 0
        // x   0
        // 0 0 0
        { i: 0, j: -1 },

        // 0 0 0
        // 0   x
        // 0 0 0
        { i: 0, j: 1 },

        // 0 0 0
        // 0   0
        // x 0 0
        { i: 1, j: -1 },

        // 0 0 0
        // 0   0
        // 0 0 x
        { i: 1, j: 1 },

        // 0 0 0
        // 0   0
        // 0 x 0
        { i: 1, j: 0 },
      ];
    }

    if (s.i < p.i && s.j > p.j) {
      checkOrder = [
        // 0 0 x
        // 0   0
        // 0 0 0
        { i: -1, j: 1 },

        // 0 x 0
        // 0   0
        // 0 0 0
        { i: - 1, j: 0 },

        // 0 0 0
        // 0   x
        // 0 0 0
        { i: 0, j: 1 },

        // x 0 0
        // 0   0
        // 0 0 0
        { i: -1, j: -1 },

        // 0 0 0
        // 0   0
        // 0 0 x
        { i: 1, j: 1 },

        // 0 0 0
        // x   0
        // 0 0 0
        { i: 0, j: -1 },

        // 0 0 0
        // 0   0
        // 0 x 0
        { i: 1, j: 0 },

        // 0 0 0
        // 0   0
        // x 0 0
        { i: 1, j: -1 },
      ];
    }

    if (s.i == p.i && s.j < p.j) {
      checkOrder = [
        // 0 0 0
        // x   0
        // 0 0 0
        { i: 0, j: -1 },

        // x 0 0
        // 0   0
        // 0 0 0
        { i: -1, j: -1 },

        // 0 0 0
        // 0   0
        // x 0 0
        { i: 1, j: -1 },

        // 0 x 0
        // 0   0
        // 0 0 0
        { i: - 1, j: 0 },

        // 0 0 0
        // 0   0
        // 0 x 0
        { i: 1, j: 0 },

        // 0 0 0
        // 0   x
        // 0 0 0
        { i: 0, j: 1 },

        // 0 0 x
        // 0   0
        // 0 0 0
        { i: -1, j: 1 },

        // 0 0 0
        // 0   0
        // 0 0 x
        { i: 1, j: 1 },
      ];
    }

    if (s.i == p.i && s.j > p.j) {
      checkOrder = [
        // 0 0 0
        // 0   x
        // 0 0 0
        { i: 0, j: 1 },

        // 0 0 0
        // 0   0
        // 0 0 x
        { i: 1, j: 1 },

        // 0 0 x
        // 0   0
        // 0 0 0
        { i: -1, j: 1 },

        // 0 x 0
        // 0   0
        // 0 0 0
        { i: - 1, j: 0 },

        // 0 0 0
        // 0   0
        // 0 x 0
        { i: 1, j: 0 },

        // 0 0 0
        // x   0
        // 0 0 0
        { i: 0, j: -1 },

        // x 0 0
        // 0   0
        // 0 0 0
        { i: -1, j: -1 },

        // 0 0 0
        // 0   0
        // x 0 0
        { i: 1, j: -1 },
      ];
    }

    if (s.i > p.i && s.j < p.j) {
      checkOrder = [
        // 0 0 0
        // 0   0
        // x 0 0
        { i: 1, j: -1 },

        // 0 0 0
        // x   0
        // 0 0 0
        { i: 0, j: -1 },

        // 0 0 0
        // 0   0
        // 0 x 0
        { i: 1, j: 0 },

        // x 0 0
        // 0   0
        // 0 0 0
        { i: -1, j: -1 },

        // 0 0 0
        // 0   0
        // 0 0 x
        { i: 1, j: 1 },

        // 0 x 0
        // 0   0
        // 0 0 0
        { i: - 1, j: 0 },

        // 0 0 0
        // 0   x
        // 0 0 0
        { i: 0, j: 1 },

        // 0 0 x
        // 0   0
        // 0 0 0
        { i: -1, j: 1 },
      ];
    }

    if (s.i > p.i && s.j == p.j) {
      checkOrder = [
        // 0 0 0
        // 0   0
        // 0 x 0
        { i: 1, j: 0 },

        // 0 0 0
        // 0   0
        // x 0 0
        { i: 1, j: -1 },

        // 0 0 0
        // 0   0
        // 0 0 x
        { i: 1, j: 1 },

        // 0 0 0
        // x   0
        // 0 0 0
        { i: 0, j: -1 },

        // 0 0 0
        // 0   x
        // 0 0 0
        { i: 0, j: 1 },

        // 0 0 x
        // 0   0
        // 0 0 0
        { i: -1, j: 1 },

        // x 0 0
        // 0   0
        // 0 0 0
        { i: -1, j: -1 },

        // 0 x 0
        // 0   0
        // 0 0 0
        { i: - 1, j: 0 },
      ];
    }

    if (s.i > p.i && s.j > p.j) {
      checkOrder = [
        // 0 0 0
        // 0   0
        // 0 0 x
        { i: 1, j: 1 },

        // 0 0 0
        // 0   x
        // 0 0 0
        { i: 0, j: 1 },

        // 0 0 0
        // 0   0
        // 0 x 0
        { i: 1, j: 0 },

        // 0 0 0
        // 0   0
        // x 0 0
        { i: 1, j: -1 },

        // 0 0 x
        // 0   0
        // 0 0 0
        { i: -1, j: 1 },

        // 0 0 0
        // x   0
        // 0 0 0
        { i: 0, j: -1 },

        // 0 x 0
        // 0   0
        // 0 0 0
        { i: - 1, j: 0 },

        // x 0 0
        // 0   0
        // 0 0 0
        { i: -1, j: -1 },
      ];
    }

    // check if nearby spot is free on map and not occupied by another attacking unit
    for (let c of checkOrder) {
      if (this.grid.isFree(p.i + c.i, p.j + c.j) && this.perimeter[1 + c.i][1 + c.j] == 0) {
        return this.grid.gridToWorld(p.i + c.i, p.j + c.j);
      }
    }

    return null;
  }
}