/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { IUnitModule } from "../interface/IUnitModule";
import { TileGrid } from "../../TileGrid";
import { BaseUnit } from "../../actors/BaseUnit";

export type UnitPerimeterSpot = {
  i: number;
  j: number;
  attacker: BaseUnit;
  defender: BaseUnit
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
      [{ i: 0, j: 0, attacker: null, defender: null },
      { i: 0, j: 1,  attacker: null, defender: null },
      { i: 0, j: 2,  attacker: null, defender: null }],
      [{ i: 1, j: 0, attacker: null, defender: null },
      { i: 1, j: 1,  attacker: unit, defender: unit },  // this is owner
      { i: 1, j: 2,  attacker: null, defender: null }],
      [{ i: 2, j: 0, attacker: null, defender: null },
      { i: 2, j: 1,  attacker: null, defender: null },
      { i: 2, j: 2,  attacker: null, defender: null }]
    ];

    // this.perimeter = [
    //   [{ i: 0, j: 0, claimed: false, attacker: null, defender: null },
    //   { i: 0, j: 1,  claimed: false, attacker: null, defender: null },
    //   { i: 0, j: 2,  claimed: false, attacker: null, defender: null }],
    //   [{ i: 1, j: 0, claimed: false, attacker: null, defender: null },
    //   { i: 1, j: 1,  claimed: true,  attacker: unit, defender: unit },  // this is owner
    //   { i: 1, j: 2,  claimed: false, attacker: null, defender: null }],
    //   [{ i: 2, j: 0, claimed: false, attacker: null, defender: null },
    //   { i: 2, j: 1,  claimed: false, attacker: null, defender: null },
    //   { i: 2, j: 2,  claimed: false, attacker: null, defender: null }]
    // ];

  }



  // Public

  public findRelativePerimeterSpot(x: number, y: number): UnitPerimeterSpot {
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

    return this.perimeter[i][j];
  }


  public perimeterSpotToXY(spot: UnitPerimeterSpot): { x: number, y: number } {
    let p = this.grid.worldToGrid(this.owner.x, this.owner.y);
    return this.grid.gridToWorld(p.i + spot.i - 1, p.j + spot.j - 1)
  }


  // Overrides
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
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (i != 1 && j != 1)
          // this.perimeter[i][j].claimed = false;
        this.perimeter[i][j].attacker = null;
        this.perimeter[i][j].defender = null;
      }
    }
  }

  private notifyClaimsRevoked() {
    this.emit('revoke_all_claims');
  }


  // Core logic

  public findEmptyPerimeterSpot(sourceXY: { x: number, y: number }, side: string): UnitPerimeterSpot {
    let p = this.grid.worldToGrid(this.owner.x, this.owner.y);
    let checkOrder = this.spotCheckOrder(this.grid.worldToGrid(sourceXY.x, sourceXY.y));

    // check if nearby spot is free on map and not occupied by another attacking unit
    for (let c of checkOrder) {
      let claimed = false;
      if (side == 'attack') {
        claimed = this.perimeter[1 + c.i][1 + c.j].attacker != null;
      } else if (side == 'defend') {
        claimed = this.perimeter[1 + c.i][1 + c.j].defender != null;
      }
      if (this.grid.isFree(p.i + c.i, p.j + c.j) && !claimed) {
        return this.perimeter[c.i + 1][c.j + 1];
      }
    }

    return null;
  }

  private spotCheckOrder(s: { i: number, j: number }): Array<{ i: number, j: number }> {
    let p = this.grid.worldToGrid(this.owner.x, this.owner.y);
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