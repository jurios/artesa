import { CommandClass } from './command/command';
import * as arg from 'arg';
import { IInputOutput } from './io/input-output.interface';
import { InputOutput } from './io/input-output';
import * as chalk from 'chalk';
import { Paragraph, transformToColumnedLayout } from './io/helpers/layout';
import { CLIException } from './exceptions/cli.exception';
import { Router, Routes } from './router';

export class CLI {
  public readonly router: Router;

  constructor(routes: Routes, protected readonly io: IInputOutput = new InputOutput()) {
    this.router = new Router(routes);
  }

  /**
   * Parse input arguments and call to appropriate command.
   * It throws a CommandNotFoundException if no command is appropriate.
   *
   * @param argv
   * @throws CommandNotFoundException
   */
  public async parse(argv: string[]): Promise<number> {
    try {
      const args = arg(this.cliArgSpec(), { stopAtPositional: true, argv });

      if (args._.length === 0) {
        this.help();
        return 0;
      }

      const commandClass: CommandClass = this.router.route(args._[0]);
      return await this.callCommand(args._[0], commandClass, argv.slice(1));
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
   * @param route
   * @param command
   * @param argv
   * @throws CommandNotFoundException
   * @protected
   */
  protected async callCommand(
    route: string,
    command: CommandClass,
    argv: string[],
  ): Promise<number> {
    return new command(this.io).parse(route, argv);
  }

  /**
   * Print out CLI help
   *
   * @protected
   */
  public help(): void {
    if (Object.keys(this.router.routes).length === 0) {
      this.io.writeLn('Commands not available.');
      return;
    }

    this.io.writeLn(`${chalk.bold(`Usage:`)} command [...args] [...options]`);
    this.io.space();

    this.io.writeLn('Available commands:');
    const paragraph: Paragraph = transformToColumnedLayout(
      Object.keys(this.router.routes).map((route) => {
        return [`${route}`, new this.router.routes[route](this.io).getDescription()];
      }),
    );

    paragraph.forEach((line) => {
      this.io.write(line[0], { bold: true, color: [217, 119, 6] });
      this.io.writeLn(line[1], { bold: false, color: [5, 150, 105] });
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
