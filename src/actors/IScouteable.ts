/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { ScouteeModule } from "../modules/unit/ScouteeModule";

export interface IScoutable extends Phaser.GameObjects.Sprite {
  scoutee: ScouteeModule;
}

