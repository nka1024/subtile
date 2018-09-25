/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { ProgressModule } from "./ProgressModule";
import { IUnitModule } from "../interface/IUnitModule";

export class ScouteeModule implements IUnitModule {

  private progress: ProgressModule;
  private scoutRate: number;
  private onScoutComplete: () => void;

  constructor(progress: ProgressModule) {
    this.progress = progress;
  }

  public beginScout(rate: number, onComplete: () => void) {
    this.scoutRate = rate;
    this.onScoutComplete = onComplete;
    
    this.progress.text = "scouting..."
    this.progress.progress = 0;
    this.progress.show();
  }

  public update() {
    this.progress.progress += this.scoutRate;
    if (this.progress.progress > 1) {
      this.progress.hide();
      if (this.onScoutComplete) {
        this.onScoutComplete();
        this.onScoutComplete = null;
        this.scoutRate = 0;
      }
    }
  }

  public destroy() {
    this.progress = null;
    this.onScoutComplete = null;
  }

}