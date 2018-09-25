import { IUnit } from "./IUnit";
import { TileGrid } from "../TileGrid";
import { UnitMoverModule } from "../modules/unit/UnitMoverModule";

/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

export class ScoutUnit extends Phaser.GameObjects.Sprite implements IUnit {

  public mover: UnitMoverModule;

  constructor(scene: Phaser.Scene, x: number, y: number, grid:TileGrid) {
    super(scene, x, y, 'anim_scout_eagle_32x32');
    this.mover = new UnitMoverModule(this, scene, grid);

    var anim = {
      key: 'scout_move',
      frames: scene.anims.generateFrameNumbers('scout_move', { start: 0, end: 5 }),
      frameRate: 5,
      repeat: -1,
      repeatDelay: 0
    };
    scene.anims.create(anim);
  }

  public playUnitAnim(key:string, ignoreIfPlayeing:boolean) {
    // scout has only one animation so far
    this.anims.play('scout_move');
  }

}