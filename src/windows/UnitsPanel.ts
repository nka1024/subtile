/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { BaseWindow } from "./BaseWindow";
import { UnitTypeData, UnitData } from "../Hero";
import { UnitItem } from "./elements/UnitItem";

  
export class UnitsPanel extends BaseWindow {
  // static
  static innerHtml: string;

  // public
  public onUnitAttack: (conf: UnitData) => void;
  public onUnitReturn: (conf: UnitData) => void;
  public filenamePrefix: string;

  // private
  private allUnitTypes: Array<HTMLElement> = [];
  private allUnitItems: Array<UnitItem> = [];

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

    this.startDataSyncLoop();
  }

  private dataSyncIntervalHandler: any;
  private startDataSyncLoop() {
    this.dataSyncIntervalHandler = setInterval(() => {
      this.dataSync()
    }, 500);
  }
  private stopDataSyncLoop() {
    clearInterval(this.dataSyncIntervalHandler);
  }

  private dataSync() {
    for (let unitItem of this.allUnitItems) {
      unitItem.populate(unitItem.conf);
    }
  }

  private clear() {
    this.unitTypesList.innerHTML = "";
    this.allUnitTypes = [];
    this.allUnitItems = [];
  }

  public populate(unitTypes: Array<UnitTypeData>) {
    this.clear();
    let first = true;

    for (let unitType of unitTypes) {
      let typeItem = this.makeUnitTypeItem(unitType);
      // spacing
      if (first) first = false;
      else this.unitTypesList.appendChild(this.makeHorizontalSpacingDiv(5));
      
      this.unitTypesList.appendChild(typeItem);
      this.allUnitTypes.push(typeItem);
    }
    this.hideAllActionLists();
  }

  private makeUnitTypeItem(conf: UnitTypeData): HTMLElement {
    let typeItem = this.refUnitTypeItem.cloneNode(true) as HTMLElement;
    this.configureUnitType(typeItem, conf);
    return typeItem;
  }

  private configureUnitType(item: HTMLElement, conf: UnitTypeData) {
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

  private makeUnitItem(conf: UnitData): HTMLElement {
    let typeItem = this.refUnitItem.cloneNode(true) as HTMLElement;
    this.configureUnit(typeItem, conf);
    return typeItem;
  }

  private configureUnit(unit: HTMLElement, conf: UnitData) {
    let item = new UnitItem(unit);

    this.allUnitItems.push(item);

    item.populate(conf);
    item.icon.addEventListener('click', () => {
      let hidden = item.isActionListHidden;
      // hide currently visible action list if clicked on any of them
      this.hideAllActionLists();
      item.setActionListHidden(!hidden);
    });

    item.action1.addEventListener('click', () => {
      this.hideAllActionLists();
      if (this.onUnitAttack) {
        this.onUnitAttack(conf);
      }
    })
    item.action2.addEventListener('click', () => {
      this.hideAllActionLists();
      if (this.onUnitReturn) {
        this.onUnitReturn(conf);
      }
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
    for (let unitItem of this.allUnitItems) {
      unitItem.setActionListHidden(true);
    }
  }


  // Window HTML properties
  protected getWindowName(): string { return "units_panel" }
  protected getInnerHTML(): string { return UnitsPanel.innerHtml }
  static initialize() {
    UnitsPanel.innerHtml = BaseWindow.getPrefab(".units_panel_prefab").innerHTML;
  }
}