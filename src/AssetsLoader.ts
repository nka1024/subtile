/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { CONST } from "./const/const";

export let ASSETS = {
  TERRAIN_MAX: 4,
  TREE_MAX: 9,
  ROCK_MAX: 3
}

export class AssetsLoader {
  public static preload(scene: Phaser.Scene) {
    scene.load.image("placeholder", "./assets/placeholder.png");
    scene.load.image("cursor", "./assets/cursor.png");
    for (let idx = 1; idx <= ASSETS.TERRAIN_MAX; idx++) {
      scene.load.image("terrain_" + idx, "./assets/tilemap/terrain_" + idx + ".png");
    }
    for (let idx = 1; idx <= ASSETS.ROCK_MAX; idx++) {
      scene.load.image("rock_" + idx, "./assets/tilemap/rock_" + idx + ".png");
    }
    for (let idx = 1; idx <= ASSETS.TREE_MAX; idx++) {
      scene.load.image("tree_" + idx, "./assets/tilemap/tree_" + idx + ".png");
    }
  }
}