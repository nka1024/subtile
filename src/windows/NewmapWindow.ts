import { BaseWindow } from "./BaseWindow";

/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

export class NewmapWindow extends BaseWindow {
    // static
    static innerHtml:string;

    // public
    public okButton:HTMLElement;
    public titleText:HTMLElement;
    public inputWidth:HTMLElement;
    public inputHeight:HTMLElement;
    public inputMapName:HTMLElement;
    
    constructor(title:string) {
        super();

        this.titleText = this.element.querySelector(".text_title");
        this.inputWidth = this.element.querySelector(".width_input");
        this.inputHeight = this.element.querySelector(".height_input");
        this.okButton = this.element.querySelector(".submit_button");

        this.titleText.innerHTML = title;
        this.okButton.addEventListener('click', () => {
            this.destroy();            
        });
    }

    // Window HTML properties
    protected getWindowName(): string { return "newmap_window" }
    protected getInnerHTML(): string  { return NewmapWindow.innerHtml }
    static initialize() {
        NewmapWindow.innerHtml = BaseWindow.getPrefab(".newmap_window_prefab").innerHTML;
    }


}