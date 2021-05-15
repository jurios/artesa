import { AbstractCommand, CommandClass } from './command/abstract-command';
import * as arg from 'arg';
import { CommandNotFoundException } from './exceptions/command-not-found.exception';
import { IInputOutput } from './io/input-output.interface';
import { InputOutput } from './io/input-output';
import * as chalk from 'chalk';
import { Paragraph, transformToColumnedLayout } from './io/helpers/layout';
import { CLIException } from './exceptions/cli.exception';

export interface ICommandInfo {
  name: string;
  description: string;
  commandClass: CommandClass;
}

export class CLI {
  public readonly commands: Map<string, ICommandInfo>;

  constructor(
    commandClasses: CommandClass[],
    protected readonly io: IInputOutput = new InputOutput(),
  ) {
    this.commands = this.registerCommands(commandClasses);
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

  /**
   * Call a command registered by its name. If it does not exist, it throws an exception
   *
   * @param commandName
   * @param argv
   * @throws CommandNotFoundException
   * @protected
   */
  protected async callCommand(commandName: string, argv: string[]): Promise<number> {
    if (!this.commands.has(commandName)) {
      throw new CommandNotFoundException(commandName);
    }

    const commandClass: CommandClass = this.commands.get(commandName).commandClass;

    return this.instanceCommand(commandClass).parse(argv);
  }

  /**
   * Print out CLI help
   *
   * @protected
   */
  public help(): void {
    const commandsInfo: ICommandInfo[] = Array.from(this.commands.values());

    this.io.writeLn('CLI Help', { bold: true, color: [255, 255, 255] });
    this.io.writeLn('--------', { bold: true, color: [255, 255, 255] });
    if (commandsInfo.length === 0) {
      this.io.writeLn('Commands not available.');
      return;
    }

    this.io.writeLn(`${chalk.bold(`Usage:`)} command [...args] [...options]`);
    this.io.space();

    this.io.writeLn('Available commands:');
    const paragraph: Paragraph = transformToColumnedLayout(
      commandsInfo.map((command) => [command.name, command.description]),
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
   * Register commands to the current CLI
   *
   * @param commandClasses
   * @protected
   */
  protected registerCommands(commandClasses: CommandClass[]): Map<string, ICommandInfo> {
    const map: Map<string, ICommandInfo> = new Map<string, ICommandInfo>();

    commandClasses.forEach((commandClass) => {
      const instance: AbstractCommand = this.instanceCommand(commandClass);
      instance.validate();
      map.set(instance.name, {
        name: instance.name,
        description: instance.description,
        commandClass: commandClass,
      });
    });

    return map;
  }

  protected instanceCommand(commandClass: CommandClass): AbstractCommand {
    return new commandClass(this.io);
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
