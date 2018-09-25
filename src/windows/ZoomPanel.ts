/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { BaseWindow } from "./BaseWindow";

export class ZoomPanel extends BaseWindow {
    // static
    static innerHtml:string;

    // public
    public zoomInButton:HTMLInputElement;
    public zoomOutButton:HTMLInputElement;
    
    constructor() {
        super();

        this.zoomInButton = this.element.querySelector(".zoom_in_button");
        this.zoomOutButton = this.element.querySelector(".zoom_out_button");
    }

    // Window HTML properties
    protected getWindowName(): string { return "zoom_panel" }
    protected getInnerHTML(): string  { return ZoomPanel.innerHtml }
    static initialize() {
        ZoomPanel.innerHtml = BaseWindow.getPrefab(".zoom_panel_prefab").innerHTML;
    }


}