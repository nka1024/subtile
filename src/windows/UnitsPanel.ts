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

  // private
  private allUnitTypes: Array<HTMLElement> = [];
  private allActionLists: Array<HTMLElement> = [];

  // template elements
  private unitTypesList: HTMLElement;
  private refUnitTypeItem: HTMLElement;
  private refUnitItem: HTMLElement;

  constructor() {
    super();

    this.unitTypesList = this.element.querySelector(".unit_types_list");
    this.refUnitTypeItem = this.element.querySelector(".unit_type_item");
    this.refUnitItem = this.element.querySelector(".unit_item");
    this.unitTypesList.innerHTML = "";

    this.populateTestConfig();
  }

  private populateTestConfig() {
    // test data
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
    this.allUnitTypes.push(typeItem);

    for (let i in [0, 1, 2, 3, 4]) {
      let item = this.makeUnitTypeItem({
        icon: "infantry_2_icon",
        name: "Archers",
        units: [
          {
            icon: "infantry_1_icon",
            health: Math.random(),
            energy: Math.random(),
            quantity: Math.floor(Math.random()*10)*10 
          },
          {
            icon: "infantry_1_icon",
            health: Math.random(),
            energy: Math.random(),
            quantity: Math.floor(Math.random()*10)*10
          }
        ]
      });
      this.unitTypesList.appendChild(this.makeHorizontalSpacingDiv(5));
      this.unitTypesList.appendChild(item);
      this.allUnitTypes.push(item);
    }
  }

  private makeUnitTypeItem(conf: UnitTypeConfig): HTMLElement {
    let typeItem = this.refUnitTypeItem.cloneNode(true) as HTMLElement;
    this.configureUnitType(typeItem, conf);
    return typeItem;
  }

  private configureUnitType(item: HTMLElement, conf: UnitTypeConfig) {
    let unitTypeItemIcon: HTMLElement = item.querySelector(".unit_type_item_icon");
    let unitTypeItemName: HTMLElement = item.querySelector(".unit_type_item_name");
    let unitTypeItemFold: HTMLElement = item.querySelector(".unit_type_item_fold");
    let unitsList: HTMLElement = item.querySelector(".units_list");

    let backgroundStyle = 'url(\'/assets/' + conf.icon + '.png\') center center no-repeat rgb(184, 176, 33)';
    unitTypeItemFold.style.display = 'none'; // 'block' 
    unitsList.style.display = 'none'; // 'block'
    unitTypeItemName.innerHTML = conf.name;
    unitTypeItemIcon.style.background = backgroundStyle;
    unitsList.innerHTML = "";

    let foldingCallback = () => {
      let hidden = unitsList.style.display == 'none';
      // hide currently unfolded unit list if clicked on any of them
      this.hideAllUnitLists();
      this.setUnitListHidden(item, !hidden);
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
    let unitIcon: HTMLElement = unit.querySelector(".unit_item_icon");
    let unitQuantity: HTMLElement = unit.querySelector(".unit_item_quantity");
    let unitHealth: HTMLElement = unit.querySelector(".unit_item_health");
    let unitEnergy: HTMLElement = unit.querySelector(".unit_item_energy");
    let unitActionsList: HTMLElement = unit.querySelector(".unit_item_actions_list");
    let unitAction1: HTMLElement = unit.querySelector(".unit_item_action_1");
    let unitAction2: HTMLElement = unit.querySelector(".unit_item_action_2");

    let backgroundStyle = 'url(\'/assets/' + conf.icon + '.png\') center center no-repeat rgb(184, 176, 33)';
    unitIcon.style.background = backgroundStyle;
    unitQuantity.innerHTML = conf.quantity.toString();
    unitActionsList.style.display = 'none' // 'flex'

    this.allActionLists.push(unitActionsList);
    this.configureProgress(unitHealth, conf.health);
    this.configureProgress(unitEnergy, conf.energy);

    unitIcon.addEventListener('click', () => {
      let hidden = unitActionsList.style.display == 'none';
      // hide currently visible action list if clicked on any of them
      this.hideAllActionLists();
      this.setActionListHidden(unitActionsList, !hidden);
    });

    unitAction1.addEventListener('click', () => {
      this.hideAllActionLists();
      console.log('attack!');
    })
    unitAction2.addEventListener('click', () => {
      this.hideAllActionLists();
      console.log('return!');
    })
  }

  private makeHorizontalSpacingDiv(width: number): HTMLElement {
    let element = document.createElement('div');
    element.style.position = 'relative';
    element.style.width = width + 'px';
    return element;
  }

  private hideAllUnitLists() {
    for (let unitType of this.allUnitTypes) {
      this.setUnitListHidden(unitType, true);
    }
  }

  private setUnitListHidden(unit: HTMLElement, hidden: boolean) {
    let unitTypeItemFold: HTMLElement = unit.querySelector(".unit_type_item_fold");
    let unitsList: HTMLElement = unit.querySelector(".units_list");

    unitsList.style.display = hidden ? 'none' : 'block';
    unitTypeItemFold.style.display = hidden ? 'none' : 'block';
  }

  private hideAllActionLists() {
    for (let actionList of this.allActionLists) {
      this.setActionListHidden(actionList, true);
    }
  }

  private setActionListHidden(element: HTMLElement, hidden: boolean) {
    element.style.display = hidden ? 'none' : 'flex';
  }

  private configureProgress(element: HTMLElement, progress: number) {
    let maxW = parseInt(element.style.width);
    let inner = element.children[0] as HTMLElement;
    inner.style.width = (maxW * progress) + 'px';
  }


  // Window HTML properties
  protected getWindowName(): string { return "units_panel" }
  protected getInnerHTML(): string { return UnitsPanel.innerHtml }
  static initialize() {
    UnitsPanel.innerHtml = BaseWindow.getPrefab(".units_panel_prefab").innerHTML;
  }
}