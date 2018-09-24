import { TileGrid } from "../TileGrid";

/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

export class SceneCursorModule {

  public cursor: Phaser.GameObjects.Sprite;
  public onClick:(cursor: Phaser.GameObjects.Sprite) => void;

  private scene: Phaser.Scene;
  private grid: TileGrid;

  constructor(scene: Phaser.Scene, grid: TileGrid) {
    this.scene = scene;
    this.grid = grid;
    
    this.cursor = this.scene.add.sprite(0, 0, "cursor_grid_32x32");
    this.cursor.depth = 1000;
    this.cursor.originX = 1;
    this.cursor.originY = 1;
    this.cursor.disableInteractive();
  }

  public update() {
    this.cursorFollow();
    this.cursorTouchHandler();
  }

  private cursorTouchHandler() {
    if (this.scene.input.activePointer.isDown) {
      if (this.cursor.alpha != 0.5) {
        this.cursor.alpha = 0.5;
      }
    } else {
      if (this.cursor.alpha != 1) {
        this.cursor.alpha = 1;
        if (this.onClick != null) {
          this.onClick(this.cursor);
        }
      }
    }
  }

  private cursorFollow() {
    let worldPosX = Math.round(this.scene.input.activePointer.x / 2) * 2;
    let worldPosY = Math.round(this.scene.input.activePointer.y / 2) * 2;

    let snap = this.grid.snapToGrid(
      worldPosX + this.scene.cameras.main.scrollX, 
      worldPosY + this.scene.cameras.main.scrollY
    );
    this.cursor.x = snap.x + 16;
    this.cursor.y = snap.y + 16;
    this.cursor.scaleX = 1;
    this.cursor.scaleY = 1;
  }

}