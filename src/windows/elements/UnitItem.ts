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
  public name: HTMLElement;
  public quantity: HTMLElement;
  public health: HTMLElement;
  public energy: HTMLElement;
  
  public onSelectionChange: (selected: boolean) => void;
  public conf: UnitData;

  constructor(unit: HTMLElement) {
    this.element = unit;
    this.icon = unit.querySelector(".unit_type_item_icon");
    this.name = unit.querySelector(".unit_type_item_name");
    this.quantity = unit.querySelector(".unit_type_item_quantity");
    this.health = unit.querySelector(".unit_type_item_health");
    this.energy = unit.querySelector(".unit_type_item_energy");
  }

  public populate(conf: UnitData) {
    this.conf = conf;
    let backgroundStyle = 'url(\'/assets/' + conf.icon + '.png\') center center no-repeat rgb(184, 176, 33)';
    this.icon.style.background = backgroundStyle;
    this.quantity.innerHTML = (Math.floor(conf.quantity*conf.health)).toString();
    this.icon.style.borderColor = 'white';
    this.name.innerHTML = conf.name;

    this.setSelected(false);
    
    this.configureProgress(this.health, conf.health);
    this.configureProgress(this.energy, conf.energy);
  }
  
  public setSelected(selected: boolean) {
    let was = this.isSelected;
    this.icon.style.borderWidth = selected ? '3px' : '0px';
    this.icon.style.borderStyle = selected ? 'solid' : 'none';

    if (this.onSelectionChange && was != selected) {
      this.onSelectionChange(selected);
    }
  }

  public get isSelected():boolean {
    return this.icon.style.borderStyle != 'none';
  }

  private configureProgress(element: HTMLElement, progress: number) {
    let maxW = parseInt(element.style.width);
    let inner = element.children[0] as HTMLElement;
    inner.style.width = (maxW * progress) + 'px';
  }
}