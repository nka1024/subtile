import { BaseWindow } from "./BaseWindow";

/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

export class OkPopup extends BaseWindow {
    // static
    static innerHtml: string;

    // public
    public okButton: HTMLElement;
    public titleText: HTMLElement;
    public messageText: HTMLElement;

    constructor(title: string, message: string) {
        super();

        this.titleText = this.element.querySelector(".text_title");
        this.messageText = this.element.querySelector(".text_message");
        this.okButton = this.element.querySelector(".submit_button");

        this.titleText.innerHTML = title;
        this.messageText.innerHTML = message;
        this.okButton.addEventListener('click', () => {
            this.destroy();
        });
    }

    // Window HTML properties
    protected getWindowName(): string { return "ok_popup" }
    protected getInnerHTML(): string  { return OkPopup.innerHtml }
    static initialize() {
        OkPopup.innerHtml = BaseWindow.getPrefab(".ok_popup_prefab").innerHTML;
    }

}