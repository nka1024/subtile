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
    public cordLabel:HTMLElement;
    
    constructor() {
        super();

        this.cordLabel = this.element.querySelector(".text_cordinates");
        // this.terrainButton = this.element.querySelector(".terrain_button");
        // this.objectsButton = this.element.querySelector(".objects_button");
        // this.gridButton = this.element.querySelector(".grid_button");
        // this.exportButton = this.element.querySelector(".export_button");
    }

    // Window HTML properties
    protected getWindowName(): string { return "tools_panel" }
    protected getInnerHTML(): string  { return ToolsPanel.innerHtml }
    static initialize() {
        ToolsPanel.innerHtml = BaseWindow.getPrefab(".tools_panel_prefab").innerHTML;
    }


}