/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { ContextMenuWindow } from "../../windows/ContextMenuWindow";
import { GameobjectClicksModule } from "./GameobjectClicksModule";
import { TargetListPanel } from "../../windows/TargetsListPanel";
import { BaseUnit } from "../../actors/BaseUnit";
import { Point } from "../../types/Position";

export class ContextMenuModule {

  // Public
  public onReconClicked: (object: BaseUnit) => void;
  public onReturnClicked: (object: BaseUnit) => void;
  public onMoveClicked: (object: BaseUnit) => void;

  // Private
  private contextWindow: ContextMenuWindow;

  // Dependencies 
  private scene: Phaser.Scene;
  private targetList: TargetListPanel;
  private clicksTracker: GameobjectClicksModule;

  constructor(scene: Phaser.Scene, clicksTracker: GameobjectClicksModule) {
    this.scene = scene;
    this.clicksTracker = clicksTracker;
    this.clicksTracker.on('click', (object: BaseUnit) => {
      this.handleClick(object);
    });
  }


  // Public

  public injectDependencies(targetList: TargetListPanel) {
    this.targetList = targetList;
  }

  public update() {
    // close context window if clicked outside of it
    if (this.scene.input.activePointer.justDown && !this.clicksTracker.objectClickedInThisFrame) {
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
  }

  private worldToScreen(p: Point): Point {
    let camera = this.scene.cameras.main;
    let x = (p.x - camera.midPoint.x) * camera.zoom;
    let y = (p.y - camera.midPoint.y) * camera.zoom;
    let halfW = camera.width / 2;
    let halfH = camera.height / 2;

    return { x: halfW + x, y: halfH + y };
  }

  private showContextWindowForObject(object: BaseUnit) {
    this.destroyContextWindow();

    if (object.conf.id.indexOf('type') != -1) {
      this.contextWindow = this.makeHeroSquadWindow(object);
    } else {
      this.contextWindow = this.makeEnemySquadWindow(object);
    }
    this.contextWindow.onDestroy = (w) => {
      this.contextWindow = null
    };
    this.contextWindow.show();
  }

  private makeHeroSquadWindow(object: BaseUnit): ContextMenuWindow {
    let p = this.worldToScreen(object);
    let buttons = ["Move", "Return"];
    let window = new ContextMenuWindow(p.x - ContextMenuWindow.defaultWidth / 2, p.y + 16, buttons);
    window.buttons[0].addEventListener('click', () => {
      this.onMoveClicked(object);
    });
    window.buttons[1].addEventListener('click', () => {
      this.onReturnClicked(object);
    });
    return window
  }

  private makeEnemySquadWindow(object: BaseUnit): ContextMenuWindow {
    let buttons = ["Scout"];
    let p = this.worldToScreen(object);
    let window = new ContextMenuWindow(p.x - ContextMenuWindow.defaultWidth / 2, p.y + 16, buttons);
    window.buttons[0].addEventListener('click', () => {
      if (this.onReconClicked) {
        this.onReconClicked(object);
      }
    });
    return window;
  }

  private destroyContextWindow() {
    if (this.contextWindow != null) {
      this.contextWindow.show();
      this.contextWindow.destroy();
      this.contextWindow = null;
    }
  }

}