/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { IUnitModule } from "./interface/IUnitModule";

export class UnitModuleCore {
  private modules: Array<IUnitModule> = [];
  constructor (modules: Array<IUnitModule> = null) {
    if (modules) {
      this.addModules(modules);
    }
  }

  public addModules(modules: Array<IUnitModule>) {
    for (let m of modules) {
      this.modules.push(m);
    }
  }
  public addModule(m: IUnitModule) {
    this.modules.push(m);
  }

  public removeModule(m: IUnitModule) {
    this.modules =  this.modules.filter((item, idx, a) => { return item != m })
  }

  public update() {
    for (let m of this.modules) {
      m.update();
    }
  }

  public destroy() {
    for (let m of this.modules) {
      m.destroy();
    }
    this.modules = null;
  }
}