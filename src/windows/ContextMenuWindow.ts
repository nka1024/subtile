/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { BaseWindow } from "./BaseWindow";

export class ContextMenuWindow extends BaseWindow {
    public width: number = 100;
    
    // static
    private static innerHtml: string;
    public static defaultWidth:number = 100;

    // public
    public button: HTMLInputElement;

    constructor(x:number, y:number, width:number = ContextMenuWindow.defaultWidth) {
        super();
        this.width = width;

        this.element.style.position = "absolute";
        this.element.style.left = x + "px";
        this.element.style.top = y + "px";
        this.element.style.width = width + "px";
        this.button = this.element.querySelector(".recon_button");

        this.button.addEventListener('click', () => {
            this.destroy();
        });
    }

    // Window HTML properties
    protected getWindowName(): string { return "context_object_popup" }
    protected getInnerHTML(): string  { return ContextMenuWindow.innerHtml }
    static initialize() {
        ContextMenuWindow.innerHtml = BaseWindow.getPrefab(".context_object_popup_prefab").innerHTML;
    }

}