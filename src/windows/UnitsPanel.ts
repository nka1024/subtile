/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { BaseWindow } from "./BaseWindow";

declare type UnitConfig = {
  icon: string;
  health: number;
  energy: number;
  quantity: number;
}

declare type UnitTypeConfig = {
  icon: string;
  name: string;
  units: Array<UnitConfig>;
}
export class UnitsPanel extends BaseWindow {
  // static
  static innerHtml: string;

  // public
  public onObjectClick: Function;
  public filenamePrefix: string;

  // 
  private unitTypesList: HTMLElement;
  private refUnitTypeItem: HTMLElement;
  private refUnitTypeItemName: HTMLElement;
  private refUnitTypeItemIcon: HTMLElement;
  private refUnitTypeItemFold: HTMLElement;
  private refUnitsList: HTMLElement;
  private refUnitItem: HTMLElement;
  private refUnitItemIcon: HTMLElement;
  private refUnitItemQuantity: HTMLElement;
  private refUnitItemHealth: HTMLElement;
  private refUnitItemEnergy: HTMLElement;
  private refUnitItemActionsList: HTMLElement;
  private refUnitItemAction1: HTMLInputElement;
  private refUnitItemAction2: HTMLInputElement;

  constructor() {
    super();

    this.unitTypesList = this.element.querySelector(".unit_types_list");

    this.refUnitTypeItem        = this.element.querySelector(".unit_type_item");
    this.refUnitTypeItemName    = this.element.querySelector(".unit_type_item_name");
    this.refUnitTypeItemIcon    = this.element.querySelector(".unit_type_item_icon");
    this.refUnitTypeItemFold    = this.element.querySelector(".unit_type_item_fold");
    this.refUnitsList           = this.element.querySelector(".units_list");
    this.refUnitItem            = this.element.querySelector(".unit_item");
    this.refUnitItemIcon        = this.element.querySelector(".unit_item_icon");
    this.refUnitItemQuantity    = this.element.querySelector(".unit_item_quantity");
    this.refUnitItemHealth      = this.element.querySelector(".unit_item_health");
    this.refUnitItemEnergy      = this.element.querySelector(".unit_item_energy");
    this.refUnitItemActionsList = this.element.querySelector(".unit_item_actions_list");
    this.refUnitItemAction1     = this.element.querySelector(".unit_item_action_1");
    this.refUnitItemAction2     = this.element.querySelector(".unit_item_action_2");
    this.unitTypesList.innerHTML = "";
    
    let typeItem = this.makeUnitTypeItem({
      icon: "infantry_1_icon",
      name: "Infantry",
      units: [
        {
          icon: "infantry_1_icon",
          health: 1,
          energy: 1,
          quantity: 99
        },
        {
          icon: "infantry_1_icon",
          health: 0.5,
          energy: 0.9,
          quantity: 20
        }
      ]
    });

    this.unitTypesList.appendChild(typeItem);


    let typeItem2 = this.makeUnitTypeItem({
      icon: "infantry_2_icon",
      name: "Archers",
      units: [
        {
          icon: "infantry_1_icon",
          health: 1,
          energy: 1,
          quantity: 99
        },
        {
          icon: "infantry_1_icon",
          health: 0.5,
          energy: 0.9,
          quantity: 20
        }
      ]
    });
    this.unitTypesList.appendChild(this.makeHorizontalSpacingDiv(5));
    this.unitTypesList.appendChild(typeItem2);
  }

  private makeUnitTypeItem(conf: UnitTypeConfig): HTMLElement {
    let typeItem = this.refUnitTypeItem.cloneNode(true) as HTMLElement;
    this.configureUnitType(typeItem, conf);
    return typeItem;
  }

  private configureUnitType(item: HTMLElement, conf: UnitTypeConfig) {
    let unitTypeItemIcon    = item.querySelector(".unit_type_item_icon") as HTMLElement;
    let unitTypeItemName    = item.querySelector(".unit_type_item_name") as HTMLElement;
    let unitTypeItemFold    = item.querySelector(".unit_type_item_fold") as HTMLElement;
    let unitsList           = item.querySelector(".units_list") as HTMLElement;

    let backgroundStyle = 'url(\'/assets/' + conf.icon + '.png\') center center no-repeat rgb(184, 176, 33)';
    unitTypeItemFold.style.display = 'none'; // 'block' 
    unitsList.style.display = 'none'; // 'block'
    unitTypeItemName.innerHTML = conf.name;
    unitTypeItemIcon.style.background = backgroundStyle;
    unitsList.innerHTML = "";

    let foldingCallback = () => {
      let hidden = unitsList.style.display == 'none';
      unitsList.style.display = hidden ? 'block' : 'none'; 
      unitTypeItemFold.style.display = hidden ? 'block' : 'none';
    }
    unitTypeItemIcon.addEventListener('click', foldingCallback);
    unitTypeItemFold.addEventListener('click', foldingCallback);


    // add unit item
    for (let unitConf of conf.units) {
      let unit = this.makeUnitItem(unitConf);
      unitsList.appendChild(unit);
    }
  }

  private makeUnitItem(conf: UnitConfig): HTMLElement {
    let typeItem = this.refUnitItem.cloneNode(true) as HTMLElement;
    this.configureUnit(typeItem, conf);
    return typeItem;
  }

  private configureUnit(unit: HTMLElement, conf: UnitConfig) {
    let unitIcon        = unit.querySelector(".unit_item_icon") as HTMLElement;
    let unitQuantity    = unit.querySelector(".unit_item_quantity") as HTMLElement;
    let unitHealth      = unit.querySelector(".unit_item_health") as HTMLElement;
    let unitEnergy      = unit.querySelector(".unit_item_energy") as HTMLElement;
    let unitActionsList = unit.querySelector(".unit_item_actions_list") as HTMLElement;
    let unitAction1     = unit.querySelector(".unit_item_action_1") as HTMLElement;
    let unitAction2     = unit.querySelector(".unit_item_action_2") as HTMLElement;

    let backgroundStyle = 'url(\'/assets/' + conf.icon + '.png\') center center no-repeat rgb(184, 176, 33)';
    unitIcon.style.background = backgroundStyle;
    unitQuantity.innerHTML = conf.quantity.toString();
    unitActionsList.style.display = 'none' // 'flex'
    unit.addEventListener('click', () => {
      let hidden = unitActionsList.style.display == 'none';
      unitActionsList.style.display = hidden ? 'flex' : 'none'; 
    });

    unitAction1.addEventListener('click', () => {
      console.log('attack!');
    })
    unitAction2.addEventListener('click', () => {
      console.log('return!');
    })
  }

  private makeHorizontalSpacingDiv(width: number):HTMLElement {
    let element = document.createElement('div');
    element.style.position = 'relative';
    element.style.width = width + 'px';
    return element;
  }


  // Window HTML properties
  protected getWindowName(): string { return "units_panel" }
  protected getInnerHTML(): string { return UnitsPanel.innerHtml }
  static initialize() {
    UnitsPanel.innerHtml = BaseWindow.getPrefab(".units_panel_prefab").innerHTML;
  }
}