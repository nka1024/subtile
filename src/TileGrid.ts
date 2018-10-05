/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { js as easystar } from "easystarjs";
import { UI_DEPTH } from "./const/const";
import { Point, Tile } from "./types/Position";
import { BaseUnit } from "./actors/BaseUnit";
import { SquadUnit } from "./actors/SquadUnit";

export class TileGrid {

  private grid: Phaser.GameObjects.Image[];
  private tiles: Phaser.GameObjects.Image[][];
  private data: number[][];
  private claims: BaseUnit[][];
  private dests: number[][];

  private scene: Phaser.Scene;
  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.data = [];
    this.tiles = [];
    this.claims = [];
    this.dests = [];
    for (let i = 0; i < 24; i++) {
      this.data[i] = [];
      this.tiles[i] = [];
      this.claims[i] = [];
      this.dests[i] = [];
      for (let j = 0; j < 24; j++) {
        this.data[i][j] = 0;
        this.tiles[i][j] = null;
        this.claims[i][j] = null;
        this.dests[i][j] = 0;
      }
    }

    this.initPathfinder();
    this.pathfinder.setGrid(this.data);
  }

  public toggleGrid() {
    // hide grid if it exists
    if (this.grid != null) {
      for (let img of this.grid) {
        img.destroy();
      }
      this.grid = null;

      for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 24; j++) {
          this.tiles[i][j].destroy();
          this.tiles[i][j] = null;
        }
      }
      return;
    }

    var grid = [];
    // grid image
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let img = new Phaser.GameObjects.Image(this.scene, 0, 0, null);
        img.scaleX = 2;
        img.scaleY = 2;
        img.originX = 0;
        img.originY = 0;
        img.setTexture("grid_128_30");
        img.x = 256 * i;
        img.y = 256 * j;
        img.depth = UI_DEPTH.EDITOR_GRID_FRAME;
        this.scene.add.existing(img);
        grid.push(img);
      }
    }
    this.grid = grid;

    // grid tiles
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 24; j++) {
        let n = this.data[i][j];
        let color = n == 0 ? "green" : "red";
        this.tiles[i][j] = this.createTile({ i: i, j: j }, color);
      }
    }
  }

  public getTileIJ(p: Point): any {
    try {
      if (p.x < 0 || p.y < 0) throw ('cant be negative')
      let gridPos = this.worldToGrid(p);
      let tile = this.data[gridPos.i][gridPos.j];
      return {
        i: gridPos.i,
        j: gridPos.j,
        walkable: tile == 0
      };
    } catch (e) {
      // console.log(e)
    }
    return null;
  }

  public isFree(tile: Tile): boolean {
    return this.legit(tile) &&
      this.data[tile.i][tile.j] == 0 &&
      this.claims[tile.i][tile.j] == null;
  }

  public isFreeDest(tile: Tile): boolean {
    return this.legit(tile) && this.dests[tile.i][tile.j] == 0;
  }

  public legit(tile: Tile): boolean {
    if (tile.i < 0 && tile.i >= this.data.length) return false;
    if (tile.j < 0 && tile.j >= this.data.length) return false;
    return true;
  }

  public claimDest(tile: Tile) {
    this.dests[tile.i][tile.j] = 1;
  }

  public unclaimDest(tile: Tile) {
    this.dests[tile.i][tile.j] = 0;
  }

  public claim(tile: Tile, unit: BaseUnit) {
    this.claims[tile.i][tile.j] = unit;
  }

  public unclaim(tile: Tile, unit: BaseUnit) {
    this.claims[tile.i][tile.j] = null;
  }

  public findClosestFreeTile(to: Tile): Tile {
    let work = { i: 0, j: 0 }
    for (let radius = 1; radius <= 4; radius++) {
      for (let i = -radius; i <= radius; i++) {
        for (let j = -radius; j <= radius; j++) {
          work.i = to.i + i;
          work.j = to.j + j;
          if (this.isFree(work) && this.isFreeDest(work)) {
            return work;
          }
        }
      }
    }
    return null;
  }

  public findClosestUnits(to: Tile, side: string, range: number): SquadUnit[] {
    let result = [];
    let work = { i: 0, j: 0 }
    for (let radius = range; radius <= range; radius++) {
      for (let i = -radius; i <= radius; i++) {
        for (let j = -radius; j <= radius; j++) {
          work.i = to.i + i;
          work.j = to.j + j;
          if (this.legit(work)) {
            let squad = this.claims[work.i][work.j] as SquadUnit;
            if (squad) {
              if (squad.side == side)
                result.push(squad);
            }
          }
        }
      }
    }
    return result;
  }

  private createTile(tile: Tile, color: string): Phaser.GameObjects.Image {
    let img = new Phaser.GameObjects.Image(this.scene, 0, 0, null);
    img.scaleX = 2;
    img.scaleY = 2;
    img.setTexture('grid_tile_' + color + '_16_a50');
    img.depth = UI_DEPTH.EDITOR_GRID_TILE;
    var wc = this.gridToWorld(tile)
    img.x = wc.x + 16;
    img.y = wc.y + 16;
    this.scene.add.existing(img);
    return img;
  }

  public editTile(cursor: Phaser.GameObjects.Image, color: string) {
    let tile = this.worldToGrid(cursor);
    let currentTile = this.tiles[tile.i][tile.j];
    if (currentTile != null) {
      currentTile.destroy();
    }
    let img = this.createTile(tile, color);
    this.tiles[tile.i][tile.j] = img;
    this.data[tile.i][tile.j] = "red" ? 1 : 0;

    // todo: optimize?
    this.pathfinder.setGrid(this.data);
  }

  public cursorFollow(cursor: Phaser.GameObjects.Image) {
    let screenPosX = Math.round(this.scene.input.activePointer.x / 2) * 2;
    let screenPosY = Math.round(this.scene.input.activePointer.y / 2) * 2;
    let worldPosX = screenPosX + this.scene.cameras.main.scrollX;
    let worldPosY = screenPosY + this.scene.cameras.main.scrollY;

    let snapPos = this.snapToGrid({ x: worldPosX, y: worldPosY })
    cursor.x = snapPos.x + 16;
    cursor.y = snapPos.y + 16;
  }

  public export(): any {
    return this.data;
  }

  public import(grid: any) {
    this.data = grid;
    this.pathfinder.setGrid(this.data);
  }

  public gridToWorld(tile: Tile): Point {
    return {
      x: tile.j * 32,
      y: tile.i * 32
    };
  }
  public worldToGrid(p: Point): Tile {
    return {
      i: Math.floor(p.y / 32),
      j: Math.floor(p.x / 32)
    };
  }

  public snapToGrid(p: Point): Point {
    let gridPos = this.worldToGrid(p);
    return this.gridToWorld(gridPos);
  }

  get visible() {
    return this.grid != null;
  }

  public distanceXY(a: Point, b: Point, abs: boolean = false): Tile {
    let ap = this.worldToGrid(a);
    let bp = this.worldToGrid(b);
    return this.distance(ap, bp, abs);
  }

  public distance(a: Tile, b: Tile, abs: boolean = false): Tile {
    if (abs)
      return { i: Math.abs(a.i - b.i), j: Math.abs(a.j - b.j) };
    else
      return { i: a.i - b.i, j: a.j - b.j };
  }


  // Pathfinding with Easystarjs

  private pathfinder: easystar;
  private initPathfinder() {
    this.pathfinder = new easystar();
    this.pathfinder.enableSync();
    this.pathfinder.enableDiagonals();
    this.pathfinder.setAcceptableTiles([0]);
  }

  public findPath(from: Tile, to: Tile, callback: (path: Tile[]) => void): number {
    return this.pathfinder.findPath(from.j, from.i, to.j, to.i, (path: Point[]) => {
      let result = null;
      if (path) {
        result = path.map((v, i, arr) => {
          return { i: v.y, j: v.x };
        });
      }
      callback(result);
    });
  }

  public update() {
    this.pathfinder.calculate();
  }
}