import { CommandValidationException } from '../../exceptions/command-validation.exception';
import { INormalizedOption } from '../option';

export class NormalizedOptionsValidator {
  static validate(optsDef: INormalizedOption[]): void {
    this.validateNameUniqueness(optsDef);
    this.validateHyphen(optsDef);
  }

  /**
   * Validates option name and aliases are used once for the same command
   *
   * @param optsDef
   * @protected
   */
  protected static validateNameUniqueness(optsDef: INormalizedOption[]): void {
    const names: { [name: string]: boolean } = {};

    optsDef.forEach((opt) => {
      if (Object.prototype.hasOwnProperty.call(names, opt.name)) {
        throw new CommandValidationException(`Option "${opt.name}" cannot be defined twice"`);
      }
      names[opt.name] = true;

      opt.aliases.forEach((alias) => {
        if (Object.prototype.hasOwnProperty.call(names, alias)) {
          throw new CommandValidationException(`Option "${alias} cannot be defined twice"`);
        }
        names[alias] = true;
      });
    });
  }

  /**
   * Validates option name and aliases
   *
   * @param optsDef
   * @protected
   */
  protected static validateHyphen(optsDef: INormalizedOption[]): void {
    optsDef.forEach((opt) => {
      this.validateOptionName(opt.name);

      opt.aliases.forEach((alias) => {
        this.validateOptionName(alias);
      });
    });
  }

  /**
   * Validates option name (or alias) is using hyphens correctly
   *
   * @param optionName
   * @protected
   */
  protected static validateOptionName(optionName: string): void {
    if (optionName.startsWith('--')) {
      return;
    }

    if (optionName.startsWith('-')) {
      if (optionName.replace(/^-/, '').length > 1) {
        throw new CommandValidationException(
          `Option "${optionName}" (with only one "-") must have only one character`,
        );
      }

      return;
    }

    throw new CommandValidationException(`Option "${optionName}" must start with '-' or '--'`);
  }
}
