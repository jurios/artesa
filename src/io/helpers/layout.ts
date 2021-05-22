import { CommandHelpTree } from '../generate-command-help-tree';

export type Cell = string | null | undefined;
export type Row = Cell[];
export type Grid = Row[];

/**
 * Returns the column lengths for each paragraph column
 *
 * @protected
 * @param rows
 */
function getCellLengths(rows: Row[]): number[] {
  const lengths: number[] = [];

  rows.forEach((column) => {
    column.forEach((column, index) => {
      const length: number = typeof column === 'string' ? column.length : 0;

      lengths[index] = !lengths[index] || lengths[index] < length ? length : lengths[index];
    });
  });

  return lengths;
}

/**
 * Transforms a paragraph to fit a multi column layout.
 *
 * @param rows
 * @param spaceBetween Extra space between columns
 */
export function buildGrid(rows: Row[], spaceBetween = 8): Grid {
  const lengths: number[] = getCellLengths(rows);

  return rows.map((line) => {
    return line.map((column, index) => {
      return (
        (typeof column === 'string' ? column : '').padEnd(lengths[index]) + ' '.repeat(spaceBetween)
      );
    });
  });
}

/**
 * Generates a "graphical" tree based on the commands and subcommands from the tree.
 *
 * @param help
 */
export function buildCommandHelpTreeGrid(help: CommandHelpTree, ident = 2): Grid {
  function parseCommandHelp(level: number, help: CommandHelpTree, result: Row[]): Row[] {
    Object.keys(help).forEach((route: string) => {
      if (typeof help[route] === 'string') {
        result.push([
          ' '.repeat(ident * level) + (level > 0 ? '└ ' : '') + route,
          help[route] as string,
        ]);
      } else {
        result.push([' '.repeat(ident * level) + route, '']);
        parseCommandHelp(level + 1, help[route] as CommandHelpTree, result);
      }
    });

    return result;
  }

  const result: Row[] = [];

  parseCommandHelp(0, help, result);

  return buildGrid(result);
}
