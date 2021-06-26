import { CLIException } from './cli.exception';

export class CommandNotFoundException extends CLIException {
  constructor(commandPath: string[]) {
    super(`Command "${commandPath.join(" ")}" not found.`);
  }
}
