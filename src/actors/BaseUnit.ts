/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { IUnit } from "./IUnit";
import { UnitMoverModule } from "../modules/unit/UnitMoverModule";
import { ProgressModule } from "../modules/unit/ProgressModule";
import { UnitModuleCore } from "../modules/UnitModuleCore";
import { TileGrid } from "../TileGrid";

export class BaseUnit extends Phaser.GameObjects.Sprite implements IUnit {

  public id: string;
  public toDestroy: boolean;
  public mover: UnitMoverModule;
  public progress: ProgressModule;


  protected core: UnitModuleCore;


  constructor(scene: Phaser.Scene, x: number, y: number, grid: TileGrid, texture: string) {
    super(scene, x, y, texture);

    this.grid = grid;
    this.mover = new UnitMoverModule(this, scene, grid);
    this.progress = new ProgressModule(this, scene);
    this.core = new UnitModuleCore([this.mover, this.progress]);

    this.setInteractive();
  }


  // perimeter
  private grid: TileGrid;
  private perimeter: Array<Array<number>> = [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0]];

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
    let p = this.grid.worldToGrid(this.x, this.y);

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
  
  private findPerimeterPos(x: number, y: number): { i: number, j: number } {
    let a = this.grid.worldToGrid(x, y);
    let b = this.grid.worldToGrid(this.x, this.y);
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

  public playUnitAnim(key: string, ignoreIfPlaying: boolean) {
    throw ("NOT IMPLEMENTED");
  }

  public update() {
    this.core.update();
    if (this.toDestroy) {
      this.destroy();
    }
  }

  public destroy() {
    this.core.destroy();
    this.core = null;
    this.mover = null;
    this.progress = null;
  }

}