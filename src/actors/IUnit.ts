/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { UnitMoverModule } from "../modules/UnitMoverModule";

export interface IUnit extends Phaser.GameObjects.Sprite {
    mover:UnitMoverModule;

    playUnitAnim(key:string, ignoreIfPlaying:boolean);
}