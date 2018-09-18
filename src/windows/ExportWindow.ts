import { BaseWindow } from "./BaseWindow";

/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

export class ExportWindow extends BaseWindow {
    // static
    static innerHtml:string;

    // public
    public cancelButton:HTMLElement;
    public exportButton:HTMLElement;
    public importButton:HTMLElement;
    public dataInput:HTMLElement;
    public titleText:HTMLElement;
    
    constructor(title:string) {
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
    protected getInnerHTML(): string  { return ExportWindow.innerHtml }
    static initialize() {
        ExportWindow.innerHtml = BaseWindow.getPrefab(".export_window_prefab").innerHTML;
    }


}