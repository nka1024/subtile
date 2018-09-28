/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { UnitData } from "../../Hero";

export class UnitTargetItem {
  public element: HTMLElement;
  public icon: HTMLElement;
  public quantity: HTMLElement;
  public health: HTMLElement;
  public actionsList: HTMLElement
  
  public conf: UnitData;

  constructor(unit: HTMLElement) {
    this.element = unit;
    this.icon = unit.querySelector(".unit_item_icon");
    this.quantity = unit.querySelector(".unit_item_quantity");
    this.health = unit.querySelector(".unit_item_health");
  }

  public populate(conf: UnitData) {
    this.conf = conf;
    let backgroundStyle = 'url(\'/assets/' + conf.icon + '.png\') center center no-repeat rgb(184, 176, 33)';
    this.icon.style.background = backgroundStyle;
    this.quantity.innerHTML = (Math.floor(conf.quantity*conf.health)).toString();
    
    this.configureProgress(this.health, conf.health);
  }

public setSelected(selected: boolean) {
    this.element.style.borderRadius = selected ? '0px' : '3px';

    this.element.style.borderRadius = selected ? '0px' : '3px';
    this.element.style.border = selected ? "white" : "";
    this.element.style.borderColor = selected ? "white" : "";
    this.element.style.borderStyle = selected ? "solid" : "none";
    this.element.style.borderWidth = selected ? "2px" : "0px";
    this.element.style.marginTop = selected ? "0px" : "1px";

    this.icon.style.borderRadius = selected ? '0px' : '3px';;
    this.icon.style.marginTop = selected ? "1px" : "2px";
}

  private configureProgress(element: HTMLElement, progress: number) {
    let maxW = parseInt(element.style.width);
    let inner = element.children[0] as HTMLElement;
    inner.style.width = (maxW * progress) + 'px';
  }
}