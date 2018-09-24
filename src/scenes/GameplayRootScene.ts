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
import { CameraDragModule } from "../modules/CameraDragModule";
import { SceneCursorModule } from "../modules/SceneCursorModule";
import { MapImporterModule } from "../modules/MapImporterModule";

export class GameplayRootScene extends Phaser.Scene {

  private grid: TileGrid;
  private player: HeroUnit;
  private unit: SquadUnit;
  private enemyUnit: SquadUnit;

  private selectedUnit: IUnit;
  private contextWindow: ContextObjectPopup;

  private objectClickedInThisFrame: Boolean;

  // modules
  private cameraDragModule: CameraDragModule;
  private cursorModule: SceneCursorModule;
  private mapImporterModule: MapImporterModule;

  constructor() {
    super({
      key: "GameplayRootScene"
    });
  }

  preload() {
    AssetsLoader.preload(this);
  }

  injectDependencies() {
    this.grid = new TileGrid(this);
    this.cameraDragModule = new CameraDragModule(this);
    this.cursorModule = new SceneCursorModule(this, this.grid);
    this.mapImporterModule = new MapImporterModule(this, this.grid);
  }

  create(data): void {
    this.injectDependencies();
    this.cameras.main.setBackgroundColor(0x1f1f1f);
    
    WindowManager.initialize();

    this.cursorModule.onClick = (cursor) => {
      this.selectedUnit.mover.handleMoveTouch(cursor);
    };
    
    this.mapImporterModule.importMap(this.cache.json.get('map'));

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

  update(): void {
    // close context window if clicked outside of it
    if (this.input.activePointer.justDown && !this.objectClickedInThisFrame) {
      this.destroyContextWindow();
    }
    // dont handle touches if context window is shown
    if (this.contextWindow == null) {
      this.cursorModule.update();
      this.cameraDragModule.update();
    }

    if (this.player) this.player.update();
    if (this.unit) this.unit.update();
    if (this.enemyUnit) this.enemyUnit.update();
    if (this.grid) this.grid.update();

    this.objectClickedInThisFrame = false;
  }
}
