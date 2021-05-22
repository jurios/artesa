import { Command } from './command';
import { getMockedOutput } from '../../tests/fixtures/output';
import { IInputOutput } from '../io/input-output.interface';
import { ArgumentBag, OptionBag } from './input/bag/bag';

describe(Command.name, () => {
  class TestCommand extends Command {
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

  describe('run()', () => {
    it('should call help() and return 0 if -h or --help is provided', async () => {
      const mock: jest.Mock = (TestCommand.prototype['printHelp'] = jest
        .fn()
        .mockReturnValue(null));

      await command.run('test:command', ['-h']);
      await command.run('test:command', ['--help']);

      expect(mock).toHaveBeenCalledTimes(2);
      mock.mockRestore();
    });

    it('should call to handle method', async () => {
      command = new TestCommand(io);

      await command.run('test:command', []);

      expect(command.handle).toHaveBeenCalledWith(new ArgumentBag(), new OptionBag());
    });

    it('should show an exception message and print help when an option is unknown', async () => {
      command['printHelp'] = jest.fn().mockReturnValue(null);

      const value: number = await command.run('test:command', ['--unknown']);

      expect(io.error).toHaveBeenCalledWith('Error: unknown or unexpected option: --unknown');
      expect(command['printHelp']).toHaveBeenCalled();
      expect(value).toBe(1);
    });

    it('should show the exception message and its stack and return 1 when the exception is unknown', async () => {
      const error: Error = new Error('message');
      error.stack = 'stack';
      command['handle'] = jest.fn().mockRejectedValue(error);

      const value: number = await command.run('test:command', []);

      expect(io.error).toHaveBeenCalledWith('Error: ' + error.message);
      expect(io.errLn).toHaveBeenCalledWith(error.stack);
      expect(value).toBe(1);
    });
  });
});
