import { buildGrid, Grid } from './layout';

describe('transformToColumnedLayout', () => {
  let grid: Grid;

  it('should pad the columns to the max column length', () => {
    grid = [
      ['----', '----------'],
      ['-----', '----'],
    ];

    const result: Grid = buildGrid(grid, 1);

    expect(result[0]).toStrictEqual(['----  ', '---------- ']);
    expect(result[1]).toStrictEqual(['----- ', '----       ']);
  });

  it('should handle lines with different number of columns', () => {
    grid = [
      ['----', '--', '----------'],
      ['--', '-'],
      ['-----', '---', '----'],
    ];

    const result: Grid = buildGrid(grid, 1);

    expect(result[0]).toStrictEqual(['----  ', '--  ', '---------- ']);
    expect(result[1]).toStrictEqual(['--    ', '-   ']);
    expect(result[2]).toStrictEqual(['----- ', '--- ', '----       ']);
  });

  it('should handle null or undefined as empty columns', () => {
    grid = [
      ['----', '--', null],
      ['--', '-', undefined],
      ['-----', '---', '----'],
    ];

    const result: Grid = buildGrid(grid, 1);

    expect(result[0]).toStrictEqual(['----  ', '--  ', '     ']);
    expect(result[1]).toStrictEqual(['--    ', '-   ', '     ']);
    expect(result[2]).toStrictEqual(['----- ', '--- ', '---- ']);
  });
});
