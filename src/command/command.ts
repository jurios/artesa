import { IInputOutput } from '../io/input-output.interface';
import { ArgumentBag, OptionBag } from './input/bag/bag';
import { InputParser } from './input/input-parser';
import { getNormalizedOption, INormalizedOption, IOption } from './input/option';
import { getNormalizedArgument, IArgument, INormalizedArgument } from './input/argument';
import { NormalizedArgumentsValidator } from './validators/normalized-arguments.validator';
import { NormalizedOptionsValidator } from './validators/normalized-options.validator';
import { Paragraph, transformToColumnedLayout } from '../io/helpers/layout';
import * as chalk from 'chalk';
import { CLIException } from '../exceptions/cli.exception';

export type CommandClass = new (io: IInputOutput) => Command;

export abstract class Command {
  protected readonly optionDefs: INormalizedOption[];
  protected readonly argumentDefs: INormalizedArgument[];

  constructor(protected readonly io: IInputOutput) {
    this.optionDefs = this.getNormalizedOptions();
    this.argumentDefs = this.getNormalizedArguments();
    this.validate();
  }

  /**
   * Execute the command with the provided route name and input
   *
   * @param route
   * @param argv
   */
  public async run(route: string, argv: string[]): Promise<number> {
    try {
      const [argumentBag, optionBag] = this.parse(argv);

      if (optionBag.has('--help')) {
        this.help(route);
        return 0;
      }

      return await this.handle(argumentBag, optionBag);
    } catch (e) {
      return this.handleRuntimeError(route, e);
    }
  }

  /**
   * Validates command option definitions and argument definitions. If it is not valid,
   * a CommandValidationException is thrown
   */
  public validate(): void {
    NormalizedArgumentsValidator.validate(this.argumentDefs);
    NormalizedOptionsValidator.validate(this.optionDefs);
  }

  /**
   * Returns command option list
   * @protected
   */
  public getOptions(): IOption[] {
    return [];
  }

  /**
   * Returns command argument list
   * @protected
   */
  public getArguments(): IArgument[] {
    return [];
  }

  /**
   * Returns command description
   */
  public getDescription(): string {
    return '';
  }

  /**
   * Command work
   *
   * @param args
   * @param options
   */
  protected abstract handle(args: ArgumentBag, options: OptionBag): Promise<number>;

  protected handleRuntimeError(route: string, err: Error): number {
    this.io.space();
    this.io.error(`Error: ${err.message}`);
    this.io.space();

    // When the exception is because command has not been called correctly,
    // help must be showed
    if (err instanceof CLIException && err.printHelp) {
      this.help(route);
      return 1;
    }

    // If the error is unknown or unexpected, show stack
    this.io.errLn(err.stack);
    return 1;
  }

  /**
   * Parse input arguments based on arguments and options expected
   *
   * @param argv
   * @protected
   */
  protected parse(argv: string[]): [ArgumentBag, OptionBag] {
    return InputParser.parse(argv, this.argumentDefs, this.optionDefs);
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

  protected printHelpSignature(route: string): void {
    this.io.write(`${route}`, { bold: true, color: [217, 119, 6] });
    this.io.writeLn(`: ${this.getDescription()}`);
    this.io.writeLn(`${' '.repeat(2)}${chalk.bold(`Usage:`)} ${this.getSignature(route)}`);
    this.io.space();
  }

  /**
   * Print out command help
   *
   * @param route
   * @protected
   */
  protected help(route: string): void {
    this.printHelpSignature(route);
    if (this.argumentDefs.length > 0) {
      this.io.writeLn(`${' '.repeat(2)}Command arguments:`);
      const paragraph: Paragraph = transformToColumnedLayout(
        this.argumentDefs.map((arg) => [
          arg.name + (arg.required ? chalk.red('*') : ''),
          arg.description,
        ]),
      );
      paragraph.forEach((line) => {
        this.io.write(' '.repeat(4) + line[0], { bold: true });
        this.io.writeLn(' '.repeat(4) + line[1], { bold: false });
      });
      this.io.space();
    }

    if (this.optionDefs.length > 0) {
      this.io.writeLn(`${' '.repeat(2)}Available options:`);

      const paragraph: Paragraph = transformToColumnedLayout(
        this.optionDefs.map((opt) => [[opt.name].concat(opt.aliases).join(','), opt.description]),
      );

      paragraph.forEach((line) => {
        this.io.write(' '.repeat(4) + line[0], { bold: true });
        this.io.writeLn(' '.repeat(4) + line[1], { bold: false });
      });

      this.io.space();
      this.io.writeLn(chalk.red('*') + ': Required argument');
    }
  }

  /**
   * Generate command signature
   *
   * @param route
   * @protected
   */
  protected getSignature(route: string): string {
    return `${route} ${this.argumentDefs.map((arg) => `[${arg.name}]`).join('')}${
      this.optionDefs.length > 0 ? ' [options...]' : ''
    }`;
  }
}
