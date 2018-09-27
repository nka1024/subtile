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
import { ZoomPanel } from "../windows/ZoomPanel";
import { ISelectable } from "../actors/ISelectable";
import { GameobjectClicksModule } from "../modules/scene/GameobjectClicksModule";
import { TargetListPanel } from "../windows/TargetsListPanel";
import { BaseUnit } from "../actors/BaseUnit";


export class GameplayRootScene extends Phaser.Scene {

  private grid: TileGrid;
  private selectedUnit: BaseUnit;

  // objects
  private player: HeroUnit;
  private enemyUnit: SquadUnit;
  private unitsGrp: Phaser.GameObjects.Group;
  private squads: Array<SquadUnit> = [];

  // windows
  private targetListPanel: TargetListPanel;

  // modules
  private cameraDragModule: CameraDragModule;
  private mapImporterModule: MapImporterModule;
  private contextMenuModule: ContextMenuModule;
  private cursorModule: SceneCursorModule;
  private clicksTracker: GameobjectClicksModule;

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
    this.clicksTracker = new GameobjectClicksModule(this);
    this.contextMenuModule = new ContextMenuModule(this, this.clicksTracker);
    this.cursorModule = new SceneCursorModule(this, this.grid);
    this.mapImporterModule = new MapImporterModule(this, this.grid);
  }

  create(data): void {
    this.injectDependencies();
    this.cameras.main.setBackgroundColor(0x1f1f1f);

    this.events.on('resize', (h: number, w: number) => {
      this.cameras.main.setSize(h, w);
    });
    WindowManager.initialize();

    let zoomPanel = new ZoomPanel();
    zoomPanel.zoomInButton.addEventListener('click', () => {
      this.cameras.main.zoom += 1;
    });
    zoomPanel.zoomOutButton.addEventListener('click', () => {
      this.cameras.main.zoom -= 1;
    });
    zoomPanel.show();

    this.cursorModule.onClick = (cursor) => {
      if (!this.cameraDragModule.isDrag) {
        this.selectedUnit.mover.moveTo(cursor);
      }
    };

    this.mapImporterModule.importMap(this.cache.json.get('map'));

    this.unitsGrp = this.add.group();
    this.unitsGrp.runChildUpdate = true;
    this.clicksTracker.addObjectsGroup(this.unitsGrp);


    let player = new HeroUnit(this, 400, 280, this.grid);
    player.depth = player.y + 16;

    this.add.existing(player);
    this.player = player;
    this.selectedUnit = player;

    player.mover.moveTo({ x: 444, y: 280 }, true);
    this.cameras.main.centerOn(444, 280);
    this.unitsGrp.add(this.player);
    let units = new UnitsPanel();
    units.show();
    units.onUnitAttack = (unitId: string) => {
      let target = this.selectedUnit;
      let from = this.grid.snapToGrid(this.player.x, this.player.y);
      let to = this.grid.snapToGrid(target.x, target.y);
      let squad = new SquadUnit(this, from.x + 16, from.y + 16, this.grid, 1);
      squad.id = unitId;
      this.add.existing(squad);
      this.unitsGrp.add(squad);
      this.squads.push(squad);

      let onPathComplete = () => {
        if (target.perimeter.isSpotFree(squad.x, squad.y)) {
          target.perimeter.claimSpot(squad.x, squad.y);
          console.log('starting attack');
        } else {
          squad.mover.moveTo(target.perimeter.findEmptySpot(), true);
          squad.mover.onPathComplete = onPathComplete;
        }
      };
      squad.mover.moveTo(to, true);
      squad.mover.onPathComplete = onPathComplete;
    }
    units.onUnitReturn = (unitId: string) => {
      for (let squad of this.squads) {
        if (squad.id == unitId) {
          squad.mover.moveTo(this.player, true);
          squad.mover.onPathComplete = () => {
            console.log('returned');
            this.unitsGrp.remove(squad, true);
            this.squads = this.squads.filter((o, i, arr) => { return o != squad });
          };
        }
      }
    }

    this.targetListPanel = new TargetListPanel();
    this.targetListPanel.show();
    this.targetListPanel.onObjectSelectionChange = (object: any, selected: boolean) => {
      if ("selection" in object) {
        let obj = object as ISelectable;
        if (selected) obj.selection.showHard();
        else obj.selection.hideHard();
      }
    };
    this.contextMenuModule.injectDependencies(this.targetListPanel);

    this.clicksTracker.on('click', (object: Phaser.GameObjects.GameObject) => {
      // deselect old
      if (this.targetListPanel.isTargeted(this.selectedUnit)) {
        this.targetListPanel.deselectTarget(this.selectedUnit);
      }

      // select new
      this.selectedUnit = object as BaseUnit;
      if (this.targetListPanel.isTargeted(object)) {
        this.targetListPanel.selectTarget(object);
      }
    });

    let worldPos = this.grid.gridToWorld(10, 14);
    this.enemyUnit = new SquadUnit(this, worldPos.x + 16, worldPos.y + 16, this.grid, 2);
    this.add.existing(this.enemyUnit);
    this.unitsGrp.add(this.enemyUnit);


    // Show context menu on object click
    this.contextMenuModule.onReconClicked = (object: Phaser.GameObjects.Sprite) => {
      // Send scouts to that object
      let from = this.grid.snapToGrid(player.x, player.y);
      let to = this.grid.snapToGrid(object.x, object.y);
      let scout = new ScoutUnit(this, from.x + 16, from.y + 16, this.grid);

      // Start scouting when scouts arrive to object
      scout.mover.onPathComplete = () => {
        this.unitsGrp.remove(scout, true);
        if ('scoutee' in object) {
          (object as IScoutable).scoutee.beginScout(0.01, () => {
            // Add object to target list 
            this.targetListPanel.addTarget(object, 'infantry_1_icon');
            // Show selection frame aroud object
            if ("selection" in object) {
              (object as ISelectable).selection.showSoft();
            }
          });
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
