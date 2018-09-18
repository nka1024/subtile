import { BaseWindow } from "./BaseWindow";
import { CONST } from "../const/const";

/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

export class ObjectsListWindow extends BaseWindow {
    // static
    static innerHtml:string;

    // public
    public objects:Array<HTMLElement>;

    // private 
    private filenamePrefix:string;
    private itemWidth:number;
    private itemHeight:number;
    private maxIdx:number

    
    constructor(filenamePrefix:string, maxIdx:number, itemWidth:number, itemHeight:number) {
        super();

        this.filenamePrefix = filenamePrefix;
        this.itemWidth = itemWidth;
        this.itemHeight = itemHeight;
        this.maxIdx = maxIdx;

        this.objects = [];
        let listParent = this.element.querySelector(".obj_list");
        for(let i = 1; i <= this.maxIdx; i++) {
            let filename = this.filenamePrefix + '_' + i + '.png';
            let element = document.createElement('input');
            element.className = "btn btn-blue land_button";
            element.id = "landButton"
            element.style.width = this.itemWidth + 'px';
            element.style.height = this.itemHeight + 'px';
            element.style.verticalAlign = "middle";
            element.type = "button";
            element.style.background = 'rgba(184,176,33,1) url(/assets/tilemap/'+filename+') no-repeat center';

            listParent.appendChild(element);
            this.objects.push(element);
            listParent.innerHTML += '&nbsp;'
        }
    }

    // Window HTML properties
    protected getWindowName(): string { return "objects_list_window" }
    protected getInnerHTML(): string  { return ObjectsListWindow.innerHtml }
    static initialize() {
        ObjectsListWindow.innerHtml = BaseWindow.getPrefab(".objects_list_window_prefab").innerHTML;
    }
}