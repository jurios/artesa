import { INormalizedArgument } from '../input/argument';
import { CommandValidationException } from '../../exceptions/command-validation.exception';

export class NormalizedArgumentsValidator {
  static validate(argDefs: INormalizedArgument[]): void {
    this.validateRequiredPositions(argDefs);
    this.validateNameUniqueness(argDefs);
  }

  /**
   * Validates optionals arguments are located after required arguments
   *
   * @param argDefs
   * @protected
   */
  protected static validateRequiredPositions(argDefs: INormalizedArgument[]): void {
    let optionals = false;

    argDefs.forEach((arg) => {
      if (optionals && arg.required === true) {
        throw new CommandValidationException(
          `Required argument "${arg.name}" cannot follow an optional.`,
        );
      }
      optionals = !arg.required;
    });
  }

  /**
   * Validates argument name is not defined twice for the same command
   *
   * @param argDefs
   * @protected
   */
  protected static validateNameUniqueness(argDefs: INormalizedArgument[]): void {
    const names: { [name: string]: boolean } = {};

    argDefs.forEach((arg) => {
      if (Object.prototype.hasOwnProperty.call(names, arg.name)) {
        throw new CommandValidationException(`Argument "${arg.name}" cannot be defined twice"`);
      }
      names[arg.name] = true;
    });
  }
}
