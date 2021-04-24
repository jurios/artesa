import { Handler } from 'arg';

export interface IOption {
  name: string;
  description: string;
  aliases?: string[];
  type?: string | Handler | [Handler];
  required?: boolean;
}

export interface INormalizedOption {
  name: string;
  description: string;
  aliases: string[];
  type: string | Handler | [Handler];
  required: boolean;
}

/**
 * Returns an option with optional attributes filled with default values
 *
 * @param option
 */
export function getNormalizedOption(option: IOption): INormalizedOption {
  return {
    name: option.name,
    description: option.description,
    aliases: option.aliases ?? [],
    type: option.type ?? String,
    required: option.required ?? false,
  };
}
