/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { Button, ButtonType } from "../uikit/button";

/// <reference path="./types/canvasinput.d.ts"/>


export class EditorRootScene extends Phaser.Scene {

  // private canvas2: HTMLCanvasElement;
  private ci:CanvasInput;
  private titleText: Phaser.GameObjects.Text;
  // private inputField:CanvasInput;
  constructor() {
    super({
      key: "EditorRootScene"
    });
  }

  preload() {
      Button.load(this);
  }
  create(data):void {
    
    // this.sys.canvas.ownerDocument
    // var c = document.getElementById('canvas_main');
    // console.log(c);



    // var input = document.createElement('input');
    // input.type = 'text';
    // input.style.position = 'absolute';
    // input.style.left = '10px';
    // input.style.top = '10px';
    // input.style.width = '300px';
    // input.style.height = '60px';
    // document.body.appendChild(input);


    // input.style.zIndex = 0;
    // document.body.appendChild()
    // this.canvas2 = this.sys.canvas.ownerDocument.createElement('canvas');
    // this.canvas2.setAttribute('width', "300");
    // this.canvas2.setAttribute('height', "100");
    // this.canvas2.style.backgroundColor = "0xffffff";
    // document.body.appendChild(this.canvas2);

    // this.sys.events.on("render",()=> {
    //   this.ci.render();
    // });
    // this.ci = new CanvasInput({
    //   x: 20, y: 460,
    //   canvas: this.sys.canvas,
    //   fontSize: 18,
    //   fontFamily: 'Arial',
    //   fontColor: '#212121',
    //   fontWeight: 'bold',
    //   width: 256/2 - 20,
    //   height: 20,
    //   padding: 8,
    //   borderWidth: 1,
    //   borderColor: '#000',
    //   borderRadius: 3,
    //   boxShadow: '1px 1px 0px #fff',
    //   innerShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)',
    //   placeHolder: 'Enter message here...'
    // })
    
    
    // this.titleText = this.add.text(
    //   this.sys.canvas.width/2 - 50, 10,
    //   '',
    //   { fontFamily: 'system-ui', fontSize: 32, color: '#ffffff' }
    // );

    // Buttons
    // var okButton = Button.create(this, 128/2 + 20, 300, ButtonType.ok, "OK");
    // var expandButton = Button.create(this, 128/2 + 20, 420, ButtonType.expand, "EXPAND");
    var plainButton = Button.create(this, 128/2 + 20, 20, ButtonType.plain, "show menu");
    plainButton.onclick = () => {
      console.log('lala');
      var c = document.getElementById('container');
      c.hidden = !c.hidden;
    };

  }

  update():void {
    // this.titleText.x = this.sys.canvas.width/2 - this.titleText.width/2;
  }

  
}
