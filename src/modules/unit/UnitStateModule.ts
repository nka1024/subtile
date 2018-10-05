/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { IUnitModule } from "../interface/IUnitModule";
import { BaseUnit } from "../../actors/BaseUnit";

export class UnitStateModule implements IUnitModule {

  private owner: BaseUnit;

  public isChasing: boolean;
  public isFighting: boolean;
  public isMoving: boolean;
  public isPathfinding: boolean;

  public chaseTarget: BaseUnit;
  public fightTarget: BaseUnit;
  
  constructor(owner: BaseUnit) {

  }

  // Overrides

  update() {
  }

  destroy() {
  }
}