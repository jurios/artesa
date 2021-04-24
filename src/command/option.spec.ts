import { getNormalizedOption, INormalizedOption, IOption } from './option';

describe('getNormalizedOption', () => {
  it('should return a normalized option', () => {
    const option: IOption = {
      name: 'option',
      description: 'description',
    };

    const normalized: INormalizedOption = getNormalizedOption(option);

    expect(normalized.aliases).toStrictEqual([]);
    expect(normalized.type).toStrictEqual(String);
    expect(normalized.required).toStrictEqual(false);
  });
});
