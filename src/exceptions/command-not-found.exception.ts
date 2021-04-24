import { CLIException } from './cli.exception';

export class CommandNotFoundException extends CLIException {
  constructor(name: string) {
    super(`Command "${name}" not found.`, true);
  }
}
