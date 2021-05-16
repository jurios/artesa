import { Command, CommandClass } from './command/command';
import * as arg from 'arg';
import { CommandNotFoundException } from './exceptions/command-not-found.exception';
import { IInputOutput } from './io/input-output.interface';
import { InputOutput } from './io/input-output';
import * as chalk from 'chalk';
import { Paragraph, transformToColumnedLayout } from './io/helpers/layout';
import { CLIException } from './exceptions/cli.exception';
import { CommandValidationException } from './exceptions/command-validation.exception';

type Routes = { [name: string]: CommandClass };

export class CLI {
  protected _commandInstances: Map<CommandClass, Command>;

  constructor(
    public readonly routes: Routes,
    protected readonly io: IInputOutput = new InputOutput(),
  ) {
    this._commandInstances = this.getCommandInstances();
  }

  /**
   * Parse input arguments
   *
   * @param argv
   */
  public async parse(argv: string[]): Promise<number> {
    try {
      const args = arg(this.cliArgSpec(), { stopAtPositional: true, argv });

      if (args._.length === 0) {
        this.help();
        return 0;
      }

      const commandName: string = args._.shift();
      return await this.callCommand(commandName, args._);
    } catch (e) {
      this.io.space();
      this.io.error(`Error: ${e.message}`);
      this.io.space();

      if (e instanceof CLIException && e.printHelp) {
        this.help();
        return 1;
      }

      this.io.errLn(e.stack);
      return 1;
    } finally {
      this.io.close();
    }
  }

  protected getCommandInstances(): Map<CommandClass, Command> {
    const result: Map<CommandClass, Command> = new Map<CommandClass, Command>();

    Object.keys(this.routes).forEach((route) => {
      const commandClass = this.routes[route];
      if (!result.has(commandClass)) {
        const instance: Command = new commandClass(this.io);

        try {
          instance.validate();
        } catch (e) {
          if (e instanceof CommandValidationException) {
            throw new CommandValidationException(`${commandClass.name}: ${e.message}`);
          }
        }

        result.set(commandClass, new commandClass(this.io));
      }
    });

    return result;
  }

  /**
   * Call a command registered by its name. If it does not exist, it throws an exception
   *
   * @param commandName
   * @param argv
   * @throws CommandNotFoundException
   * @protected
   */
  protected async callCommand(commandName: string, argv: string[]): Promise<number> {
    if (this.routes[commandName] && this._commandInstances.has(this.routes[commandName])) {
      return this._commandInstances.get(this.routes[commandName]).parse(commandName, argv);
    }

    throw new CommandNotFoundException(commandName);
  }

  /**
   * Print out CLI help
   *
   * @protected
   */
  public help(): void {
    this.io.writeLn('CLI Help', { bold: true, color: [255, 255, 255] });
    this.io.writeLn('--------', { bold: true, color: [255, 255, 255] });

    if (Object.keys(this.routes).length === 0) {
      this.io.writeLn('Commands not available.');
      return;
    }

    this.io.writeLn(`${chalk.bold(`Usage:`)} command [...args] [...options]`);
    this.io.space();

    this.io.writeLn('Available commands:');
    const paragraph: Paragraph = transformToColumnedLayout(
      Object.keys(this.routes).map((commandName) => [
        commandName,
        new this.routes[commandName](this.io).getDescription(),
      ]),
    );

    paragraph.forEach((line) => {
      this.io.write(line[0], { bold: true, color: [217, 119, 6] });
      this.io.write(line[1], { bold: false, color: [5, 150, 105] });
    });

    this.io.space(2);
    this.io.writeLn(
      `(!) Tip: Run command with "--help" or "-h" option to show specific command help.`,
    );
  }

  /**
   * Generate input arguments spec for the CLI.
   *
   * @protected
   */
  protected cliArgSpec(): arg.Spec {
    return {
      '--help': Boolean,
      '-h': '--help',
    };
  }
}
