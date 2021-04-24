import { INormalizedOption } from '../option';
import * as arg from 'arg';

/**
 * Builds arg.Spec for the given options
 *
 * @param options
 */
export function buildArgSpec(options: INormalizedOption[]): arg.Spec {
  const spec: arg.Spec = {};

  options.forEach((option) => {
    spec[option.name] = option.type;
    option.aliases.forEach((alias) => (spec[alias] = option.name));
  });

  spec['--help'] = Boolean;
  spec['-h'] = '--help';

  return spec;
}
