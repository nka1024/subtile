/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { IScoutable } from "../actors/IScouteable";

import { WindowManager } from "../windows/WindowManager";
import { AssetsLoader } from "../AssetsLoader";
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
import { Hero, UnitData } from "../Hero";
import { OkPopup } from "../windows/OkPopup";
import { CONST } from "../const/const";


export class GameplayRootScene extends Phaser.Scene {

  private grid: TileGrid;

  // objects
  public player: HeroUnit;
  private unitsGrp: Phaser.GameObjects.Group;
  private deployedSquads: Array<SquadUnit> = [];

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


    let player = new HeroUnit(this, 0, 0, this.grid, Hero.makeHeroConf());
    let hero = new Hero();

    this.cursorModule.onClick = (cursor) => {
      if (!this.cameraDragModule.isDrag && !this.clicksTracker.objectClickedInThisFrame) {
        player.mover.moveTo(cursor);
      }
    };

    this.mapImporterModule.importMap(this.cache.json.get('map'));

    this.unitsGrp = this.add.group();
    this.unitsGrp.runChildUpdate = true;
    this.clicksTracker.addObjectsGroup(this.unitsGrp);


    this.add.existing(player);
    this.player = player;

    player.mover.placeToTile({i: 17, j: 2});
    this.cameras.main.centerOn(player.x, player.y);
    this.unitsGrp.add(this.player);
    let units = new UnitsPanel();
    units.populate(hero.data.units);
    units.show();
    units.onUnitAttack = (conf: UnitData) => {
      let squad = this.findOrDeploySquad(conf);
      squad.chase.deployDefender(player);
      
      this.add.existing(squad);
      this.unitsGrp.add(squad);
      this.deployedSquads.push(squad);
    }
    units.onUnitReturn = (conf: UnitData) => {
      for (let squad of this.deployedSquads) {
        if (squad.conf.id == conf.id) {
          if (squad.state.isFighting) {
            squad.combat.stopFight('return');
          }
          this.returnSquad(squad);
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

    this.clicksTracker.on('click', (object: BaseUnit) => {
      // deselect old
      this.targetListPanel.deselectAll()

      if (object.conf.id.indexOf('enemy') == -1) {
        return;
      }

      // select new
      if (this.targetListPanel.isTargeted(object)) {
        this.targetListPanel.selectTarget(object);
      }
    });

    this.createEnemy(1, 11);
    this.createEnemy(13, 18);
    this.createEnemy(8, 19);
    this.createEnemy(15, 10);
    this.createEnemy(20, 9);

    this.contextMenuModule.onReturnClicked = (object: BaseUnit) => {
      this.returnSquad(object as SquadUnit);
    };
    this.contextMenuModule.onReconClicked = (object: BaseUnit) => {
      // Send scouts to that object
      let from = this.grid.snapToGrid(player);
      let to = this.grid.snapToGrid(object);
      let scout = new ScoutUnit(this, from.x + 16, from.y + 16, this.grid, Hero.makeReconSquadConf());

      object.aggressedBy(player);
      // Start scouting when scouts arrive to object
      scout.mover.onPathComplete = () => {
        
        this.unitsGrp.remove(scout, true);
        scout.destroy();
        if ('scoutee' in object) {
          (object as IScoutable).scoutee.beginScout(CONST.SCOUT_RATE, () => {
            // Add object to target list 
            this.targetListPanel.addTarget(object);

            if (!this.targetListPanel.selectedTarget) {
              this.targetListPanel.selectTarget(object);
            }
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

  private returnSquad(squad: SquadUnit) {
    // squad.chase.start(this.player, () => {
      console.log('returned');
      this.unitsGrp.remove(squad, true);
      this.deployedSquads = this.deployedSquads.filter((o, i, arr) => { return o != squad });
      squad.destroy();
    // });
  }

  private createEnemy(i: number, j: number) {
    let worldPos = this.grid.gridToWorld({i: i, j: j});
    let enemyUnit = new SquadUnit(this, worldPos.x + 16, worldPos.y + 16, this.grid, Hero.makeRogueSquadConf(), 2);
    this.add.existing(enemyUnit);
    this.unitsGrp.add(enemyUnit);
    enemyUnit.events.addListener('death', () => { this.handleUnitDeath(enemyUnit); });
  }

  private findOrDeploySquad(conf: UnitData) {
    let squad: SquadUnit = null;
    for (let s of this.deployedSquads) {
      if (s.conf.id == conf.id) {
        // found deployed squad
        squad = s;
        break;
      }
    }
    if (!squad) {
      let from = this.grid.snapToGrid(this.player);
      squad = new SquadUnit(this, from.x + 16, from.y + 16, this.grid, conf, 1);
      squad.events.addListener('death', () => { this.handleUnitDeath(squad); });
    }
    return squad;
  }

  private handleUnitDeath(unit: BaseUnit) {
    this.unitsGrp.remove(unit, true);
    this.targetListPanel.removeTarget(unit);
    unit.destroy();
  }

  update(): void {
    this.contextMenuModule.update();
    // dont handle touches if context window is shown
    if (!this.contextMenuModule.isContextWindowActive) {
      this.cursorModule.update();
      this.cameraDragModule.update();
    }

    if (this.grid) {
      this.grid.update();
    }

  }

}
