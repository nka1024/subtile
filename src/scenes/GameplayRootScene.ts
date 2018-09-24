/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { WindowManager } from "../windows/WindowManager";
import { ASSETS, AssetsLoader } from "../AssetsLoader";
import { TileGrid } from "../TileGrid";
import { HeroUnit } from "../actors/HeroUnit";
import { SquadUnit } from "../actors/SquadUnit";
import { UnitsPanel } from "../windows/UnitsPanel";
import { ContextObjectPopup } from "../windows/ContextObjectWindow";
import { IUnit } from "../actors/IUnit";

export class GameplayRootScene extends Phaser.Scene {

  private grid: TileGrid;
  private cursor: Phaser.GameObjects.Sprite;
  private player: HeroUnit;
  private unit: SquadUnit;
  private enemyUnit: SquadUnit;

  private selectedUnit:IUnit;
  private contextWindow:ContextObjectPopup;

  private objectClickedInThisFrame:Boolean;

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

    this.importMap(this.cache.json.get('map'));

    let player = new HeroUnit(this, 444, 280, this.grid);
    player.depth = player.y + 16;
    this.add.existing(player);
    this.player = player;
    this.selectedUnit = player;

    let units = new UnitsPanel();
    units.show();
    units.playerButton.addEventListener('click', () => {
      this.selectedUnit = this.player;
    });
    units.unit1Button.addEventListener('click', () => {
      if (!this.unit) {
        let gridPos = this.grid.worldToGrid(this.player.x, this.player.y);
        let worldPos = this.grid.gridToWorld(gridPos.i, gridPos.j - 1);
        this.unit = new SquadUnit(this, worldPos.x + 16, worldPos.y + 16, this.grid, 1);
        this.add.existing(this.unit)
      }
      this.selectedUnit = this.unit;
    });

    let worldPos = this.grid.gridToWorld(10, 14);
    this.enemyUnit = new SquadUnit(this, worldPos.x + 16, worldPos.y + 16, this.grid, 2);
    this.enemyUnit.on('pointerdown', () => {
      this.showContextWindowForObject(this.enemyUnit);
      this.objectClickedInThisFrame = true;
    });
    this.add.existing(this.enemyUnit);


  }

  private showContextWindowForObject(object: Phaser.GameObjects.Sprite) {
    this.destroyContextWindow();

    let x = object.x - this.cameras.main.scrollX;
    let y = object.y - this.cameras.main.scrollY;
    this.contextWindow = new ContextObjectPopup(x - ContextObjectPopup.defaultWidth/2, y + 16);
    this.contextWindow.onDestroy = (w) => {
      this.contextWindow = null
    };
    this.contextWindow.show();
  }

  private destroyContextWindow() {
    if (this.contextWindow != null) {
      this.contextWindow.show();
      this.contextWindow.destroy();
      this.contextWindow = null;
    }
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
    // close context window if clicked outside of it
    if (this.input.activePointer.justDown && !this.objectClickedInThisFrame) {
      this.destroyContextWindow();
    }
    // dont handle touches if context window is shown
    if (this.contextWindow == null) {
      this.cursorFollow();
      this.cameraDrag();
      this.cursorTouchHandler();
    }

    if (this.player) this.player.update();
    if (this.unit) this.unit.update();
    if (this.enemyUnit) this.enemyUnit.update();
    if (this.grid) this.grid.update();

    this.objectClickedInThisFrame = false;
  }

  private cursorTouchHandler() {
    if (this.input.activePointer.isDown) {
      if (this.cursor.alpha != 0.5) {
        this.cursor.alpha = 0.5;
      }
    } else {
      if (this.cursor.alpha != 1) {
        this.cursor.alpha = 1;
        this.selectedUnit.mover.handleMoveTouch(this.cursor);
      }
    }
  }

  private cursorFollow() {
    let worldPosX = Math.round(this.input.activePointer.x / 2) * 2;
    let worldPosY = Math.round(this.input.activePointer.y / 2) * 2;

    let snap = this.grid.snapToGrid(
      worldPosX + this.cameras.main.scrollX, 
      worldPosY + this.cameras.main.scrollY
    );
    let gr = this.grid.worldToGrid(worldPosX, worldPosY);
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
