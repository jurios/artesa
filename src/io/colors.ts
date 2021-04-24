export type RGBColor = [number, number, number] | null;

export enum KeywordColor {
  Reset = 'reset',
  Black = 'black',
  White = 'white',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
  Info = 'info',
}

export type Color = RGBColor | KeywordColor;

/**
 * Returns whether value type is RGBColor
 *
 * @param value
 */
function isRGBColor(value: unknown): value is RGBColor {
  return (
    value &&
    Array.isArray(value) &&
    value.length === 3 &&
    typeof value[0] === 'number' &&
    typeof value[1] === 'number' &&
    typeof value[2] === 'number'
  );
}

/**
 * Returns whether value type is KeywordColor
 * @param value
 */
function isKeywordColor(value: unknown): value is KeywordColor {
  return Object.values(KeywordColor).includes(value as KeywordColor);
}

const KeywordColorToRGBColor: Map<KeywordColor, RGBColor> = new Map<KeywordColor, RGBColor>([
  [KeywordColor.Reset, null],
  [KeywordColor.Black, [0, 0, 0]],
  [KeywordColor.White, [255, 255, 255]],
  [KeywordColor.Success, [16, 185, 129]],
  [KeywordColor.Warning, [251, 191, 36]],
  [KeywordColor.Error, [248, 113, 113]],
  [KeywordColor.Info, [96, 165, 250]],
]);

/**
 * Returns the RGBColor from a Color
 * @param color
 */
export function getRGBColor(color: Color): RGBColor {
  if (isRGBColor(color)) {
    return color;
  }

  if (isKeywordColor(color) && KeywordColorToRGBColor.has(color)) {
    return KeywordColorToRGBColor.get(color);
  }

  throw new TypeError(`Unknown color: ${color}`);
}
