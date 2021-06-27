import { Routes } from '../../router/routes';
import { CommandClass } from '../../command/command';
import { InputOutput } from '../input-output';

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

  return rows.map((row) => {
    return row.map((column, index) => {
      return (
        (typeof column === 'string' ? column : '').padEnd(lengths[index]) + ' '.repeat(spaceBetween)
      );
    });
  });
}

/**
 * Generates a text-based "graphical" tree based on routes provided.
 *
 * @param routes
 * @param ident
 */
export function buildCLIRoutesTree(routes: Routes, ident = 2): Grid {
  function parseCommandHelp(level: number, routes: Routes, result: Row[]): Row[] {
    Object.keys(routes).forEach((route: string) => {
      if (typeof routes[route] === 'function') {
        result.push([
          ' '.repeat(ident * level) + (level > 0 ? '└ ' : '') + route,
          new (routes[route] as CommandClass)(new InputOutput()).getDescription(),
        ]);
      } else {
        result.push([' '.repeat(ident * level) + route, '']);
        parseCommandHelp(level + 1, routes[route] as Routes, result);
      }
    });

    return result;
  }

  const result: Row[] = [];

  parseCommandHelp(0, routes, result);

  return buildGrid(result);
}
