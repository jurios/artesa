import { CommandGroup, Routes } from './command-group';
import { Command } from './command';
import { IInputOutput } from '../io/input-output.interface';
import { getMockedOutput } from '../../tests/fixtures/output';

describe(CommandGroup.name, () => {
  class TestCommand extends Command {
    protected handle(): Promise<number> {
      return Promise.resolve(0);
    }
  }

  class TestGroup extends CommandGroup {
    readonly routes: Routes = {
      test: TestCommand,
    };
  }

  let group: CommandGroup;
  let io: IInputOutput;

  beforeEach(() => {
    io = getMockedOutput();
    group = new TestGroup(io);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('run()', () => {
    it('should run subcommand if the subcommand name provided is in the route list', async () => {
      const spy = jest.spyOn(TestCommand.prototype, 'run').mockResolvedValue(0);

      await group.run('group', ['test', 'argument', '--option']);

      expect(spy).toHaveBeenCalledWith('group test', ['argument', '--option']);
    });

    it('should return whatever subcommand returns', async () => {
      jest.spyOn(TestCommand.prototype, 'run').mockResolvedValue(1);

      const value = await group.run('group', ['test', 'argument', '--option']);

      expect(value).toBe(1);
    });

    it('should print help if no subcommand is provided', async () => {
      group['printHelp'] = jest.fn().mockResolvedValue(0);

      await group.run('group', []);

      expect(group['printHelp']).toHaveBeenCalledWith('group');
    });

    it('should return 0 if no subcommand is provided', async () => {
      const value = await group.run('group', []);

      expect(value).toBe(0);
    });

    it('should print help is subcommand provided is not in the route list', async () => {
      group['printHelp'] = jest.fn().mockResolvedValue(0);

      await group.run('group', ['other']);

      expect(group['printHelp']).toHaveBeenCalledWith('group');
    });

    it('should return 1 if subcommand provided is not in the route list', async () => {
      const value: number = await group.run('group', ['other']);

      expect(value).toBe(1);
    });
  });
});
