import { IInputOutput } from './io/input-output.interface';
import { InputOutput } from './io/input-output';
import * as path from 'path';
import { Router, RouteResult } from './router/router';
import { Command } from './command/command';
import { CommandNotFoundException } from './exceptions/command-not-found.exception';
import { buildCLIRoutesTree } from './io/helpers/layout';
import { Routes } from './router/routes';
import { InputArgumentException } from './exceptions/input-argument.exception';

export class CLI {
  protected _router: Router;
  protected _name: string;
  protected _io: IInputOutput;

  protected constructor(protected readonly _routes: Routes, protected readonly _filename: string) {
    this._router = new Router(this._routes);
    this._io = new InputOutput();
    this._name = this._filename;
  }

  get io(): IInputOutput {
    return this._io;
  }

  get name(): string {
    return this._name;
  }

  public withIO(io: IInputOutput): this {
    this._io = io;
    return this;
  }

  public withName(name: string): this {
    this._name = name;
    return this;
  }

  /**
   * Run a command.
   *
   * @param argv
   */
  public async run(argv: string[]): Promise<number> {
    try {
      const routeResult: RouteResult = this._router.route(argv);

      if (typeof routeResult.target === 'function') {
        //If route target is a function means it is a Command
        const command: Command = new routeResult.target(this.io);
        return await command.run(routeResult.routePath, routeResult.argv);
      } else {
        // Otherwise, target is a route list.
        this.printRoutingHelp(routeResult.routePath);
      }
    } catch (e) {
      if (e instanceof CommandNotFoundException) {
        this.io.space();
        this.io.error(e.message);
        this.io.space();
        this.printRoutingHelp([this._filename]);
        return 1;
      }

      if (e instanceof InputArgumentException) {
        this.io.space();
        this.io.error(e.message);
        this.printHelpTip();
        return 1;
      }

      throw e;
    }
  }

  /**
   * Prints a help with the routes below routePath
   */
  protected printRoutingHelp(routePath: string[]): void {
    const routes: Routes = this.getRoutesBelowPath(routePath);

    this.io.writeLn(`${this.name} CLI`, { bold: true });
    this.io.space(2);
    this.io.write('Usage: ', { bold: true, color: [217, 119, 6] });
    this.io.writeLn(`${routePath.join(' ')} [commands] [options] [arguments]`);
    this.io.space(1);
    if (Object.keys(routes).length === 0) {
      this.io.writeLn('Commands not available.');
      return;
    }

    this.io.writeLn('Available commands:');

    buildCLIRoutesTree(routes).forEach((row) => {
      this.io.write(row[0], { bold: true, color: [217, 119, 6] });
      this.io.writeLn(row[1], { bold: false, color: [5, 150, 105] });
    });

    this.printHelpTip();
  }

  /**
   * Returns children below the provided path
   *
   * @param routePath
   * @protected
   */
  protected getRoutesBelowPath(routePath: string[]): Routes {
    let pointer: Routes = this._routes;

    routePath.forEach((node) => {
      pointer = pointer[node] as Routes;
    });

    return pointer;
  }

  protected printHelpTip(): void {
    this.io.space(2);
    this.io.writeLn(
      `(!) Tip: Run command with "--help" or "-h" option to show specific command help.`,
    );
  }

  static init(routes: Routes): CLI {
    return new this(routes, path.basename(process.argv[1]));
  }
}
