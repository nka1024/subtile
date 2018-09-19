import { BaseWindow } from "./BaseWindow";

/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

export class MenuPanel extends BaseWindow {
    // static
    static innerHtml:string;

    // public
    public terrainButton:HTMLElement;
    public objectsButton:HTMLElement;
    public gridButton:HTMLElement;
    public exportButton:HTMLElement;
    
    constructor() {
        super();

        this.terrainButton = this.element.querySelector(".terrain_button");
        this.objectsButton = this.element.querySelector(".objects_button");
        this.gridButton = this.element.querySelector(".grid_button");
        this.exportButton = this.element.querySelector(".export_button");
    }

    // Window HTML properties
    protected getWindowName(): string { return "menu_window" }
    protected getInnerHTML(): string  { return MenuPanel.innerHtml }
    static initialize() {
        MenuPanel.innerHtml = BaseWindow.getPrefab(".menu_window_prefab").innerHTML;
    }


}