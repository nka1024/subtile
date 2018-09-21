import { BaseWindow } from "./BaseWindow";

/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

export class ToolsPanel extends BaseWindow {
    // static
    static innerHtml:string;

    // public
    public positionText:HTMLElement;
    public statusText:HTMLElement;
    public playButton:HTMLInputElement;
    
    constructor() {
        super();

        this.positionText = this.element.querySelector(".text_cordinates");
        this.statusText = this.element.querySelector(".text_status");
        this.playButton = this.element.querySelector(".play_button");
    }

    // Window HTML properties
    protected getWindowName(): string { return "tools_panel" }
    protected getInnerHTML(): string  { return ToolsPanel.innerHtml }
    static initialize() {
        ToolsPanel.innerHtml = BaseWindow.getPrefab(".tools_panel_prefab").innerHTML;
    }


}