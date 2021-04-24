import { Command } from './command';
import { getMockedOutput } from '../../tests/fixtures/output';
import { IInputOutput } from '../io/input-output.interface';
import { ArgumentBag, OptionBag } from './bag/bag';

describe(Command.name, () => {
  class TestCommand extends Command {
    description = 'Test command';
    name = 'command:name';

    handle(): Promise<number> {
      return Promise.resolve(0);
    }
  }

  let command: TestCommand;
  let io: IInputOutput;

  beforeEach(() => {
    io = getMockedOutput();
    jest.spyOn(TestCommand.prototype, 'handle').mockResolvedValue(0);

    command = new TestCommand(io);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('parse()', () => {
    it('should call help() and return 0 if -h or --help is provided', async () => {
      command['help'] = jest.fn().mockReturnValue(null);

      await command.parse(['-h']);
      await command.parse(['--help']);

      expect(command['help']).toHaveBeenCalledTimes(2);
    });

    it('should call to handle method', async () => {
      command = new TestCommand(io);

      await command.parse([]);

      expect(command.handle).toHaveBeenCalledWith(new ArgumentBag(), new OptionBag());
    });

    it('should show an exception message and print help when an option is unknown', async () => {
      command['help'] = jest.fn();

      const value: number = await command.parse(['--unknown']);

      expect(io.error).toHaveBeenCalledWith('Error: unknown or unexpected option: --unknown');
      expect(command['help']).toHaveBeenCalled();
      expect(value).toBe(1);
    });

    it('should show the exception message and its stack and return 1 when the exception is unknown', async () => {
      const error: Error = new Error('message');
      error.stack = 'stack';
      command.handle = jest.fn().mockRejectedValue(error);

      const value: number = await command.parse([]);

      expect(io.error).toHaveBeenCalledWith('Error: ' + error.message);
      expect(io.errLn).toHaveBeenCalledWith(error.stack);
      expect(value).toBe(1);
    });
  });
});
