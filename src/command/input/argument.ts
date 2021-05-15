export type ArgumentType = StringConstructor | NumberConstructor | BooleanConstructor;

export interface IArgument {
  name: string;
  description: string;
  required?: boolean;
  type?: ArgumentType;
}

export interface INormalizedArgument {
  name: string;
  description: string;
  required: boolean;
  type: ArgumentType;
}

/**
 * Returns an argument with optional attributes filled with default values
 *
 * @param argument
 */
export function getNormalizedArgument(argument: IArgument): INormalizedArgument {
  return {
    name: argument.name,
    description: argument.description,
    required: argument.required ?? false,
    type: argument.type ?? String,
  };
}
