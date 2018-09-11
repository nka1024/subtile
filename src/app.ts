/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

/// <reference path="./phaser.d.ts"/>

import "phaser";
// import "../node_modules/phaser/dist/phaser.js";

import { BootScene } from "./scenes/bootScene";
import { EditorRootScene } from "./scenes/editorRootScene";


var game = null;

export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}


window.onload = () => {
  var c = document.getElementById('canvas_main') as HTMLCanvasElement;
  const config: GameConfig = {
    title: "subtile",
    url: "https://github.com/nka1024/subtile",
    version: "1.0",
    type: Phaser.AUTO,
    // type: Phaser.CANVAS,
    parent: "game",
    scene: [BootScene, EditorRootScene],
    input: {
      keyboard: true,
      mouse: true,
      touch: true,
      gamepad: false
    },
    physics: null,
    disableContextMenu: true,
    // backgroundColor: "#b8b021",
    backgroundColor: "#0c0f12",
    pixelArt: false,
    antialias: false,
    canvas: c,
    canvasStyle: "position: fixed; top: 0; left: 0"
  };


  game = new Game(config);
  resize(window.innerWidth, window.innerHeight);

  reverse(document.body);
};

function reverse(n) {          // Reverse the order of the children of Node n
  var kids = n.childNodes;   // Get the list of children
  var numkids = kids.length; // Figure out how many there are
  for(var i = numkids-1; i >= 0; i--) {  // Loop through them backwards
      var c = n.removeChild(kids[i]);    // Remove a child
      n.appendChild(c);                  // Put it back at its new position
  }
}



// prevent page scrolling on mobile
document.ontouchmove = function (event) {
  event.preventDefault();
}


// handle window resizing
window.addEventListener('resize', () => {
  resize(window.innerWidth, window.innerHeight);
}, false);

function create() {
  this.events.on('resize', this.parent.resize, this);
}

function resize(width, height) {
  game.resize(width, height);
}
