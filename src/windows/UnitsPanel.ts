/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { BaseWindow } from "./BaseWindow";
import { UnitTypeData, UnitData } from "../Hero";
import { UnitItem } from "./elements/UnitItem";
import { UnitTypeItem } from "./elements/UnitTypeItem";

  
export class UnitsPanel extends BaseWindow {
  // static
  static innerHtml: string;

  // public
  public onUnitAttack: (conf: UnitTypeData) => void;
  public onUnitReturn: (conf: UnitTypeData) => void;
  public filenamePrefix: string;

  // private
  private allUnitTypes: Array<UnitTypeItem> = [];

  // template elements
  private unitTypesList: HTMLElement;
  private refUnitTypeItem: HTMLElement;

  constructor() {
    super();

    this.unitTypesList = this.element.querySelector(".unit_types_list");
    this.refUnitTypeItem = this.element.querySelector(".unit_type_item");
    this.unitTypesList.innerHTML = "";

    this.startDataSyncLoop();
  }


  // Data sync

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
    for (let unitTypeItem of this.allUnitTypes) {
      unitTypeItem.populate(unitTypeItem.conf);
    }
  }

  
  // Data population

  public populate(unitTypes: Array<UnitTypeData>) {
    this.clear();
    let first = true;

    for (let unitType of unitTypes) {
      let typeItem = this.makeUnitTypeItem(unitType);
      // spacing
      if (first) first = false;
      else this.unitTypesList.appendChild(this.makeHorizontalSpacingDiv(5));
      
      this.unitTypesList.appendChild(typeItem.element);
      this.allUnitTypes.push(typeItem);
    }
  }

  private clear() {
    this.unitTypesList.innerHTML = "";
    this.allUnitTypes = [];
  }


  // Element creation & configuration

  private makeUnitTypeItem(conf: UnitTypeData): UnitTypeItem {
    let element = this.refUnitTypeItem.cloneNode(true) as HTMLElement;
    let typeItem = this.configureUnitType(element, conf);
    return typeItem;
  }

  private configureUnitType(element: HTMLElement, conf: UnitTypeData): UnitTypeItem {
    let item = new UnitTypeItem(element);

    this.allUnitTypes.push(item);
    item.populate(conf);
    item.onSelectionChange = (selected: boolean) => {
        if (selected && this.onUnitAttack) {
          this.onUnitAttack(conf);
        } else if (!selected && this.onUnitReturn) {
          this.onUnitAttack(conf);
        }
    };
    let foldingCallback = () => {
        // hide currently unfolded unit list if clicked on any of them
        item.setSelected(!item.isSelected)
    }
    item.icon.addEventListener('click', foldingCallback);

    return item;
  }

  private makeHorizontalSpacingDiv(width: number): HTMLElement {
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