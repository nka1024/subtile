/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { IUnit } from "./IUnit";
import { TileGrid } from "../TileGrid";
import { BaseUnit } from "./BaseUnit";
import { UnitData } from "../Hero";

export class ScoutUnit extends BaseUnit implements IUnit {

  constructor(scene: Phaser.Scene, x: number, y: number, grid: TileGrid, conf:UnitData) {
    super(scene, x, y, grid, conf, 'anim_scout_eagle_32x32');

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
    this.anims.play('scout_move', ignoreIfPlayeing);
  }

  update() {
    this.depth = this.y + 20;
    super.update();
  }

  destroy() {
    super.destroy()
  }
}