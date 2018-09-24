/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { BaseWindow } from "./BaseWindow";

export class ContextObjectPopup extends BaseWindow {
    public width:number = 100;
    
    // static
    private static innerHtml: string;
    public static defaultWidth:number = 100;

    // public
    public reconButton: HTMLInputElement;

    constructor(x:number, y:number, width:number = ContextObjectPopup.defaultWidth) {
        super();
        this.width = width;

        this.element.style.position = "absolute";
        this.element.style.left = x + "px";
        this.element.style.top = y + "px";
        this.element.style.width = width + "px";
        this.reconButton = this.element.querySelector(".recon_button");

        this.reconButton.addEventListener('click', () => {
            this.destroy();
        });
    }

    // Window HTML properties
    protected getWindowName(): string { return "context_object_popup" }
    protected getInnerHTML(): string  { return ContextObjectPopup.innerHtml }
    static initialize() {
        ContextObjectPopup.innerHtml = BaseWindow.getPrefab(".context_object_popup_prefab").innerHTML;
    }

}