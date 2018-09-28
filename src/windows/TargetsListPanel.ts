/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { BaseWindow } from "./BaseWindow";
import { BaseUnit } from "../actors/BaseUnit";
import { UnitData } from "../Hero";
import { UnitTargetItem } from "./elements/UnitTargetItem";

declare type TargetItem = {
  unitItem: UnitTargetItem;
  margin: HTMLElement;
  target: any
}

export class TargetListPanel extends BaseWindow {

  // static
  static innerHtml: string;

  // public
  public onObjectSelectionChange: (object: BaseUnit, selected: boolean) => void;

  // private 

  private selectedItem: TargetItem;
  private items: Array<TargetItem> = [];

  private unitsList: HTMLElement;
  private refUnitItem: HTMLElement;

  private allUnitItems: Array<UnitTargetItem> = [];

  constructor() {
    super();

    this.unitsList = this.element.querySelector(".units_list");
    this.refUnitItem = this.element.querySelector(".unit_item");
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
    for (let unitItem of this.allUnitItems) {
      unitItem.populate(unitItem.conf);
    }
  }


  // Public

  public addTarget(object: BaseUnit) {
    let margin = this.makeVerticalSpacingDiv(5);
    let unitItem = this.makeUnitItem(object.conf);
    this.items.push({
      unitItem: unitItem,
      margin: margin,
      target: object
    });

    this.allUnitItems.push(unitItem);
    this.unitsList.appendChild(unitItem.element);
    this.unitsList.appendChild(margin);
  }

  public removeTarget(object: BaseUnit) {
    let item = this.itemByTarget(object);
    if (item) {
      this.deselectTarget(object);
      item.margin.parentNode.removeChild(item.margin);
      item.unitItem.element.parentNode.removeChild(item.unitItem.element);
      this.allUnitItems = this.allUnitItems.filter((o, idx, arr) => {
        return o == item.unitItem; 
      });
    }
  }

  public isTargeted(target: BaseUnit): boolean {
    for (let item of this.items) {
      if (item.target == target)
        return true;
    }
    return false;
  }

  public selectTarget(target: BaseUnit) {
    // skip if item is already selected
    if (this.selectedItem && this.selectedItem.target == target) {
      return;
    }
    this.setTargetSelected(target, true);
    this.selectedItem = this.itemByTarget(target);
  }

  public deselectTarget(target: BaseUnit) {
    // skip if item not selected
    if (!this.selectedItem || this.selectedItem.target != target) {
      return;
    }
    this.setTargetSelected(target, false);
    this.selectedItem = null;
  }


  // Element creationg & configuration

  private makeUnitItem(conf: UnitData): UnitTargetItem {
    let unit = this.refUnitItem.cloneNode(true) as HTMLElement;
    let item = this.configureUnit(unit, conf);
    return item;
  }

  private configureUnit(element: HTMLElement, conf: UnitData): UnitTargetItem {
    let item = new UnitTargetItem(element);

    item.populate(conf);
    item.setSelected(false);
    item.icon.addEventListener('click', () => {
      this.onElementClick(element);
    });
    return item;
  }


  // Private 

  private removeAll() {
    this.unitsList.innerHTML = null;
    this.items = [];
    this.allUnitItems = [];
  }

  private onElementClick(element: HTMLElement) {
    // skip if already selected
    if (this.selectedItem && this.selectedItem.unitItem.element == element) {
      return;
    }

    if (this.selectedItem) {
      this.deselectTarget(this.selectedItem.target);
    }
    this.selectTarget(this.itemByElement(element).target)
  }

  private notifyTargetSelectionChange(target: BaseUnit, selected: boolean) {
    if (!this.onObjectSelectionChange) {
      return
    }
    this.onObjectSelectionChange(target, selected);
  }

  private setTargetSelected(target: BaseUnit, selected: boolean) {
    let item = this.itemByTarget(target)
    if (item) {
      item.unitItem.setSelected(selected);
      this.notifyTargetSelectionChange(target, selected);
    }
  }

  private itemByTarget(target: BaseUnit): TargetItem {
    for (let item of this.items) {
      if (item.target == target) {
        return item;
      }
    }
    return null;
  }

  private itemByElement(element: HTMLElement): TargetItem {
    for (let item of this.items) {
      if (item.unitItem.element == element) {
        return item;
      }
    }
    return null;
  }


  // HTML routines

  private makeVerticalSpacingDiv(height: number): HTMLElement {
    let element = document.createElement('div');
    element.style.height = height + 'px';
    element.style.margin = '0 auto';
    return element;
  }


  // Window HTML properties

  protected getWindowName(): string { return "target_list_panel" }
  protected getInnerHTML(): string { return TargetListPanel.innerHtml }
  static initialize() {
    TargetListPanel.innerHtml = BaseWindow.getPrefab(".target_list_panel_prefab").innerHTML;
  }
}