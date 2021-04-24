import { Paragraph, transformToColumnedLayout } from './layout';

describe('transformToColumnedLayout', () => {
  let paragraph: Paragraph;

  it('should pad the columns to the max column length', () => {
    paragraph = [
      ['----', '----------'],
      ['-----', '----'],
    ];

    const result: Paragraph = transformToColumnedLayout(paragraph, 1);

    expect(result[0]).toStrictEqual(['----  ', '---------- ']);
    expect(result[1]).toStrictEqual(['----- ', '----       ']);
  });

  it('should handle lines with different number of columns', () => {
    paragraph = [
      ['----', '--', '----------'],
      ['--', '-'],
      ['-----', '---', '----'],
    ];

    const result: Paragraph = transformToColumnedLayout(paragraph, 1);

    expect(result[0]).toStrictEqual(['----  ', '--  ', '---------- ']);
    expect(result[1]).toStrictEqual(['--    ', '-   ']);
    expect(result[2]).toStrictEqual(['----- ', '--- ', '----       ']);
  });

  it('should handle null or undefined as empty columns', () => {
    paragraph = [
      ['----', '--', null],
      ['--', '-', undefined],
      ['-----', '---', '----'],
    ];

    const result: Paragraph = transformToColumnedLayout(paragraph, 1);

    expect(result[0]).toStrictEqual(['----  ', '--  ', '     ']);
    expect(result[1]).toStrictEqual(['--    ', '-   ', '     ']);
    expect(result[2]).toStrictEqual(['----- ', '--- ', '---- ']);
  });
});
