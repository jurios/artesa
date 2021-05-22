import { IInputOutput } from './io/input-output.interface';
import { InputOutput } from './io/input-output';
import { CommandGroup, Routes } from './command/command-group';
import * as path from 'path';

export class CLI extends CommandGroup {
  public readonly routes: Routes;

  protected constructor(routes: Routes, io: IInputOutput) {
    super(io);
    this.routes = routes;
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
