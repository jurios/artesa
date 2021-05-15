import { getNormalizedOption, INormalizedOption, IOption } from './input/option';
import { getNormalizedArgument, IArgument, INormalizedArgument } from './input/argument';
import { IInputOutput } from '../io/input-output.interface';
import * as chalk from 'chalk';
import { Paragraph, transformToColumnedLayout } from '../io/helpers/layout';
import { InputParser } from './input/input-parser';
import { CommandException } from '../exceptions/command.exception';
import { CLIException } from '../exceptions/cli.exception';
import { NormalizedArgumentsValidator } from './validators/normalized-arguments.validator';
import { CommandValidationException } from '../exceptions/command-validation.exception';
import { NormalizedOptionsValidator } from './validators/normalized-options.validator';
import { ArgumentBag, OptionBag } from './input/bag/bag';

export type CommandClass = new (io: IInputOutput) => Command;

export abstract class Command {
  abstract name: string;
  abstract description: string;

  protected readonly optionDefs: INormalizedOption[];
  protected readonly argumentDefs: INormalizedArgument[];

  constructor(protected readonly io: IInputOutput) {
    this.argumentDefs = this.getNormalizedArguments();
    this.optionDefs = this.getNormalizedOptions();
  }

  /**
   * Parse input and executes the command
   *
   * @param argv
   */
  public async parse(argv: string[]): Promise<number> {
    try {
      const [argumentBag, optionBag] = InputParser.parse(argv, this.argumentDefs, this.optionDefs);

      if (optionBag.has('--help')) {
        this.help();
        return 0;
      }

      return await this.handle(argumentBag, optionBag);
    } catch (e) {
      //If it is a CLIException but is not a CommandException,
      // then must be handled by the CLI
      if (e instanceof CLIException && !(e instanceof CommandException)) {
        throw e;
      }

      this.io.space();
      this.io.error(`Error: ${e.message}`);
      this.io.space();

      // When the exception is because command has not been called correctly,
      // help must be showed
      if (e instanceof CommandException && e.printHelp) {
        this.help();
        return 1;
      }

      // If the error is unknown or unexpected, show stack
      this.io.errLn(e.stack);
      return 1;
    }
  }

  /**
   * Execute command
   *
   * @param args
   * @param options
   */
  abstract handle(args: ArgumentBag, options: OptionBag): Promise<number>;

  /**
   * Returns command option list
   * @protected
   */
  public getOptions(): IOption[] {
    return [];
  }

  /**
   * returns command argument list
   * @protected
   */
  public getArguments(): IArgument[] {
    return [];
  }

  /**
   * Validates command option definitions and argument definitions. If it is not valid,
   * a CommandValidationException is thrown
   */
  public validate(): void {
    try {
      NormalizedArgumentsValidator.validate(this.argumentDefs);
      NormalizedOptionsValidator.validate(this.optionDefs);
    } catch (e) {
      if (e instanceof CommandValidationException) {
        throw new CommandValidationException(`${this.name}: ${e.message}`);
      }
    }
  }

  /**
   * Generates normalized option definitions from getOptions().
   * It concatenates --help option in order to show command help.
   *
   * @private
   */
  protected getNormalizedOptions(): INormalizedOption[] {
    return this.getOptions()
      .concat([
        {
          name: '--help',
          description: 'Show command help',
          aliases: ['-h'],
        },
      ])
      .map((option) => getNormalizedOption(option));
  }

  /**
   * Generates normalized argument definitions from getArguments().
   *
   * @protected
   */
  protected getNormalizedArguments(): INormalizedArgument[] {
    return this.getArguments().map((arg) => getNormalizedArgument(arg));
  }

  protected help(): void {
    this.io.write(`${this.name}: `, { bold: true, color: [217, 119, 6] });
    this.io.writeLn(this.description);
    this.io.writeLn(`${chalk.bold(`Usage:`)} ${this.getSignature()}`);
    this.io.space();
    if (this.argumentDefs.length > 0) {
      this.io.writeLn('Command arguments:');
      const paragraph: Paragraph = transformToColumnedLayout(
        this.argumentDefs.map((arg) => [
          arg.name + (arg.required ? chalk.red('*') : ''),
          arg.description,
        ]),
      );
      paragraph.forEach((line) => {
        this.io.write(' '.repeat(2) + line[0], { bold: true });
        this.io.writeLn(' '.repeat(2) + line[1], { bold: false });
      });
      this.io.space();
    }

    if (this.optionDefs.length > 0) {
      this.io.writeLn('Available options:');

      const paragraph: Paragraph = transformToColumnedLayout(
        this.optionDefs.map((opt) => [[opt.name].concat(opt.aliases).join(','), opt.description]),
      );

      paragraph.forEach((line) => {
        this.io.write(' '.repeat(2) + line[0], { bold: true });
        this.io.writeLn(' '.repeat(2) + line[1], { bold: false });
      });

      this.io.space();
      this.io.writeLn(chalk.red('*') + ': Required argument');
    }
  }

  protected getSignature(): string {
    return `${this.name} ${this.argumentDefs.map((arg) => `[${arg.name}]`).join('')}${
      this.optionDefs.length > 0 ? ' [options...]' : ''
    }`;
  }
}
