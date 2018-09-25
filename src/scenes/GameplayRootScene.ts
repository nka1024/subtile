/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { IUnit } from "../actors/IUnit";
import { IScoutable } from "../actors/IScouteable";

import { WindowManager } from "../windows/WindowManager";
import { ASSETS, AssetsLoader } from "../AssetsLoader";
import { TileGrid } from "../TileGrid";
import { UnitsPanel } from "../windows/UnitsPanel";

import { HeroUnit } from "../actors/HeroUnit";
import { SquadUnit } from "../actors/SquadUnit";
import { ScoutUnit } from "../actors/ScoutUnit";

import { CameraDragModule } from "../modules/scene/CameraDragModule";
import { SceneCursorModule } from "../modules/scene/SceneCursorModule";
import { MapImporterModule } from "../modules/scene/MapImporterModule";
import { ContextMenuModule } from "../modules/scene/ContextMenuModule";


export class GameplayRootScene extends Phaser.Scene {

  private grid: TileGrid;
  private selectedUnit: IUnit;

  // objects
  private player: HeroUnit;
  private unit: SquadUnit;
  private enemyUnit: SquadUnit;
  private unitsGrp: Phaser.GameObjects.Group;

  // modules
  private cameraDragModule: CameraDragModule;
  private mapImporterModule: MapImporterModule;
  private contextMenuModule: ContextMenuModule;
  private cursorModule: SceneCursorModule;

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
    this.contextMenuModule = new ContextMenuModule(this);
    this.cursorModule = new SceneCursorModule(this, this.grid);
    this.mapImporterModule = new MapImporterModule(this, this.grid);
  }

  create(data): void {
    // this.cameras.main.zoom = 2;
    
    
    
    
    this.injectDependencies();
    this.cameras.main.setBackgroundColor(0x1f1f1f);
    
    
    WindowManager.initialize();

    this.cursorModule.onClick = (cursor) => {
      this.selectedUnit.mover.moveTo(cursor);
    };
    
    this.mapImporterModule.importMap(this.cache.json.get('map'));

    this.unitsGrp = this.add.group();
    this.unitsGrp.runChildUpdate = true;
    this.contextMenuModule.addObjectsGroup(this.unitsGrp);
    

    let player = new HeroUnit(this, 400, 280, this.grid);
    player.depth = player.y + 16;
    
    this.add.existing(player);
    this.player = player;
    this.selectedUnit = player;

    player.mover.moveTo({x: 444, y: 280}, true);
    this.cameras.main.centerOn(444, 280);

    this.unitsGrp.add(this.player);
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
        this.unitsGrp.add(this.unit);
      }
      this.selectedUnit = this.unit;
    });

    let worldPos = this.grid.gridToWorld(10, 14);
    this.enemyUnit = new SquadUnit(this, worldPos.x + 16, worldPos.y + 16, this.grid, 2);
    this.add.existing(this.enemyUnit);
    this.unitsGrp.add(this.enemyUnit);

    this.contextMenuModule.onReconClicked = (object: Phaser.GameObjects.Sprite) => {
      let from = this.grid.snapToGrid(player.x, player.y);
      let to = this.grid.snapToGrid(object.x, object.y);
      let scout = new ScoutUnit(this, from.x + 16, from.y + 16, this.grid);
      scout.mover.onPathComplete = () => {
        this.unitsGrp.remove(scout);
        scout.needsDestroy = true;
        if ('scoutee' in object) {
          (object as IScoutable).scoutee.beginScout(0.01, () => {
            console.log('scouting complete');
          })
      }
      };
      scout.mover.moveTo(to, true);
      
      this.add.existing(scout);
      this.unitsGrp.add(scout);
    };
  }


  update(): void {
    this.contextMenuModule.update();
    // dont handle touches if context window is shown
    if (!this.contextMenuModule.isContextWindowActive) {
      this.cursorModule.update();
      this.cameraDragModule.update();
    }

    if (this.grid) this.grid.update();
  }

}
