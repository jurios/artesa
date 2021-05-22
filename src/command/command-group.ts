import { Command, CommandClass } from './command';
import { IArgument } from './input/argument';
import { ArgumentBag, OptionBag } from './input/bag/bag';
import { InputParser } from './input/input-parser';
import { CommandNotFoundException } from '../exceptions/command-not-found.exception';
import { buildCommandHelpTreeGrid } from '../io/helpers/layout';
import { generateCommandHelpTree } from '../io/generate-command-help-tree';

export type Routes = { [route: string]: CommandClass };

export abstract class CommandGroup extends Command {
  public abstract readonly routes: Routes;

  /**
   * @inheritDoc
   * @param route
   * @param argv
   */
  public async run(route: string, argv: string[]): Promise<number> {
    try {
      const [argumentBag] = this.parse(argv);

      if (!argumentBag.has('command')) {
        this.printHelp(route);
        return 0;
      }

      const relativeRoute: string = argumentBag.get<string>('command');
      const fullRoute = `${route} ${relativeRoute}`;

      const commandClass: CommandClass = this.routes[relativeRoute];

      if (!commandClass) {
        return this.handleRuntimeError(route, new CommandNotFoundException(fullRoute));
      }

      const command: Command = new commandClass(this.io);
      return command.run(fullRoute, argv.slice(1));
    } catch (e) {
      return this.handleRuntimeError(route, e);
    }
  }

  /**
   * @inheritDoc
   * @param argv
   * @protected
   */
  protected parse(argv: string[]): [ArgumentBag, OptionBag] {
    // Set permissive flag to true in order to ignore options which belongs to child commands
    return InputParser.parse(argv, this.argumentDefs, this.optionDefs, { permissive: true });
  }

  /**
   * @inheritDoc
   * @param route
   * @protected
   */
  protected printHelp(route: string): void {
    this.printHelpHeader(route);

    if (Object.keys(this.routes).length === 0) {
      this.io.writeLn('Commands not available.');
      return;
    }

    this.io.writeLn('Available commands:');

    buildCommandHelpTreeGrid(generateCommandHelpTree(this.routes)).forEach((row) => {
      this.io.write(row[0], { bold: true, color: [217, 119, 6] });
      this.io.writeLn(row[1], { bold: false, color: [5, 150, 105] });
    });

    this.io.space(2);
    this.io.writeLn(
      `(!) Tip: Run command with "--help" or "-h" option to show specific command help.`,
    );
  }

  /**
   * @inheritDoc
   */
  getArguments(): IArgument[] {
    return [
      {
        name: 'command',
        description: 'Command to run',
        required: false,
      },
    ];
  }

  /**
   * @inheritDoc
   * @protected
   */
  protected async handle(): Promise<number> {
    return 0;
  }
}
