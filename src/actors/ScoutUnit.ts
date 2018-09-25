import { IUnit } from "./IUnit";
import { TileGrid } from "../TileGrid";
import { UnitMoverModule } from "../modules/unit/UnitMoverModule";
import { ScouteeModule } from "../modules/unit/ScouteeModule";
import { ProgressModule } from "../modules/unit/ProgressModule";

/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

export class ScoutUnit extends Phaser.GameObjects.Sprite implements IUnit {

  public mover: UnitMoverModule;
  public progress: ProgressModule;
  public scoutee: ScouteeModule
  // gameobject can only be destroyed at the end of update()
  public needsDestroy: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, grid: TileGrid) {
    super(scene, x, y, 'anim_scout_eagle_32x32');
    this.mover = new UnitMoverModule(this, scene, grid);

    var anim = {
      key: 'scout_move',
      frames: scene.anims.generateFrameNumbers('anim_scout_eagle_32x32', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
      repeatDelay: 0
    };
    scene.anims.create(anim);
    this.playUnitAnim('scout_move', true);
  }

  public playUnitAnim(key: string, ignoreIfPlayeing: boolean) {
    // scout has only one animation so far
    this.anims.play('scout_move', ignoreIfPlayeing);
  }

  update() {
    this.mover.update();
    this.depth = this.y + 20;

    if (this.needsDestroy) {
      this.destroy()
    }
  }

  destroy() {
    this.mover.destroy();
    super.destroy()
  }
}