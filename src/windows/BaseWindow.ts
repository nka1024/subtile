/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

export abstract class BaseWindow {
  // private
  protected element: HTMLElement;
  protected parent: HTMLElement;

  public onDestroy:(w: BaseWindow) => void;

  constructor() {
    var parent = document.querySelector('.window_manager') as HTMLElement;
    this.createDiv(parent, this.getWindowName());
  }

  private createDiv(parent: HTMLElement, className: string) {
    var element = document.createElement('div');
    element.style.display = "none";
    element.className = className;
    element.innerHTML = this.getInnerHTML();
    parent.appendChild(element);
    this.element = element;
  }

  public destroy() {
    this.element.parentNode.removeChild(this.element);
    if (this.onDestroy != null) {
      this.onDestroy(this);
    } 
  }

  protected static getPrefab(prefabName: string): HTMLElement {
    var d = document.querySelector(prefabName);
    d.parentNode.removeChild(d);
    return d as HTMLElement;
  }

  // static initialize(document:HTMLDocument) {
  // }

  public show() {
    this.element.style.display = "block";
  }
  public hide() {
    this.element.style.display = "none";
  }

  protected abstract getWindowName(): string;
  protected abstract getInnerHTML(): string;

}