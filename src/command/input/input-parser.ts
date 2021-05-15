import { ArgumentType, INormalizedArgument } from './argument';
import { INormalizedOption } from './option';
import * as arg from 'arg';
import { buildArgSpec } from './utils/arg-spec-builder';
import { ArgError } from 'arg';
import { InputArgumentException } from '../../exceptions/input-argument.exception';
import { ArgumentBag, OptionBag } from './bag/bag';

export class InputParser {
  public readonly arguments: ArgumentBag;
  public readonly options: OptionBag;

  constructor(input: string[], argDefs: INormalizedArgument[], optDefs: INormalizedOption[]) {
    try {
      const result: arg.Result<arg.Spec> = arg(buildArgSpec(optDefs), { argv: input });
      this.arguments = new ArgumentBag(this.buildArguments(result, argDefs));
      this.options = new OptionBag(this.buildOptions(result, optDefs));
    } catch (e) {
      if (
        e instanceof ArgError &&
        (e.code === 'ARG_UNKNOWN_OPTION' ||
          e.code === 'ARG_MISSING_REQUIRED_SHORTARG' ||
          e.code === 'ARG_MISSING_REQUIRED_LONGARG')
      ) {
        throw new InputArgumentException(e.message);
      }

      throw e;
    }
  }

  protected buildArguments(
    input: arg.Result<arg.Spec>,
    defs: INormalizedArgument[],
  ): Record<string, unknown> {
    const results: Record<string, unknown> = {};

    defs.forEach((def, index) => {
      if (def.required && input._[index] === undefined) {
        throw new InputArgumentException(`Missing required "${def.name}" argument`);
      }

      try {
        //Notice some argument might be optional thus value is not available.
        // Only cast data when value is available
        results[def.name] = input._[index]
          ? this.castData(input._[index], def.type)
          : input._[index];
      } catch (e) {
        if (e instanceof InputArgumentException) {
          throw new InputArgumentException(`Argument "${def.name}" failed: ${e.message}`);
        }

        throw e;
      }
    });

    return results;
  }

  protected buildOptions(
    input: arg.Result<arg.Spec>,
    defs: INormalizedOption[],
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    // Casting is not necessary here because is done by args.
    defs.forEach((arg) => {
      result[arg.name] = input[arg.name];
      arg.aliases?.forEach((alias) => {
        result[alias] = input[arg.name];
      });
    });

    return result;
  }

  /**
   * Cast a data to a data type. Throws an exception when is not able to apply the cast
   *
   * @param data
   * @param to
   * @protected
   */
  protected castData(data: string, to: ArgumentType): unknown {
    if (to === Number) {
      //Cast to int or float depending on data contains decimals
      const value: number = new RegExp(/\./).test(data) ? parseFloat(data) : parseInt(data);

      if (isNaN(value)) {
        throw new InputArgumentException(`argument is not a valid number`);
      }

      return value;
    }

    if (to === Boolean) {
      if (data === 'true' || data === '1') {
        return true;
      }

      if (data === 'false' || data === '0') {
        return false;
      }

      throw new InputArgumentException(`argument is not a valid boolean`);
    }

    return data;
  }

  /**
   * Parse command input arguments and options and returns bags
   *
   * @param input
   * @param argDefs
   * @param optDefs
   */
  static parse(
    input: string[],
    argDefs: INormalizedArgument[],
    optDefs: INormalizedOption[],
  ): [ArgumentBag, OptionBag] {
    const parser: InputParser = new this(input, argDefs, optDefs);

    return [parser.arguments, parser.options];
  }
}
