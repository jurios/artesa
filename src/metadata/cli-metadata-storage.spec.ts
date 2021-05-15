import { CLIMetadataStorage, IArgumentsMetadata, ICommandMetadata } from './cli-metadata-storage';
import { AbstractCommand } from '../command/abstract-command';
import { CommandValidationException } from '../exceptions/command-validation.exception';
import { CommandNotFoundException } from '../exceptions/command-not-found.exception';

describe(CLIMetadataStorage.name, () => {
  class TestCommand extends AbstractCommand {
    description: string;
    name: string;

    handle(): Promise<number> {
      return Promise.resolve(0);
    }
  }

  class OtherCommand extends AbstractCommand {
    description: string;
    name: string;

    handle(): Promise<number> {
      return Promise.resolve(0);
    }
  }

  let storage: CLIMetadataStorage;

  beforeEach(() => {
    storage = new CLIMetadataStorage();
  });

  describe('addCommandMetadata', () => {
    let metadata: ICommandMetadata;

    beforeEach(() => {
      metadata = {
        name: 'name',
        description: 'description',
        target: TestCommand,
      };
      storage.addCommandMetadata(metadata);
    });

    it('should throw an exception if the name has been registered', () => {
      const t = () => {
        storage.addCommandMetadata({
          name: 'name',
          description: '',
          target: TestCommand,
        });
      };

      expect(t).toThrow(CommandValidationException);
    });

    it('should register command metadata', () => {
      storage.addCommandMetadata({
        name: 'other',
        description: '',
        target: TestCommand,
      });

      expect(storage['_commands'][1]).toStrictEqual({
        name: 'other',
        description: '',
        target: TestCommand,
      });
    });
  });

  describe('addArgumentsMetadata', () => {
    let metadata: IArgumentsMetadata;

    beforeEach(() => {
      metadata = {
        arguments: [],
        target: TestCommand,
      };
      storage.addArgumentsMetadata(metadata);
    });

    it('should throw an exception if arguments for the command class has been already registered', () => {
      const t = () => {
        storage.addArgumentsMetadata({
          arguments: [],
          target: TestCommand,
        });
      };

      expect(t).toThrow(CommandValidationException);
    });

    it('should register command arguments metadata', () => {
      storage.addArgumentsMetadata({
        arguments: [],
        target: OtherCommand,
      });

      expect(storage['_arguments'][1]).toStrictEqual({
        arguments: [],
        target: OtherCommand,
      });
    });
  });

  describe('findCommandOrFail', () => {
    let metadata: ICommandMetadata;

    beforeEach(() => {
      metadata = {
        name: 'name',
        description: 'description',
        target: TestCommand,
      };
      storage.addCommandMetadata(metadata);
    });

    it('should return command metadata if exists', () => {
      expect(storage.findCommandOrFail(metadata.name)).toStrictEqual(metadata);
    });

    it('should throw a CommandNotFoundException if command metadata does not exist', () => {
      const t = () => {
        storage.findCommandOrFail('other');
      };

      expect(t).toThrow(CommandNotFoundException);
    });
  });

  describe('getCommandArguments', () => {
    let metadata: IArgumentsMetadata;

    beforeEach(() => {
      metadata = {
        arguments: [
          {
            name: 'arg1',
            description: 'arg description',
          },
        ],
        target: TestCommand,
      };
      storage.addArgumentsMetadata(metadata);
    });

    it('should return command metadata if exists', () => {
      expect(storage.getCommandArguments(TestCommand)).toStrictEqual(metadata);
    });

    it('should return null if arguments metadata does not exist', () => {
      expect(storage.getCommandArguments(OtherCommand)).toBeNull();
    });
  });
});
