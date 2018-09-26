/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { BaseWindow } from "./BaseWindow";

export class TargetListPanel extends BaseWindow {
  // static
  static innerHtml: string;

  // public
  public onObjectClick: Function;

  // private 

  private objContainer: HTMLElement;

  private itemWidth: number = 48;
  private itemHeight: number = 48;
  private elements: Array<HTMLElement> = [];

  constructor() {
    super();

    this.objContainer = this.element.querySelector(".obj_list");
    this.objContainer.innerHTML = "";
    this.populate()
    this.removeAll();
  }

  private repopulate() {
    this.removeAll();
    this.populate();
  }

  private removeAll() {
    // for (let object of this.elements) {
    let children = Array.from(this.objContainer.children);
    for (let object of children) {
      this.objContainer.removeChild(object);
    }
    this.elements = []
  }

  public populate() {
    this.addTargetElement({selected: false, texture: 'infantry_1_icon'});
    this.addMarginElement();
    this.addTargetElement({selected: false, texture: 'infantry_2_icon'});
    this.addMarginElement();
    this.addTargetElement({selected: false, texture: 'infantry_2_icon'});
  }

  private addTargetElement(conf: {selected: boolean, texture: string}) {
    let innerHtml = 
      "<input class=\"target_list_item_input\" style=\"border-radius: $_BORDER_RADIUS_$; " +
      "image-rendering: pixelated; " +
      "width: 48px; height: 48px; background: url('$_FILENAME_$') " +
      "center center no-repeat rgb(184, 176, 33);  outline: none;\" type=\"button\" />" +
      "<div style=\"height: 1px; margin: 0 auto;\"></div>" +
      "<div style=\"background-color: #a6e13f; height: 4px; width: 48px; margin: 0 auto;\"></div>" +
      "<h2 style=\"font-size: 10px\">120k</h2>";
    
    let filename = '/assets/' + conf.texture + '.png';
    let element = document.createElement('div');
    this.element.style.outline = 'none';
    this.element.style.fontSize = '0px';

    let borderRadius = conf.selected ? '0px' : '3px'
    innerHtml = innerHtml.replace('$_FILENAME_$', filename);
    innerHtml = innerHtml.replace('$_BORDER_RADIUS_$', borderRadius);
    element.innerHTML = innerHtml;
    this.setElementBorderVisible(element, conf.selected);
    element.addEventListener('click', () => {
      this.selectElement(element);
    });

    this.objContainer.appendChild(element);
    this.elements.push(element);
  }

  private addMarginElement() {
    let element = document.createElement('div');
    element.style.height = "5px";
    element.style.margin = "0 auto";
    this.objContainer.appendChild(element);
  }
  private selectElement(element: HTMLElement) {
    for(let e of this.elements) {
      this.setElementBorderVisible(e, e == element)
    }
  }

  private setElementBorderVisible(element: HTMLElement, visible: boolean) {
    element.style.borderRadius = visible ? '0px' : '3px';
    element.style.border = visible ? "white" : "";
    element.style.borderColor = visible ? "white" : "";
    element.style.borderStyle = visible ? "solid" : "none";
    element.style.borderWidth = visible ? "2px" : "0px";
    element.style.marginTop = visible ? "0px" : "1px";

    let input:HTMLInputElement =  element.querySelector(".target_list_item_input");
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