/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { IUnit } from "../actors/IUnit"
import { IScoutable } from "./IScouteable";

import { TileGrid } from "../TileGrid";

import { UnitMoverModule } from "../modules/unit/UnitMoverModule";
import { ProgressModule } from "../modules/unit/ProgressModule";
import { ScouteeModule } from "../modules/unit/ScouteeModule";
import { UnitModuleCore } from "../modules/UnitModuleCore";
import { BaseUnit } from "./BaseUnit";
import { UnitData } from "../Hero";

export class HeroUnit extends BaseUnit implements IUnit, IScoutable {

  // gameobject can only be destroyed at the end of update()
  public toDestroy: boolean;

  public mover: UnitMoverModule;
  public progress: ProgressModule;
  public scoutee: ScouteeModule;
  public core: UnitModuleCore;

  constructor(scene: Phaser.Scene, x: number, y: number, grid: TileGrid, conf: UnitData) {
    super(scene, x, y, grid, conf, "player_idle_32x32");

    this.scoutee = new ScouteeModule(this.progress);
    this.core.addModule(this.scoutee)

    var idleAnim = {
      key: 'player_idle',
      frames: scene.anims.generateFrameNumbers('player_idle_32x32', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1,
      repeatDelay: 0
    };
    scene.anims.create(idleAnim);
    var walkAnim = {
      key: 'player_walk',
      frames: scene.anims.generateFrameNumbers('player_walk_32x32', { start: 0, end: 4 }),
      frameRate: 10,
      repeat: -1,
      repeatDelay: 0
    };
    scene.anims.create(walkAnim);

    this.playUnitAnim('idle', true);
  }

  public playUnitAnim(key: string, ignoreIfPlaying: boolean) {
    let anim = 'player_' + key;
    this.anims.play(anim, ignoreIfPlaying);
  }

  update() {
    this.depth = this.y - 4;

    super.update();
  }

  destroy() {
    super.destroy();
    this.core.destroy();
    this.core = null;
    this.mover = null;
    this.progress = null;
    this.scoutee = null;
    super.destroy()
  }

}