/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { UnitMoverModule } from "../modules/unit/UnitMoverModule";
import { ProgressModule } from "../modules/unit/ProgressModule";

export interface IUnit extends Phaser.GameObjects.Sprite {
    mover: UnitMoverModule;
    progress: ProgressModule

    playUnitAnim(key:string, ignoreIfPlaying:boolean);
}