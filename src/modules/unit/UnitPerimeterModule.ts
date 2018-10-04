/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { IUnitModule } from "../interface/IUnitModule";
import { TileGrid } from "../../TileGrid";
import { BaseUnit } from "../../actors/BaseUnit";
import { Point, Tile } from "../../types/Position";

export type UnitPerimeterSpot = {
  i: number;
  j: number;
  claimed: BaseUnit;
  next: UnitPerimeterSpot;
  prev: UnitPerimeterSpot;
}

export class UnitPerimeterModule extends Phaser.Events.EventEmitter implements IUnitModule {
  private grid: TileGrid;
  private owner: BaseUnit;

  private lastIJ: { i: number, j: number };

  private perimeter: Array<Array<UnitPerimeterSpot>>;

  constructor(unit: BaseUnit, grid: TileGrid) {
    super();

    this.grid = grid;
    this.owner = unit;

    this.perimeter = [
      [{ i: 0, j: 0, claimed: null, next: null, prev: null },
      { i: 0, j: 1, claimed: null, next: null, prev: null },
      { i: 0, j: 2, claimed: null, next: null, prev: null }],
      [{ i: 1, j: 0, claimed: null, next: null, prev: null },
      { i: 1, j: 1, claimed: null, next: null, prev: null },  // this is owner
      { i: 1, j: 2, claimed: null, next: null, prev: null }],
      [{ i: 2, j: 0, claimed: null, next: null, prev: null },
      { i: 2, j: 1, claimed: null, next: null, prev: null },
      { i: 2, j: 2, claimed: null, next: null, prev: null }]
    ];

    this.perimeter[0][0].next = this.perimeter[0][1];
    this.perimeter[0][1].next = this.perimeter[0][2];
    this.perimeter[0][2].next = this.perimeter[1][2];
    this.perimeter[1][2].next = this.perimeter[2][2];
    this.perimeter[2][2].next = this.perimeter[2][1];
    this.perimeter[2][1].next = this.perimeter[2][0];
    this.perimeter[2][0].next = this.perimeter[1][0];
    this.perimeter[1][0].next = this.perimeter[0][0];

    this.perimeter[0][0].prev = this.perimeter[1][0];
    this.perimeter[1][0].prev = this.perimeter[2][0];
    this.perimeter[2][0].prev = this.perimeter[2][1];
    this.perimeter[2][1].prev = this.perimeter[2][2];
    this.perimeter[2][2].prev = this.perimeter[1][2];
    this.perimeter[1][2].prev = this.perimeter[0][2];
    this.perimeter[0][2].prev = this.perimeter[0][1];
    this.perimeter[0][1].prev = this.perimeter[0][0];
  }


  // Public

  public findRelativePerimeterSpot(p: Point): UnitPerimeterSpot {
    let a = this.grid.worldToGrid(p);
    let b = this.grid.worldToGrid(this.owner);
    let i = 0;
    let j = 0;

    if (a.i == b.i) i = 1
    else if (a.i < b.i) i = 0
    else if (a.i > b.i) i = 2

    if (a.j == b.j) j = 1;
    else if (a.j < b.j) j = 0;
    else if (a.j > b.j) j = 2;

    return this.perimeter[i][j];
  }

  public perimeterSpotToXY(spot: UnitPerimeterSpot): Point {
    let p = this.grid.worldToGrid(this.owner);
    let tile = {
      i: p.i + spot.i - 1,
      j: p.j + spot.j - 1
    }
    return this.grid.gridToWorld(tile);
  }


  /// returns a spot that is attacked or defended by unit
  // public spotOfUnit(unit: BaseUnit): UnitPerimeterSpot {
  //   let result = null;
  //   this.forEachSpot((spot: UnitPerimeterSpot) => {
  //     if (spot.attacker == unit || spot.defender == unit) {
  //       result = spot;
  //       return false;
  //     }
  //     return true;
  //   });
  //   return result;
  // }




  // Overrides

  public update() {
    let currentIJ = this.grid.worldToGrid(this.owner);

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
    this.forEachSpot((spot: UnitPerimeterSpot) => {
      if (spot.i == 1 && spot.j == 1) {
        spot.claimed = this.owner;
      } else {
        spot.claimed = null;
      }
      return true;
    }, true)
  }

  private notifyClaimsRevoked() {
    this.emit('revoke_all_claims');
  }

  // iterate all spots except middle
  private forEachSpot(callback: (spot: UnitPerimeterSpot) => boolean, includeMiddlee: boolean = false) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!(i == 1 && j == 1) || includeMiddlee) {
          if (!callback(this.perimeter[i][j])) {
            return;
          };
        }
      }
    }
  }

  // Core logic

  public findEmptyPerimeterSpot(from: Point, side: string): UnitPerimeterSpot {
    let p = this.grid.worldToGrid(this.owner);
    let checkOrder = this.spotCheckOrder(this.grid.worldToGrid(from));

    // check if nearby spot is free on map and not occupied by another attacking unit
    for (let c of checkOrder) {
      let claimed = this.perimeter[1 + c.i][1 + c.j].claimed != null;
      let tile = { i: p.i + c.i, j: p.j + c.j};
      if (this.grid.isFree(tile) && !claimed) {
        return this.perimeter[c.i + 1][c.j + 1];
      }
    }

    return null;
  }

  public isWalkableSpot(spot: UnitPerimeterSpot): boolean {
    let p = this.grid.worldToGrid(this.owner);
    let tile = { i: p.i + spot.i - 1, j: p.j + spot.j - 1};
    return this.grid.isFree(tile);
  }

  private spotCheckOrder(s: Tile): Tile[] {
    let p = this.grid.worldToGrid(this.owner);
    let result = null;

    if (s.i == p.i && s.j == p.j) {
      result = [
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
      result = [
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
      result = [
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
      result = [
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
      result = [
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
      result = [
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
      result = [
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
      result = [
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
      result = [
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

    return result;
  }
}