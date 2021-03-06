/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { TileGrid } from "../../TileGrid";
import { UI_DEPTH } from "../../const/const";

export class MapImporterModule {
  private scene: Phaser.Scene;
  private grid: TileGrid;

  constructor(scene: Phaser.Scene, grid: TileGrid) {
    this.scene = scene;
    this.grid = grid;
  }

  public importMap(map: any) {
    // cleanup
    for (let child of this.scene.children.getAll()) {
      // exclude UI
      let depth = (child as Phaser.GameObjects.Image).depth;
      if (![
        UI_DEPTH.CURSOR, 
        UI_DEPTH.EDITOR_GRID_FRAME, 
        UI_DEPTH.EDITOR_GRID_TILE
      ].includes(depth)) {
        child.destroy()
      }
    }

    // create grid from config
    this.grid.import(map.grid);
    // create objects from config      
    for (let item of map.objects) {
      this.createObjectFromConfig(item);
    }
  }

  private createObjectFromConfig(data: any) {
    let obj = new Phaser.GameObjects.Image(this.scene, 0, 0, null);
    obj.scaleX = 2;
    obj.scaleY = 2;
    obj.originX = 0.5;
    obj.originY = 1;
    obj.setTexture(data.texture);
    obj.x = data.x;
    obj.y = data.y;
    obj.depth = data.depth;
    this.scene.add.existing(obj);
  }
  
}

