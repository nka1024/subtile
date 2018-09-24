/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { BaseWindow } from "./BaseWindow";

export class UnitsPanel extends BaseWindow {
    // static
    static innerHtml:string;

    // public
    public onObjectClick:Function;
    public filenamePrefix:string;

    public playerButton:HTMLInputElement;
    public unit1Button:HTMLInputElement;
    public unit2Button:HTMLInputElement;
    
    constructor() {
        super();

        this.playerButton = this.element.querySelector(".player_button");
        this.unit1Button = this.element.querySelector(".unit_1_button");
        this.unit2Button = this.element.querySelector(".unit_2_button");
    
        this.playerButton.addEventListener('click', () => {
            
        });
        this.unit1Button.addEventListener('click', () => {
            
        });
        this.unit2Button.addEventListener('click', () => {
            
        });
    }



    // Window HTML properties
    protected getWindowName(): string { return "units_panel" }
    protected getInnerHTML(): string  { return UnitsPanel.innerHtml }
    static initialize() {
        UnitsPanel.innerHtml = BaseWindow.getPrefab(".units_panel_prefab").innerHTML;
    }
}