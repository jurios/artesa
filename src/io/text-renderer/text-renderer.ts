import * as chalk from 'chalk';
import { Color, getRGBColor, RGBColor } from '../colors';
import { bindEmojis } from './emojis';

export type TextStyle = {
  color: Color;
  backgroundColor: Color;
  bold: boolean;
  dim: boolean;
  italic: boolean;
  underline: boolean;
};

export const defaultTextStyle: TextStyle = {
  color: null,
  backgroundColor: null,
  bold: false,
  dim: false,
  italic: false,
  underline: false,
};

/**
 * Returns a chalk instance configured based on the text style provided
 *
 * @param style
 * @protected
 */
function getWriter(style: TextStyle): chalk.Chalk {
  let writer: chalk.Chalk = chalk;

  if (style.bold) {
    writer = writer.bold;
  }

  if (style.underline) {
    writer = writer.underline;
  }

  if (style.italic) {
    writer = writer.italic;
  }

  if (style.dim) {
    writer = writer.dim;
  }

  if (style.backgroundColor) {
    const backgroundColor: RGBColor = getRGBColor(style.backgroundColor);
    writer = writer.bgRgb(backgroundColor[0], backgroundColor[1], backgroundColor[2]);
  }

  if (style.color) {
    const color: RGBColor = getRGBColor(style.color);
    writer = writer.rgb(color[0], color[1], color[2]);
  }

  return writer;
}

/**
 * Apply styles and bind emojis to the message
 *
 * @param text
 * @param style
 */
export function renderText(text: string, style?: Partial<TextStyle>): string {
  style = Object.assign({}, defaultTextStyle, style ?? {});
  return getWriter(style as TextStyle)(bindEmojis(text));
}
