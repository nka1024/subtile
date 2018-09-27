/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { BaseWindow } from "./BaseWindow";

declare type TargetItem = {
  element: HTMLElement;
  margin: HTMLElement;
  target: any
}

export class TargetListPanel extends BaseWindow {

  // static
  static innerHtml: string;

  // public
  public onObjectSelectionChange: (object: any, selected:boolean) => void;

  // private 

  private objContainer: HTMLElement;
  private selectedItem: TargetItem;
  private items: Array<TargetItem> = [];

  constructor() {
    super();

    this.objContainer = this.element.querySelector(".obj_list");
    this.objContainer.innerHTML = "";
  }

  public addTarget(object: any, texture: string) {
    let margin = this.addMarginElement();
    let element = this.addTargetElementHTML({ selected: false, texture: texture });
    
    this.items.push({
      element: element,
      margin: margin,
      target: object
    });
  }

  public isTargeted(target: any):boolean {
    for (let item of this.items) {
      if (item.target == target)
        return true;
    }
    return false;
  }

  public selectTarget(target: object) {
    // skip if item is already selected
    if (this.selectedItem && this.selectedItem.target == target) {
      return;
    }
    this.setTargetSelected(target, true);
    this.selectedItem = this.itemByTarget(target);
  }

  public deselectTarget(target: object) {
    // skip if item not selected
    if (!this.selectedItem || this.selectedItem.target != target) {
      return;
    }
    this.setTargetSelected(target, false);
    this.selectedItem = null;
  }



  // Private 

  private removeAll() {
    let children = Array.from(this.objContainer.children);
    for (let object of children) {
      this.objContainer.removeChild(object);
    }
    this.items = [];
  }

  private onElementClick(element: HTMLElement) {
    // skip if already selected
    if (this.selectedItem && this.selectedItem.element == element) {
      return;
    }

    if (this.selectedItem) {
      this.deselectTarget(this.selectedItem.target);
    }
    this.selectTarget(this.itemByElement(element).target)
  }

  private notifyTargetSelectionChange(target:any, selected: boolean) {
    if (!this.onObjectSelectionChange) {
      return
    }
    this.onObjectSelectionChange(target, selected);
  }

  private setTargetSelected(target: any, selected: boolean) {
    let item = this.itemByTarget(target)
    if (item) {
        this.setElementBorderHTML(item.element, selected);
        this.notifyTargetSelectionChange(target, selected);
    }
  }

  private itemByTarget(target: any):TargetItem {
    for (let item of this.items) {
      if (item.target == target) {
        return item;
      }
    }
    return null;
  }

  private itemByElement(element: HTMLElement):TargetItem {
    for (let item of this.items) {
      if (item.element == element) {
        return item;
      }
    }
    return null;
  }

  
  // HTML routines

  private addMarginElement(): HTMLElement {
    let element = document.createElement('div');
    element.style.height = "5px";
    element.style.margin = "0 auto";
    this.objContainer.appendChild(element);
    return element;
  }

  private addTargetElementHTML(conf: { selected: boolean, texture: string }): HTMLElement {
    let innerHtml =
      "<input class=\"target_list_item_input\" style=\"border-radius: $_BORDER_RADIUS_$; " +
      "image-rendering: pixelated; " +
      "width: 48px; height: 48px; background: url('$_FILENAME_$') " +
      "center center no-repeat rgb(184, 176, 33);  outline: none;\" type=\"button\" />" +
      "<div style=\"position: relative\">" +
      "<h2 class=\"unit_item_quantity\" style=\"font-size: 10px; background-color: rgba(0,0,0,0.5); padding-left: 5px; position: absolute; right: 3px; top: -48px\">60</h2></div>" +
      "<div style=\"height: 1px; margin: 0 auto;\"></div>" +
      "<div style=\"background-color: #a6e13f; border-radius: 1px; height: 4px; width: 48px; margin: 0 auto;\"></div>" +
      "<h2 style=\"font-size: 10px\">Scouts</h2>";

    let filename = '/assets/' + conf.texture + '.png';
    let element = document.createElement('div');
    this.element.style.outline = 'none';
    this.element.style.fontSize = '0px';

    let borderRadius = conf.selected ? '0px' : '3px'
    innerHtml = innerHtml.replace('$_FILENAME_$', filename);
    innerHtml = innerHtml.replace('$_BORDER_RADIUS_$', borderRadius);
    element.innerHTML = innerHtml;
    this.setElementBorderHTML(element, conf.selected);
    element.addEventListener('click', () => {
      this.onElementClick(element);
    });

    this.objContainer.appendChild(element);
    return element;
  }

  private setElementBorderHTML(element: HTMLElement, visible: boolean) {
    element.style.borderRadius = visible ? '0px' : '3px';
    element.style.border = visible ? "white" : "";
    element.style.borderColor = visible ? "white" : "";
    element.style.borderStyle = visible ? "solid" : "none";
    element.style.borderWidth = visible ? "2px" : "0px";
    element.style.marginTop = visible ? "0px" : "1px";

    let input: HTMLInputElement = element.querySelector(".target_list_item_input");
    input.style.borderRadius = visible ? '0px' : '3px';;
    input.style.marginTop = visible ? "1px" : "2px";
  }


  // Window HTML properties

  protected getWindowName(): string { return "target_list_panel" }
  protected getInnerHTML(): string { return TargetListPanel.innerHtml }
  static initialize() {
    TargetListPanel.innerHtml = BaseWindow.getPrefab(".target_list_panel_prefab").innerHTML;
  }
}