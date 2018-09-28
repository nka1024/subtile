/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { UnitMoverModule } from "../modules/unit/UnitMoverModule";
import { ProgressModule } from "../modules/unit/ProgressModule";
import { UnitData } from "../Hero";

export interface IUnit extends Phaser.GameObjects.Sprite {
    conf: UnitData;
    toDestroy: boolean;
    mover: UnitMoverModule;
    progress: ProgressModule

    playUnitAnim(key:string, ignoreIfPlaying:boolean);
}