/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { OkPopup } from "../windows/OkPopup";
import { MenuPanel } from "./MenuPanel";
import { ObjectsListPanel } from "./ObjectsListPanel";
import { ExportWindow } from "../windows/ExportWindow";
import { ToolsPanel } from "./ToolsPanel";
import { UnitsPanel } from "./UnitsPanel";
import { ContextMenuWindow } from "./ContextMenuWindow";
import { ZoomPanel } from "./ZoomPanel";
import { TargetListPanel } from "./TargetsListPanel";

export class WindowManager {

  public static initialize() {
    OkPopup.initialize();
    MenuPanel.initialize();
    ObjectsListPanel.initialize();
    ExportWindow.initialize();
    ToolsPanel.initialize();
    try {
      UnitsPanel.initialize();
      ContextMenuWindow.initialize();
      ZoomPanel.initialize();
      TargetListPanel.initialize();
    } catch (e) {
      console.log('missing window')
    }
  }
}