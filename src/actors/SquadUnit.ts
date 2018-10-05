/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { IScoutable } from "./IScouteable";

import { TileGrid } from "../TileGrid";
import { ScouteeModule } from "../modules/unit/ScouteeModule";
import { ISelectable } from "./ISelectable";
import { BaseUnit } from "./BaseUnit";
import { UnitData } from "../Hero";
import { CONST } from "../const/const";
import { GameplayRootScene } from "../scenes/GameplayRootScene";

export class SquadUnit extends BaseUnit implements IScoutable, ISelectable {

  public scoutee: ScouteeModule;

  private squadType: number = 1;

  private static initialized: boolean = false;
  private banner: Phaser.GameObjects.Image;

  private onFightEnd:() => void;
    
  constructor(scene: Phaser.Scene, x: number, y: number, grid: TileGrid, conf: UnitData) {

    super(scene, x, y, CONST.SQUAD_SPEED, grid, conf, 'infantry_1_idle_48x48');

    this.banner = scene.add.image(0, 0, this.side == "attack" ? "banner_red_11x31" : "banner_hazel_11x31");
    
    this.squadType = this.side == "attack" ? 2 : 1;
    this.scoutee = new ScouteeModule(this.progress);
    this.core.addModules([this.scoutee, this.selection]);

    this.onFightEnd = () => {
      // this.chase.restartIfHasTarget();
    };
    this.combat.events.on('fight_end', this.onFightEnd);
    this.initializeOnce();

    this.playUnitAnim('idle', true);
  }

  private initializeOnce() {
    if (!SquadUnit.initialized) {
      SquadUnit.initialized = true;
      for (let idx of [1, 2]) {
        var idleAnim = {
          key: 'unit_' + idx + '_idle',
          frames: this.scene.anims.generateFrameNumbers('infantry_' + idx + '_idle_48x48', { start: 0, end: 3 }),
          frameRate: 5,
          repeat: -1,
          repeatDelay: 0
        };
        this.scene.anims.create(idleAnim);
        var walkAnim = {
          key: 'unit_' + idx + '_walk',
          frames: this.scene.anims.generateFrameNumbers('infantry_' + idx + '_walk_48x48', { start: 0, end: 3 }),
          frameRate: 10,
          repeat: -1,
          repeatDelay: 0
        };
        this.scene.anims.create(walkAnim);
        var fightAnim = {
          key: 'unit_' + idx + '_fight',
          frames: this.scene.anims.generateFrameNumbers('infantry_' + idx + '_fight_48x48', { start: 0, end: 7 }),
          frameRate: 10,
          repeat: -1,
          repeatDelay: 0
        };
        this.scene.anims.create(fightAnim);
      }
    }

    var fightAnim = {
      key: 'archers_fight',
      frames: this.scene.anims.generateFrameNumbers('archers_fight_48x48', { start: 0, end: 8 }),
      frameRate: 10,
      repeat: -1,
      repeatDelay: 0
    };
    this.scene.anims.create(fightAnim);
  }

  public playUnitAnim(key: string, ignoreIfPlaying: boolean) {
    let anim = "";
    if (key == 'fight' && this.conf.type == "archers") {
      anim = "archers_fight";
    } else {
      anim = 'unit_' + this.squadType + '_' + key;
    }
    this.anims.play(anim, ignoreIfPlaying);
  }

  update() {
    this.depth = this.y - 4;

    super.update();

    this.banner.x = this.x + 1;
    this.banner.y = this.y - 8;
    this.banner.depth = this.depth + 1;

    this.targetScanUpdate();
  }

  destroy() {
    if (this.combat) this.combat.events.removeListener('fight_end', this.onFightEnd);
    if (this.banner) this.banner.destroy();
    this.combat = null;
    this.scoutee = null;
    this.progress = null;
    this.selection = null;
    super.destroy()
  }


  private targetScanUpdate() {
    if (!this.state.isChasing && this.side == 'attack') {
      let player = (this.scene as GameplayRootScene).player;
      let distToPlayer = this.grid.distanceXY(player, this, true);
      if (distToPlayer.i <= 2 && distToPlayer.j <= 2) {
        this.chase.start(player, () => { });
      }
    }
  }
  // Fighting


  // private flipOriginByDirection(direction: Tile, flip: boolean) {
  //   if (direction.j == 1) this.originX = 0.5
  //   else if (direction.j == 0) this.originX = flip ? 0.25 : 0.75;
  //   else if (direction.j == 2) this.originX = flip ? 0.75 : 0.25;

  //   if (direction.i == 1) this.originY = 0.5;
  //     else if (direction.i == 0) this.originY = flip ? 0.25 : 0.75;
  //      else if (direction.i == 2) this.originY = flip ? 0.75 : 0.25;
  // }


  public aggressedBy(who: BaseUnit) {
    this.chase.start(who, () => { });
  }

}