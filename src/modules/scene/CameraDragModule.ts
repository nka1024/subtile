/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

export class CameraDragModule {
  private prevPointerX: number;
  private prevPointerY: number;
  private distance: Number;

  private scene:Phaser.Scene;

  private dragStart: {x: number, y: number};

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }


  // Public
  
  public update() {
    this.cameraDrag();
  }

  public get isDrag():boolean {
    return this.distance > 10;
  }
  

  // Private
  
  private cameraDrag() {
    let ptr = this.scene.input.activePointer;

    if (ptr.isDown) {
      if (!ptr.justDown) {
        this.scene.cameras.main.scrollX -= (ptr.x - this.prevPointerX)
        this.scene.cameras.main.scrollY -= (ptr.y - this.prevPointerY)
        this.distance = Phaser.Math.Distance.Between(this.dragStart.x, this.dragStart.y, ptr.x, ptr.y);
      } else {
        // this.distance = 0;
        this.dragStart = {x: ptr.x, y: ptr.y};
      }
      this.prevPointerX = ptr.x;
      this.prevPointerY = ptr.y
    }

    if (ptr.justUp) {
      this.prevPointerX = 0;
      this.prevPointerY = 0;
    } 

    if (!ptr.isDown && !ptr.justUp) {
      this.distance = 0;
    }
  }
}