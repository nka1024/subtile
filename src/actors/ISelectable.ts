/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { UnitSelectionModule } from "../modules/unit/UnitSelectionModule";

export interface ISelectable extends Phaser.GameObjects.Sprite {
  selection: UnitSelectionModule;
}

