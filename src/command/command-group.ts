import { Command, CommandClass } from './command';
import { IArgument } from './input/argument';
import { ArgumentBag, OptionBag } from './input/bag/bag';
import { InputParser } from './input/input-parser';
import { CommandNotFoundException } from '../exceptions/command-not-found.exception';
import { Paragraph, transformToColumnedLayout } from '../io/helpers/layout';

export type Routes = { [route: string]: CommandClass };

export abstract class CommandGroup extends Command {
  public abstract readonly routes: Routes;

  /**
   * Execute the command with the provided route name and input
   *
   * @param route
   * @param argv
   */
  public async run(route: string, argv: string[]): Promise<number> {
    try {
      const [argumentBag] = this.parse(argv);

      if (!argumentBag.has('command')) {
        this.help(route);
        return 0;
      }

      const commandName: string = argumentBag.get<string>('command');
      const commandRoute: string = route + ' ' + commandName;

      const commandClass: CommandClass = this.routes[commandName];

      if (!commandClass) {
        return this.handleRuntimeError(route, new CommandNotFoundException(commandRoute));
      }

      const command: Command = new commandClass(this.io);
      return command.run(commandRoute, argv.slice(1));
    } catch (e) {
      return this.handleRuntimeError(route, e);
    }
  }

  protected parse(argv: string[]): [ArgumentBag, OptionBag] {
    // Set permissive flag to true in order to ignore options which belongs to the subcommand
    return InputParser.parse(argv, this.argumentDefs, this.optionDefs, { permissive: true });
  }

  protected help(route: string): void {
    this.printHelpSignature(route);
    if (Object.keys(this.routes).length === 0) {
      this.io.writeLn('Commands not available.');
      return;
    }

    this.io.writeLn('Available commands:');
    const paragraph: Paragraph = transformToColumnedLayout(
      Object.keys(this.routes).map((route) => {
        return [`${route}`, new this.routes[route](this.io).getDescription()];
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

  getArguments(): IArgument[] {
    return [
      {
        name: 'command',
        description: 'Command to run',
        required: false,
      },
    ];
  }

  protected async handle(): Promise<number> {
    return 0;
  }
}
