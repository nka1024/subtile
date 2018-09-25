
/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { ContextObjectPopup } from "../../windows/ContextObjectWindow";


export class ContextMenuModule {

  // Public
  public onReconClicked: (object: Phaser.GameObjects.Sprite) => void;
  
  // Private
  private contextWindow: ContextObjectPopup;
  private scene: Phaser.Scene;
  private groups: Array<Phaser.GameObjects.Group>;

  // flag used to destroy current context window when clicked outside of it
  private objectClickedInThisFrame: Boolean;

  constructor(scene: Phaser.Scene) {
    this.groups = [];
    this.scene = scene;
    this.scene.events.on('postupdate', (time, delta) => {
      this.objectClickedInThisFrame = false;
    });
  }


  // Public

  public update() {
    // close context window if clicked outside of it
    if (this.scene.input.activePointer.justDown && !this.objectClickedInThisFrame) {
      this.destroyContextWindow();
    }
  }

  public get isContextWindowActive(): boolean {
    return this.contextWindow != null;
  }

  public addObjectsGroup(group: Phaser.GameObjects.Group) {
    this.groups.push(group);

    group.createCallback = (item: Phaser.GameObjects.GameObject) => {
      this.trackClicks(item);
    };
    group.removeCallback = (item: Phaser.GameObjects.GameObject) => {
      this.untrackClicks(item);
    };
  }

  public removeObjectsGroup(group: Phaser.GameObjects.Group) {
    // remove listeners from all objects in group
    for (let object of group.children.entries) {
      this.untrackClicks(object);
    }
    // remove group from groups array
    this.groups = this.groups.filter((grp, idx, array) => {
      return grp != group;
    });
  }


  // Private

  private worldToScreen(p:{x: number, y:number}):{x: number, y: number} {
    let camera = this.scene.cameras.main;
    let x = (p.x - camera.midPoint.x) * camera.zoom;
    let y = (p.y - camera.midPoint.y) * camera.zoom;
    let halfW = camera.width / 2;
    let halfH = camera.height / 2;
    
    return {x: halfW + x, y: halfH + y};
  }

  private showContextWindowForObject(object: Phaser.GameObjects.Sprite) {
    this.destroyContextWindow();

    let p = this.worldToScreen({x: object.x, y: object.y});

    this.contextWindow = new ContextObjectPopup(p.x - ContextObjectPopup.defaultWidth / 2, p.y + 16);
    this.contextWindow.reconButton.addEventListener('click', () => {
      if (this.onReconClicked) {
        this.onReconClicked(object);
      }
    });
    this.contextWindow.onDestroy = (w) => {
      this.contextWindow = null
    };
    this.contextWindow.show();
  }

  private destroyContextWindow() {
    if (this.contextWindow != null) {
      this.contextWindow.show();
      this.contextWindow.destroy();
      this.contextWindow = null;
    }
  }

  private handleClick(object: Phaser.GameObjects.GameObject) {
    this.showContextWindowForObject(object as Phaser.GameObjects.Sprite);
    this.objectClickedInThisFrame = true;
  }

  private trackClicks(object: Phaser.GameObjects.GameObject) {
    object.on('pointerdown', () => {
      this.handleClick(object);
    })
  }

  private untrackClicks(object: Phaser.GameObjects.GameObject) {
    object.off('pointerdown', null, null, false);
  }

}