import { BaseWindow } from "./BaseWindow";
import { UI_DEPTH } from "../const/const";

/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

export class ExportWindow extends BaseWindow {
  // static
  static innerHtml: string;

  // public
  public cancelButton: HTMLElement;
  public exportButton: HTMLElement;
  public importButton: HTMLElement;
  public dataInput: HTMLTextAreaElement;
  public titleText: HTMLElement;

  constructor(title: string) {
    super();

    this.titleText = this.element.querySelector(".text_title");
    this.dataInput = this.element.querySelector(".data_input");
    this.exportButton = this.element.querySelector(".export_button");
    this.importButton = this.element.querySelector(".import_button");
    this.cancelButton = this.element.querySelector(".cancel_button");

    this.titleText.innerHTML = title;
    this.cancelButton.addEventListener('click', () => {
      this.destroy();
    });
  }

  // Window HTML properties
  protected getWindowName(): string { return "export_window" }
  protected getInnerHTML(): string { return ExportWindow.innerHtml }
  static initialize() {
    ExportWindow.innerHtml = BaseWindow.getPrefab(".export_window_prefab").innerHTML;
  }


  public populate(children: Phaser.GameObjects.GameObject[], gridData:any) {
    var result = {
      objects: null,
      grid: gridData
    };
    var objects = [];

    for (let child of children) {
      let image = child as Phaser.GameObjects.Image
      // exclude ui layer
      if (image.depth == UI_DEPTH.EDITOR_GRID_FRAME) continue
      if (image.depth == UI_DEPTH.EDITOR_GRID_TILE) continue
      if (image.depth == UI_DEPTH.CURSOR) continue

      let texture = image.texture

      let childData = {
        texture: texture.key,
        depth: image.depth,
        x: image.x,
        y: image.y
      };
      objects.push(childData);
    }
    result.objects = objects;
    this.dataInput.value = JSON.stringify(result);
  }

  public getInputText() {
    return this.dataInput.value;
  }
}