import { getNormalizedArgument, IArgument, INormalizedArgument } from './argument';

describe('getNormalizedArgument', () => {
  it('should return a normalized argument', () => {
    const argument: IArgument = {
      name: 'arg',
      description: 'description',
    };

    const normalized: INormalizedArgument = getNormalizedArgument(argument);

    expect(normalized.name).toStrictEqual(argument.name);
    expect(normalized.description).toStrictEqual(argument.description);
    expect(normalized.required).toStrictEqual(false);
  });
});
