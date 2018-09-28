/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { ContextObjectPopup } from "../../windows/ContextObjectWindow";
import { GameobjectClicksModule } from "./GameobjectClicksModule";
import { TargetListPanel } from "../../windows/TargetsListPanel";
import { BaseUnit } from "../../actors/BaseUnit";

export class ContextMenuModule {

  // Public
  public onReconClicked: (object: Phaser.GameObjects.Sprite) => void;
  
  // Private
  private contextWindow: ContextObjectPopup;
  
  // Dependencies 
  private scene: Phaser.Scene;
  private targetList: TargetListPanel;
  private clicksTracker: GameobjectClicksModule;

  // flag used to destroy current context window when clicked outside of it
  private objectClickedInThisFrame: Boolean;

  constructor(scene: Phaser.Scene, clicksTracker: GameobjectClicksModule) {
    this.scene = scene;
    this.clicksTracker = clicksTracker;
    this.clicksTracker.on('click', (object: BaseUnit) => {
      this.handleClick(object);
    });
    this.scene.events.on('postupdate', (time, delta) => {
      this.objectClickedInThisFrame = false;
    });
  }


  // Public

  public injectDependencies(targetList: TargetListPanel) {
    this.targetList = targetList;
  }

  public update() {
    // close context window if clicked outside of it
    if (this.scene.input.activePointer.justDown && !this.objectClickedInThisFrame) {
      this.destroyContextWindow();
    }
  }

  public get isContextWindowActive(): boolean {
    return this.contextWindow != null;
  }

  // Private

  private handleClick(object: BaseUnit) {
    if (!this.targetList.isTargeted(object)) {
      this.showContextWindowForObject(object);
    }
    this.objectClickedInThisFrame = true;
  }

  private worldToScreen(p:{x: number, y:number}):{x: number, y: number} {
    let camera = this.scene.cameras.main;
    let x = (p.x - camera.midPoint.x) * camera.zoom;
    let y = (p.y - camera.midPoint.y) * camera.zoom;
    let halfW = camera.width / 2;
    let halfH = camera.height / 2;
    
    return {x: halfW + x, y: halfH + y};
  }

  private showContextWindowForObject(object: BaseUnit) {
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

}