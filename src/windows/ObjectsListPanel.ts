import { BaseWindow } from "./BaseWindow";
import { CONST } from "../const/const";

/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

export class ObjectsListPanel extends BaseWindow {
    // static
    static innerHtml:string;

    // public
    public onObjectClick:Function;
    public filenamePrefix:string;

    // private 
    private itemWidth:number;
    private itemHeight:number;
    private maxIdx:number
    private objects:Array<HTMLElement>;
    
    constructor(filenamePrefix:string, maxIdx:number, itemWidth:number, itemHeight:number) {
        super();

        this.filenamePrefix = filenamePrefix;
        this.itemWidth = itemWidth;
        this.itemHeight = itemHeight;
        this.maxIdx = maxIdx;

        this.objects = [];
        let listParent = this.element.querySelector(".obj_list");
        for(let idx = 1; idx <= this.maxIdx; idx++) {
            let filename = this.filenamePrefix + '_' + idx + '.png';
            let element = document.createElement('input');
            // element.className = "btn btn-blue";
            element.style.width = this.itemWidth + 'px';
            element.style.height = this.itemHeight + 'px';
            element.style.verticalAlign = "middle";
            element.type = "button";
            element.style.background = 'rgba(184,176,33,1) url(/assets/tilemap/'+filename+') no-repeat center';
            element.style.marginRight = '5px';
            element.addEventListener('click', ()=>{
                if (this.onObjectClick) {
                    this.onObjectClick(idx)
                }
            });
            
            listParent.appendChild(element);
            this.objects.push(element);
        }
    }

     

    // Window HTML properties
    protected getWindowName(): string { return "objects_list_window" }
    protected getInnerHTML(): string  { return ObjectsListPanel.innerHtml }
    static initialize() {
        ObjectsListPanel.innerHtml = BaseWindow.getPrefab(".objects_list_window_prefab").innerHTML;
    }
}