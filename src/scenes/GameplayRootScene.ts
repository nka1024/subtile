/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { WindowManager } from "../windows/WindowManager";
import { ASSETS, AssetsLoader } from "../AssetsLoader";
import { TileGrid } from "../TileGrid";
import { Player } from "../actors/Player";

export class GameplayRootScene extends Phaser.Scene {

  private grid: TileGrid;
  private cursor: Phaser.GameObjects.Sprite;
  private player: Player;

  constructor() {
    super({
      key: "GameplayRootScene"
    });
  }

  preload() {
    AssetsLoader.preload(this);
  }

  create(data): void {
    this.cameras.main.setBackgroundColor(0x1f1f1f);
    WindowManager.initialize();

    this.grid = new TileGrid(this);
    this.cursor = this.add.sprite(0, 0, "cursor_grid_32x32");
    this.cursor.depth = 1000;
    this.cursor.originX = 1;
    this.cursor.originY = 1;
    this.cursor.disableInteractive();
    // this.cursor.setInteractive();

    this.importMap(this.cache.json.get('map'));

    let player = new Player(this, 444, 280);
    player.depth = player.y + 16;
    this.add.existing(player);
    this.player = player;
  }

  private importMap(map: any) {
    // cleanup
    for (let child of this.children.getAll()) {
      // exclude cursor
      if ((child as Phaser.GameObjects.Image).depth != 1000)
        child.destroy()
    }

    // create grid from config
    this.grid.import(map.grid);
    // create objects from config      
    for (let item of map.objects) {
      this.createObjectFromConfig(item);
    }
  }

  update(): void {
    this.cursorFollow();
    this.cameraDrag();
    this.cursorTouchHandler();

    if (this.player) this.player.update();
    if (this.grid) this.grid.update();
  }

  private cursorTouchHandler() {
    if (this.input.activePointer.isDown) {
      if (this.cursor.alpha != 0.5) {
        this.cursor.alpha = 0.5;
      }
    } else {
      if (this.cursor.alpha != 1) {
        this.cursor.alpha = 1;
        this.player.handleMoveTouch(this.cursor, this.grid);
      }
    }
  }

  private cursorFollow() {
    let worldPosX = Math.round(this.input.activePointer.x / 2) * 2;
    let worldPosY = Math.round(this.input.activePointer.y / 2) * 2;

    
    // this.cursor.x = Math.round(worldPosX + this.cameras.main.scrollX);
    // this.cursor.y = Math.round(worldPosY + this.cameras.main.scrollY);
    let snap = this.grid.snapToGrid(
      worldPosX + this.cameras.main.scrollX, 
      worldPosY + this.cameras.main.scrollY
    );
    this.cursor.x = snap.x + 16;
    this.cursor.y = snap.y + 16;
    this.cursor.scaleX = 1;
    this.cursor.scaleY = 1;

  }

  private prevPointerX: number;
  private prevPointerY: number;
  private cameraDrag() {
    let ptr = this.input.activePointer;
    if (ptr.isDown) {
      if (!ptr.justDown) {
        this.cameras.main.scrollX -= (ptr.x - this.prevPointerX)
        this.cameras.main.scrollY -= (ptr.y - this.prevPointerY)
      }
      this.prevPointerX = ptr.x;
      this.prevPointerY = ptr.y
    }

    if (ptr.justUp) {
      this.prevPointerX = 0;
      this.prevPointerY = 0;
    }
  }

  private createObjectFromConfig(data: any) {
    let obj = new Phaser.GameObjects.Image(this, 0, 0, null);
    obj.scaleX = 2;
    obj.scaleY = 2;
    obj.originX = 0.5;
    obj.originY = 1;
    obj.setTexture(data.texture);
    obj.x = data.x;
    obj.y = data.y;
    obj.depth = data.depth;
    this.add.existing(obj);
  }

}
