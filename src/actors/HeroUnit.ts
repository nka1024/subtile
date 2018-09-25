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

export class HeroUnit extends Phaser.GameObjects.Sprite implements IUnit, IScoutable {

  public mover: UnitMoverModule;
  public progress: ProgressModule;
  public scoutee: ScouteeModule;
  public core: UnitModuleCore;

  constructor(scene: Phaser.Scene, x: number, y: number, grid: TileGrid) {
    super(scene, x, y, "player_idle_32x32");

    this.setInteractive();

    this.mover = new UnitMoverModule(this, scene, grid);
    this.progress = new ProgressModule(this, scene);
    this.scoutee = new ScouteeModule(this.progress);
    this.core = new UnitModuleCore([this.mover, this.progress]);

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

  update() {
    this.core.update();
    this.depth = this.y - 4;
  }

  destroy() {
    this.core.destroy();
    this.core = null;
    this.mover = null;
    this.progress = null;
    this.scoutee = null;
    super.destroy()
  }

  public playUnitAnim(key: string, ignoreIfPlaying: boolean) {
    let anim = 'player_' + key;
    this.anims.play(anim, ignoreIfPlaying);
  }

}