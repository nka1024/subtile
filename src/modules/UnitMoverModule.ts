
/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/
import { TileGrid } from "../TileGrid";
import { IUnit } from "../actors/IUnit";

export class UnitMoverModule {

  private unit: IUnit;
  private scene: Phaser.Scene;
  private grid: TileGrid;

  private dest: { i: number, j: number };
  private path: { x: number, y: number }[];
  private pathDots: Phaser.GameObjects.Image[];

  private nextDest: { x: number, y: number };
  private pathBySteps: { x: number, y: number }[];
  private speed: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);

  constructor(unit: IUnit, scene: Phaser.Scene, grid: TileGrid) {
    this.unit = unit;
    this.scene = scene;
    this.grid = grid;
  }


  // Public

  public handleMoveTouch(dest: { x: number, y: number }) {
    let grid = this.grid;
    let gridDest = grid.worldToGrid(dest.x, dest.y);
    let gridPos = grid.worldToGrid(this.unit.x, this.unit.y);

    //  if there's no dest or new dest given, find new path
    if (this.dest == null || this.dest.i != gridDest.i || this.dest.j != gridDest.j) {
      this.dest = gridDest;
      grid.findPath(gridPos.j, gridPos.i, gridDest.j, gridDest.i, (path) => {
        this.path = path;
        this.drawPathDots(grid);
      });
    } else {
      // destination confirmed, start moving
      this.startMoving(grid);
    }
  }

  public update() {
    if (this.nextDest != null) {
      this.unit.playUnitAnim('walk', true);
    } else {
      this.unit.playUnitAnim('idle', true);
    }

    if (this.speed.x < 0) this.unit.flipX = true;
    else if (this.speed.x > 0) this.unit.flipX = false;

    if (this.nextDest != null) {
      this.moveNextStep();
    }
  }

  public destroy() {
    this.destroyAllDots();
  }


  // Private

  private startMoving(grid: TileGrid) {
    if (this.path == null) return;

    this.pathBySteps = [];

    let start = null
    for (let step of this.path) {
      let gridPos = { i: step.y, j: step.x };
      let worldPos = grid.gridToWorld(gridPos.i, gridPos.j);
      if (start == null) {
        start = worldPos
      } else {
        this.pathBySteps.push(worldPos);
      }
    }
    this.nextDest = this.pathBySteps[0];

    this.destroyNextDot();
  }

  private moveNextStep() {
    let distance = 1;
    let finished = this.stepTowards(this.nextDest.x + 16, this.nextDest.y + 16, distance);
    if (finished) {
      // finished stp
      this.pathBySteps.splice(0, 1);
      if (this.pathBySteps.length > 0) {
        this.nextDest = this.pathBySteps[0];
        this.destroyNextDot();
      } else {
        // finished path
        this.nextDest = null;
        this.destroyNextDot();
      }
    }
  }

  private stepTowards(x: number, y: number, distance: number): boolean {
    this.speed.x = x - this.unit.x;
    this.speed.y = y - this.unit.y;
    if (this.speed.length() <= distance) {
      this.unit.x = x;
      this.unit.y = y;
      return true;
    }
    this.speed = this.normalize(this.speed, distance);
    this.unit.x += this.speed.x;
    this.unit.y += this.speed.y;
    return false;
  }

  private normalize(vec: Phaser.Math.Vector2, newLen: number): Phaser.Math.Vector2 {
    var len = vec.x * vec.x + vec.y * vec.y;
    if (len > 0) {
      len = newLen / Math.sqrt(len);
      vec.x = vec.x * len;
      vec.y = vec.y * len;
    }
    return vec;
  }

  // dot path images

  private drawPathDots(grid: TileGrid) {
    this.destroyAllDots();

    if (this.path == null) {
      return;
    }

    let dots = [];
    for (let pos of this.path) {
      let worldPos = grid.gridToWorld(pos.y, pos.x);
      let img = this.scene.add.image(worldPos.x + 16, worldPos.y + 16, "path_mid_14x14");
      dots.push(img)
    }
    this.pathDots = dots;
  }

  private destroyNextDot() {
    if (this.pathDots.length > 0) {
      this.pathDots.splice(0, 1)[0].destroy();
    }
  }

  private destroyAllDots() {
    if (this.pathDots) {
      for (let dot of this.pathDots) {
        dot.destroy()
      }
      this.pathDots = null;
    }
  }

}