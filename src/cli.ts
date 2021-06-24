import { IInputOutput } from './io/input-output.interface';
import { InputOutput } from './io/input-output';
import * as path from 'path';
import { Router, RouteResult } from './router/route';
import { Command } from './command/command';
import { CommandNotFoundException } from './exceptions/command-not-found.exception';
import { buildCommandHelpTreeGrid } from './io/helpers/layout';
import { generateCommandHelpTree } from './io/generate-command-help-tree';
import { Routes } from './router/routes';

export class CLI {
  protected readonly _router: Router;

  protected constructor(public readonly routes: Routes, public readonly io: IInputOutput) {
    this._router = new Router(routes);
  }

  /**
   * Run a command
   *
   * @inheritDoc
   * @param cliPath
   * @param argv
   */
  public async run(cliPath: string, argv: string[]): Promise<number> {
    try {
      const routeResult: RouteResult = this._router.route(argv);

      if (typeof routeResult.target === 'function') {
        const command: Command = new routeResult.target(this.io);
        return command.run('', routeResult.argv);
      } else {
        this.printHelp(routeResult.target as Routes);
      }
    } catch (e) {
      if (e instanceof CommandNotFoundException) {
        this.printHelp(this.routes);
      }

      throw e;
    }
  }

  /**
   * @protected
   */
  protected printHelp(routes: Routes): void {
    if (Object.keys(routes).length === 0) {
      this.io.writeLn('Commands not available.');
      return;
    }

    this.io.writeLn('Available commands:');

    buildCommandHelpTreeGrid(generateCommandHelpTree(routes)).forEach((row) => {
      this.io.write(row[0], { bold: true, color: [217, 119, 6] });
      this.io.writeLn(row[1], { bold: false, color: [5, 150, 105] });
    });

    this.io.space(2);
    this.io.writeLn(
      `(!) Tip: Run command with "--help" or "-h" option to show specific command help.`,
    );
  }

  static execute(
    routes: Routes,
    argv: string[],
    io: IInputOutput = new InputOutput(),
  ): Promise<number> {
    const cli: CLI = new this(routes, io);
    const scriptPath: string = path.basename(argv[1]);

    return cli.run(scriptPath, argv.slice(2));
  }
}
