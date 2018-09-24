/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { CONST } from "./const/const";

export let ASSETS = {
  TERRAIN_MAX: 4,
  TREE_MAX: 10,
  HOUSE_MAX: 8,
  ROCK_MAX: 3
}

export class AssetsLoader {
  public static preload(scene: Phaser.Scene) {
    scene.load.json("map", "./assets/map.json");
    scene.load.image("placeholder", "./assets/placeholder.png");
    scene.load.image("grid_128_50", "./assets/grid_128_a50.png");
    scene.load.image("grid_128_30", "./assets/grid_128_a50.png");
    scene.load.image("path_end_14x14", "./assets/path_end_14x14.png");
    scene.load.image("path_mid_14x14", "./assets/path_mid_14x14.png");
    scene.load.image("grid_tile_green_16_a50", "./assets/grid_tile_green_16_a50.png");
    scene.load.image("grid_tile_yellow_16_a50", "./assets/grid_tile_yellow_16_a50.png");
    scene.load.image("grid_tile_red_16_a50", "./assets/grid_tile_red_16_a50.png");
    scene.load.image("cursor", "./assets/cursor.png");
    scene.load.image("cursor_grid_32x32", "./assets/cursor_grid_32x32.png");

    scene.load.spritesheet('player_idle_32x32', './assets/sprites/player_idle_32x32.png', { 
      frameWidth: 32, 
      frameHeight: 32, 
      endFrame: 4
    });

    scene.load.spritesheet('player_walk_32x32', './assets/sprites/player_walk_32x32.png', { 
      frameWidth: 32, 
      frameHeight: 32, 
      endFrame: 4
    });

    for (let idx = 1; idx <= ASSETS.TERRAIN_MAX; idx++) {
      scene.load.image("terrain_" + idx, "./assets/tilemap/terrain_" + idx + ".png");
    }
    for (let idx = 1; idx <= ASSETS.ROCK_MAX; idx++) {
      scene.load.image("rock_" + idx, "./assets/tilemap/rock_" + idx + ".png");
    }
    for (let idx = 1; idx <= ASSETS.TREE_MAX; idx++) {
      scene.load.image("tree_" + idx, "./assets/tilemap/tree_" + idx + ".png");
    }
    for (let idx = 1; idx <= ASSETS.HOUSE_MAX; idx++) {
      scene.load.image("house_" + idx, "./assets/tilemap/house_" + idx + ".png");
    }
  }
}