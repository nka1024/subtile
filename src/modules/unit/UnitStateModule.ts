/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { IUnitModule } from "../interface/IUnitModule";
import { BaseUnit } from "../../actors/BaseUnit";
import { UnitPerimeterModule } from "./UnitPerimeterModule";

export class UnitStateModule implements IUnitModule {

  private owner: BaseUnit;

  public targetPerimeter: UnitPerimeterModule;

  public hasChaseTarget: boolean;
  public isFighting: boolean;
  public fightTarget: BaseUnit;

  constructor(owner: BaseUnit) {

  }

  // Overrides

  update() {
  }

  destroy() {
  }
}