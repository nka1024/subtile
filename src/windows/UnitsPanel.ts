/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { BaseWindow } from "./BaseWindow";
import { UnitData } from "../Hero";
import { UnitItem } from "./elements/UnitItem";

  
export class UnitsPanel extends BaseWindow {
  // static
  static innerHtml: string;

  // public
  public onUnitAttack: (conf: UnitData) => void;
  public onUnitReturn: (conf: UnitData) => void;
  public filenamePrefix: string;

  // private
  private allUnitItems: Array<UnitItem> = [];

  // template elements
  private unitsList: HTMLElement;
  private refUnitTypeItem: HTMLElement;

  constructor() {
    super();

    this.unitsList = this.element.querySelector(".unit_types_list");
    this.refUnitTypeItem = this.element.querySelector(".unit_type_item");
    this.unitsList.innerHTML = "";

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
    for (let unitTypeItem of this.allUnitItems) {
      unitTypeItem.populate(unitTypeItem.conf);
    }
  }

  
  // Data population

  public populate(units: Array<UnitData>) {
    this.clear();
    let first = true;

    for (let unit of units) {
      let unitItem = this.makeUnitItem(unit);
      // spacing
      if (first) first = false;
      else this.unitsList.appendChild(this.makeHorizontalSpacingDiv(5));
      
      this.unitsList.appendChild(unitItem.element);
      this.allUnitItems.push(unitItem);
    }
  }

  private clear() {
    this.unitsList.innerHTML = "";
    this.allUnitItems = [];
  }


  // Element creation & configuration

  private makeUnitItem(conf: UnitData): UnitItem {
    let element = this.refUnitTypeItem.cloneNode(true) as HTMLElement;
    let typeItem = this.configureUnit(element, conf);
    return typeItem;
  }

  private configureUnit(element: HTMLElement, conf: UnitData): UnitItem {
    let item = new UnitItem(element);

    this.allUnitItems.push(item);
    item.populate(conf);
    item.onSelectionChange = (selected: boolean) => {
        if (selected && this.onUnitAttack) {
          this.onUnitAttack(conf);
        } else if (!selected && this.onUnitReturn) {
          this.onUnitReturn(conf);
        }
    };
    let onIconClick = () => {
        // hide currently unfolded unit list if clicked on any of them
        item.setSelected(!item.isSelected)
    }
    item.icon.addEventListener('click', onIconClick);

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