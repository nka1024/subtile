/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { TileGrid } from "../TileGrid";
import { UnitMoverModule } from "../modules/unit/UnitMoverModule";
import { IUnit } from "./IUnit";

export class SquadUnit extends Phaser.GameObjects.Sprite implements IUnit {
  public mover: UnitMoverModule;

  private squadType: number = 1;

  constructor(scene: Phaser.Scene, x: number, y: number, grid:TileGrid, squadType:number) {
    super(scene, x, y, 'infantry_'+squadType+'_idle_48x48');

    this.squadType = squadType;
    this.setInteractive();
    this.mover = new UnitMoverModule(this, scene, grid);

    for (let idx of [1, 2]) {
      var idleAnim = {
        key: 'unit_' + idx + '_idle',
        frames: scene.anims.generateFrameNumbers('infantry_' + idx + '_idle_48x48', { start: 0, end: 3 }),
        frameRate: 5,
        repeat: -1,
        repeatDelay: 0
      };
      scene.anims.create(idleAnim);
      var walkAnim = {
        key: 'unit_' + idx + '_walk',
        frames: scene.anims.generateFrameNumbers('infantry_' + idx + '_walk_48x48', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
        repeatDelay: 0
      };
      scene.anims.create(walkAnim);
    }

    this.playUnitAnim('idle', true);
  }

  public playUnitAnim(key:string, ignoreIfPlaying:boolean) {
    let anim = 'unit_'+ this.squadType +'_' + key;
    this.anims.play(anim, ignoreIfPlaying);
  }

  update() {
    // if (this.cursors.down.isDown) {
    this.mover.update();
    this.depth = this.y - 4;
  }

  destroy() {
    this.mover.destroy();;
    super.destroy()
  }

}