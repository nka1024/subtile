/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { OkPopup } from "../windows/OkPopup";
import { NewmapWindow } from "../windows/NewmapWindow";
import { MenuWindow } from "../windows/MenuWindow";
import { ObjectsListWindow } from "../windows/ObjectsListWindow";
import { ExportWindow } from "../windows/ExportWindow";

export class WindowManager {

  public static initialize() {
    OkPopup.initialize();
    NewmapWindow.initialize();
    MenuWindow.initialize();
    ObjectsListWindow.initialize();
    ExportWindow.initialize();
  }
}