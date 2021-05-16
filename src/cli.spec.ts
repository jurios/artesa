import { CLI } from './cli';
import { Command } from './command/command';
import { CommandNotFoundException } from './exceptions/command-not-found.exception';
import { getMockedOutput } from '../tests/fixtures/output';
import { IInputOutput } from './io/input-output.interface';

describe(CLI.name, () => {
  class TestCommand extends Command {
    description = 'description command';
    name = 'command:name';

    handle(): Promise<number> {
      return undefined;
    }
  }

  let cli: CLI;
  let io: IInputOutput;

  beforeEach(() => {
    io = getMockedOutput();
    cli = new CLI(
      {
        'command:name': TestCommand,
      },
      io,
    );
  });

  describe('parse()', () => {
    it('should call to help() when command name is not provided', async () => {
      cli['help'] = jest.fn().mockReturnValue(null);

      await cli.parse([]);

      expect(cli['help']).toHaveBeenCalled();
    });

    it('should return 0 when command name is not provided', async () => {
      cli['help'] = jest.fn().mockReturnValue(null);

      const value: number = await cli.parse([]);

      expect(value).toBe(0);
    });

    it('should call to help() when --help or -h are used and no command name is provided', async () => {
      cli['help'] = jest.fn().mockReturnValue(null);

      await cli.parse(['--help']);
      await cli.parse(['-h']);

      expect(cli['help']).toHaveBeenCalledTimes(2);
    });

    it('should return 0 when --help or -h are used and no command name is provided', async () => {
      cli['help'] = jest.fn().mockReturnValue(null);

      const helpReturnValue: number = await cli.parse(['--help']);
      const hReturnValue: number = await cli.parse(['-h']);

      expect(helpReturnValue).toBe(0);
      expect(hReturnValue).toBe(0);
    });

    it('should call to a command if a command name is provided', async () => {
      const spy = jest.spyOn(TestCommand.prototype, 'parse').mockResolvedValue(0);

      await cli.parse(['command:name', 'argument', '--help']);

      expect(spy).toHaveBeenCalledWith('command:name', ['argument', '--help']);
    });

    it('should return the value returned by the command handler', async () => {
      jest.spyOn(TestCommand.prototype, 'parse').mockResolvedValue(1);

      const value: number = await cli.parse(['command:name', 'argument', '--help']);

      expect(value).toBe(1);
    });

    it('should show an error and help when the command name provided is not registered', async () => {
      cli['help'] = jest.fn().mockReturnValue(null);

      await cli.parse(['command:unknown', 'argument', '--help']);

      expect(io.error).toHaveBeenCalledWith(
        'Error: ' + new CommandNotFoundException('command:unknown').message,
      );
      expect(cli['help']).toHaveBeenCalled();
    });

    it('should return 1 when the command name provided is not registered', async () => {
      cli['help'] = jest.fn().mockReturnValue(null);

      const value: number = await cli.parse(['command:unknown', 'argument', '--help']);

      expect(value).toBe(1);
    });

    it('should return 1 when the command handler throws an exception', async () => {
      cli['callCommand'] = jest.fn().mockRejectedValue(new Error());

      const value: number = await cli.parse(['command:name']);

      expect(value).toBe(1);
    });

    it('should show error message and its stack when an exception is unknown', async () => {
      const error: Error = new Error('message');
      error.stack = 'stack';

      cli['callCommand'] = jest.fn().mockRejectedValue(error);

      await cli.parse(['command:name', 'argument', '--help']);

      expect(io.error).toHaveBeenCalledWith('Error: ' + error.message);
      expect(io.errLn).toHaveBeenCalledWith(error.stack);
    });

    it('should close io after cli shows its help', async () => {
      await cli.parse([]);

      expect(io.close).toHaveBeenCalled();
    });

    it('should close io when the callCommand returns', async () => {
      jest.spyOn(TestCommand.prototype, 'parse').mockResolvedValue(1);

      await cli.parse(['command:name', 'argument', '--help']);

      expect(io.close).toHaveBeenCalled();
    });

    it('should close io when the callCommand throws an exception', async () => {
      jest.spyOn(TestCommand.prototype, 'parse').mockRejectedValue(new Error());

      await cli.parse(['command:name', 'argument', '--help']);

      expect(io.close).toHaveBeenCalled();
    });
  });
});
