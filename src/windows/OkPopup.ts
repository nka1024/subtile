/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

export class OkPopup {
    // static
    static innerHtml:string;
    static document:HTMLDocument;

    // private
    private element:HTMLElement;
    private parent:HTMLElement;

    // public
    public okButton:HTMLElement;
    public titleText:HTMLElement;
    public messageText:HTMLElement;
    
    constructor(parent:HTMLElement, title:string, message:string) {
        this.createDiv(parent, "ok_popup");
        
        this.element.hidden = true;

        this.titleText = this.element.querySelector(".text_title");
        this.messageText = this.element.querySelector(".text_message");
        this.okButton = this.element.querySelector(".submit_button");
        
        this.titleText.innerHTML = title;
        this.messageText.innerHTML = message;
        this.okButton.addEventListener('click', () => {
            this.destroy();            
        });
    }

    private createDiv(parent:HTMLElement, className:string) {
        var element = document.createElement('div');
        element.className = className;
        element.innerHTML = OkPopup.innerHtml;
        parent.appendChild(element);
        this.element = element;
    }

    private destroy() {
        this.element.parentNode.removeChild(this.element);
    }

    static initialize(document:HTMLDocument) {
        var d = document.querySelector('.ok_popup_prefab');
        d.parentNode.removeChild(d);

        OkPopup.innerHtml = d.innerHTML;
    }

    public show() {
        this.element.hidden = false;
    }
    public hide() {
        this.element.hidden = true;
    }
}