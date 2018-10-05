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
    public buttons: HTMLInputElement[] = [];

    constructor(x:number, y:number, buttons: string[], width:number = ContextMenuWindow.defaultWidth) {
        super();
        this.width = width;

        this.element.style.position = "absolute";
        this.element.style.left = x + "px";
        this.element.style.top = y + "px";
        this.element.style.width = width + "px";
        this.buttons.push(this.element.querySelector(".recon_button"));
        this.buttons[0].value = buttons[0];
        this.buttons[0].addEventListener('click', () => {
            this.destroy();
        });

        let container = this.element.querySelector(".button_container") as HTMLElement;
        
        buttons.shift();
        for(let value of buttons) {
            let button = this.createButton(container);
            button.value = value;
            this.buttons.push(button);
            button.addEventListener('click', () => {
                this.destroy();
            });
        }
    }

    private createButton(parent: HTMLElement): HTMLInputElement {
        var element = document.createElement('div');
        element.className = "submit ";
        element.id = "loginForm";
        element.style.display = "flex";
        element.style.textAlign = "center";
        element.style.padding = "0px"
        element.innerHTML = '<input class="btn btn-blue inner_button" style="margin-left: 5px; margin-right: 5px; margin-bottom: 5px; height: 30px; padding: 0px; padding-left:10px; padding-right:10px; font-size: 12px; vertical-align: middle;" type="button" value="value" />'
        let button: HTMLInputElement = element.querySelector('.inner_button');
        parent.appendChild(element);
        
        return button;
    }
    // Window HTML properties
    protected getWindowName(): string { return "context_object_popup" }
    protected getInnerHTML(): string  { return ContextMenuWindow.innerHtml }
    static initialize() {
        ContextMenuWindow.innerHtml = BaseWindow.getPrefab(".context_object_popup_prefab").innerHTML;
    }

}