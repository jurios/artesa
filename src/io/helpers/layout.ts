type Line = (string | null | undefined)[];
export type Paragraph = Line[];

/**
 * Returns the column lengths for each paragraph column
 *
 * @param paragraph
 * @protected
 */
function getParagraphLineColumnLengths(paragraph: Paragraph): number[] {
  const lengths: number[] = [];

  paragraph.forEach((line) => {
    line.forEach((column, index) => {
      const length: number = typeof column === 'string' ? column.length : 0;

      lengths[index] = !lengths[index] || lengths[index] < length ? length : lengths[index];
    });
  });

  return lengths;
}

/**
 * Transforms a paragraph to fit a multi column layout.
 *
 * @param paragraph
 * @param spaceBetween Extra space between columns
 */
export function transformToColumnedLayout(paragraph: Paragraph, spaceBetween = 8): Paragraph {
  const lengths: number[] = getParagraphLineColumnLengths(paragraph);

  return paragraph.map((line) => {
    return line.map((column, index) => {
      return (
        (typeof column === 'string' ? column : '').padEnd(lengths[index]) + ' '.repeat(spaceBetween)
      );
    });
  });
}
