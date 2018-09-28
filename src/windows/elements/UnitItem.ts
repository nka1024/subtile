/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { UnitData } from "../../Hero";

export class UnitItem {
  public element: HTMLElement;
  public icon: HTMLElement;
  public quantity: HTMLElement;
  public health: HTMLElement;
  public energy: HTMLElement;
  public actionsList: HTMLElement
  public action1: HTMLInputElement;
  public action2: HTMLInputElement;
  
  public conf: UnitData;

  constructor(unit: HTMLElement) {
    this.element = unit;
    this.icon = unit.querySelector(".unit_item_icon");
    this.quantity = unit.querySelector(".unit_item_quantity");
    this.health = unit.querySelector(".unit_item_health");
    this.energy = unit.querySelector(".unit_item_energy");
    this.actionsList = unit.querySelector(".unit_item_actions_list");
    this.action1 = unit.querySelector(".unit_item_action_1");
    this.action2 = unit.querySelector(".unit_item_action_2");
  }

  public populate(conf: UnitData) {
    this.conf = conf;
    let backgroundStyle = 'url(\'/assets/' + conf.icon + '.png\') center center no-repeat rgb(184, 176, 33)';
    this.icon.style.background = backgroundStyle;
    this.quantity.innerHTML = (Math.floor(conf.quantity*conf.health)).toString();

    this.configureProgress(this.health, conf.health);
    this.configureProgress(this.energy, conf.energy);
  }

  public setActionListHidden(hidden: boolean) {
    this.actionsList.style.display = hidden ? 'none' : 'flex';
  }

  public get isActionListHidden():boolean {
    return this.actionsList.style.display == 'none';
  }

  private configureProgress(element: HTMLElement, progress: number) {
    let maxW = parseInt(element.style.width);
    let inner = element.children[0] as HTMLElement;
    inner.style.width = (maxW * progress) + 'px';
  }
}