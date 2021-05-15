import { CommandClass } from '../command/abstract-command';
import * as assert from 'assert';
import { AssertionError } from 'assert';
import { CommandValidationException } from '../exceptions/command-validation.exception';
import { CommandNotFoundException } from '../exceptions/command-not-found.exception';
import { IArgument } from '../command/input/argument';
import { IOption } from '../command/input/option';

export interface ICommandMetadata {
  name: string;
  description: string;
  target: CommandClass;
}

export interface IArgumentsMetadata {
  target: CommandClass;
  arguments: IArgument[];
}

export interface IOptionMetadata {
  target: CommandClass;
  option: IOption;
  propertyKey: string;
}

export class CLIMetadataStorage {
  protected _commands: ICommandMetadata[];
  protected _arguments: IArgumentsMetadata[];
  protected _options: IOptionMetadata[];

  constructor() {
    this._commands = [];
    this._arguments = [];
    this._options = [];
  }

  addCommandMetadata(metadata: ICommandMetadata): void {
    try {
      assert.strictEqual<number>(
        this._commands.filter((item) => item.name === metadata.name).length,
        0,
        `Command name ${metadata.name} cannot be used for multiple commands`,
      );

      this._commands.push(metadata);
    } catch (e) {
      if (e instanceof AssertionError) {
        throw new CommandValidationException(e.message);
      }

      throw e;
    }
  }

  addArgumentsMetadata(metadata: IArgumentsMetadata): void {
    try {
      assert.strictEqual<number>(
        this._arguments.filter((item) => item.target === metadata.target).length,
        0,
        `Command arguments definition for ${metadata.target.name} cannot be defined twice`,
      );

      this._arguments.push(metadata);
    } catch (e) {
      if (e instanceof AssertionError) {
        throw new CommandValidationException(e.message);
      }

      throw e;
    }
  }

  addOptionMetadata(metadata: IOptionMetadata): void {
    this._options.push(metadata);
  }

  /**
   * Finds command metadata by its name.
   * If command metadata does not exist, then it throws a CommandNotFoundException
   *
   * @param name
   * @throws CommandNotFoundException
   *
   */
  findCommandOrFail(name: string): ICommandMetadata {
    const results: ICommandMetadata[] = this._commands.filter((metadata) => metadata.name === name);

    if (results.length === 0) {
      throw new CommandNotFoundException(name);
    }

    return results[0];
  }

  /**
   * Returns arguments metadata for the command class if exists. Returns null if metadata does not
   * exist for the command provided
   *
   * @param commandClass
   */
  getCommandArguments(commandClass: CommandClass): IArgumentsMetadata | null {
    const results: IArgumentsMetadata[] = this._arguments.filter(
      (metadata) => metadata.target === commandClass,
    );

    return results.length === 0 ? null : results[0];
  }

  /**
   * Returns option metadata array for the command class provided.
   * It returns an empty array if command does not have any option registered.
   *
   * @param commandClass
   */
  getCommandOptions(commandClass: CommandClass): IOptionMetadata[] {
    return this._options.filter((metadata) => metadata.target === commandClass);
  }
}

const metadataStorage: CLIMetadataStorage = new CLIMetadataStorage();

export function getCLIMetadataStorage(): CLIMetadataStorage {
  return metadataStorage;
}
