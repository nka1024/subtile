
export class TileGrid {

  private grid: Phaser.GameObjects.Image[];
  private tiles: Phaser.GameObjects.Image[][];
  private data: number[][];

  private scene: Phaser.Scene;
  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.data = [];
    this.tiles = [];
    for (let i = 0; i < 46; i++) {
      this.data[i] = [];
      this.tiles[i] = [];
      for (let j = 0; j < 46; j++) {
        this.data[i][j] = 0;
        this.tiles[i][j] = null;
      }
    }
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
        img.depth = 1000;;
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
        this.tiles[i][j] = this.createTile(i, j, color);
      }
    }
  }

  private createTile(i: number, j: number, color: string):Phaser.GameObjects.Image {
    let img = new Phaser.GameObjects.Image(this.scene, 0, 0, null);
    img.scaleX = 2;
    img.scaleY = 2;
    img.setTexture('grid_tile_' + color + '_16_a50');
    var wc = this.gridToWorld(i, j)
    img.x = wc.x + 16;
    img.y = wc.y + 16;
    this.scene.add.existing(img);
    return img;
  }

  public editTile(cursor: Phaser.GameObjects.Image, color: string) {
    let gridPos = this.worldToGrid(cursor.x, cursor.y);
    let currentTile = this.tiles[gridPos.i][gridPos.j];
    if (currentTile != null) {
      currentTile.destroy();
    }
    let img = this.createTile(gridPos.i, gridPos.j, color);
    this.tiles[gridPos.i][gridPos.j] = img;
    this.data[gridPos.i][gridPos.j] = "red" ? 1 : 0;
  }

  public cursorFollow(cursor: Phaser.GameObjects.Image) {
    let screenPosX = Math.round(this.scene.input.activePointer.x / 2) * 2;
    let screenPosY = Math.round(this.scene.input.activePointer.y / 2) * 2;
    let worldPosX = screenPosX + this.scene.cameras.main.scrollX;
    let worldPosY = screenPosY + this.scene.cameras.main.scrollY;

    let snapPos = this.snapToGrid(worldPosX, worldPosY)
    cursor.x = snapPos.x + 16;
    cursor.y = snapPos.y + 16;
  }

  public export():any {
    return this.data;
  }

  public import(grid:any) {
    this.data = grid;
  }

  private gridToWorld(i: number, j: number): any {
    return {
      x: j * 32,
      y: i * 32
    };
  }
  private worldToGrid(x: number, y: number): any {
    return {
      i: Math.floor(y / 32),
      j: Math.floor(x / 32)
    };
  }

  private snapToGrid(x: number, y: number): any {
    let gridPos = this.worldToGrid(x, y);
    return this.gridToWorld(gridPos.i, gridPos.j);
  }

  get visible() {
    return this.grid != null;
  }
}