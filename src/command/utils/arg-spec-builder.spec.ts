import { buildArgSpec } from './arg-spec-builder';
import * as arg from 'arg';

describe('buildArgSpec', () => {
  it('should attach --help and -h', () => {
    expect(buildArgSpec([])).toHaveProperty('--help');
    expect(buildArgSpec([])).toHaveProperty('-h');
  });

  it('should attach an option and its type', () => {
    expect(
      buildArgSpec([
        {
          name: '--verbose',
          description: '',
          type: Boolean,
          aliases: [],
          required: false,
        },
      ])['--verbose'],
    ).toBe(Boolean);
  });

  it('should attach its aliases if option has aliases defined', () => {
    const spec: arg.Spec = buildArgSpec([
      {
        name: '--verbose',
        description: '',
        type: String,
        aliases: ['-v', '-verb'],
        required: false,
      },
    ]);

    expect(spec['-v']).toStrictEqual('--verbose');
    expect(spec['-verb']).toStrictEqual('--verbose');
  });
});
