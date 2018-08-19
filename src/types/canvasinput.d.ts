interface ICanvasInputParams
{
  canvas?: HTMLCanvasElement // Object (null by default) Specify a canvas element to draw the text box to (the off-DOM canvas can be accessed through a helper method if you want to leave this blank and handle it on your own).
  x?: number // number (0 by default) X-coordinate position on the canvas.
  y?: number // number (0 by default) Y-coordinate position on the canvas.
  extraX?: number // number (0 by default) This is an optional x-value for use when no canvas is passed into CanvasInput.
  extraY?: number // number (0 by default) This is an optional y-value for use when no canvas is passed into CanvasInput.
  fontSize?: number // number (14 by default) Text font size.
  fontFamily?: string // string (Arial by default) Text font family.
  fontColor?: string // string (#000 by default) Text color.
  placeHolderColor?: string // string (#bfbebd by default) Place holder text color.
  fontWeight?: string // string (normal by default) Font weight such as bold or normal.
  fontStyle?: string // string (normal by default) Font style such as italic or normal.
  fontShadowColor?: string // string ('' by default) Shadow color for both placeholder and value text.
  fontShadowBlur?: string // string (0 by default) Shadow blur for both placeholder and value text.
  fontShadowOffsetX?: string // string (0 by default) Shadow x-offset for both placeholder and value text.
  fontShadowOffsetY?: string // string (0 by default) Shadow y-offset for both placeholder and value text.
  readonly?: boolean // boolean (false by default) Set to true to disable user input.
  maxlength?: number // number (null by default) Sets the max length of characters.
  width?: number // number (150 by default) The width of the text box (just like in the DOM, padding, borders and shadows add onto this width).
  height?: number // number (14 by default) The height of the text box (just like in the DOM, padding, borders and shadows add onto this height).
  padding?: number // number (5 by default) The padding in pixels around all 4 sides of the text input area.
  borderWidth?: number // number (1 by default) Size of the border.
  borderColor?: string // string (#959595 by default) Color of the border.
  borderRadius?: number // number (3 by default) Create rounded corners by setting a border radius.
  backgroundImage?: string // string ('' by default) Use an image instead of styling for the background (it is usually best to set borderWidth to 0, backgroundColor to 'none' and the inner and box shadows to 'none' when using this).
  backgroundColor?: string // string (#fff by default) Sets the background color of the text box.
  backgroundGradient?: [string, string] // Array (['', ''] by default) Instead of a single background color, you can set a gradient of two colors.
  boxShadow?: string // string (1px 1px 0px rgba(255, 255, 255, 1) by default) Define a box shadow just as you would with CSS.
  innerShadow?: string // string (0px 0px 4px rgba(0, 0, 0, 0.4) by default) Define an inner-shadow just as you would with the box shadow.
  selectionColor?: string // string (rgba(179, 212, 253, 0.8) by default) The default color for the text selection highlight.
  placeHolder?: string // string ('' by default) The default place holder text. This text will disappear when the user focusses on the input.
  value?: string // string ('' by default) Set the default value for an input.
  onsubmit?: () => void // Function (function() {} by default) Callback fires when user hits the enter key.
  onkeydown?: () => void // Function (function() {} by default) Callback fires on key down.
  onkeyup?: () => void // Function (function() {} by default) Callback fires on key up.
  onfocus?: () => void // Function (function() {} by default) Callback fires on focus.
  onblur?: () => void // Function (function() {} by default) Callback fires on blur (un-focus).
}
declare class CanvasInput
{
  constructor(params: ICanvasInputParams)

  focus(pos?: number): void // Sets the focus on the input box (focus must already be on the canvas element).
  // Number (optional) Set the default character position for the cursor. Goes to the end by default.
  
  blur(): void // Removes the focus from the text input box.
  renderCanvas(): void // Returns the off-DOM canvas, allowing you to draw its contents to whatever canvas you would like (or do whatever else with the data that you want).
  render(): void // This rerenders the full input box.
  selectText(range?: [number, number]): void // Select part or all of the text in the input box programmatically.
  // Array (optional) Leave empty to select all text, or pass range values in this form: [start, end].

  destroy(): void // Destroy the input and stop rendering it.  
}