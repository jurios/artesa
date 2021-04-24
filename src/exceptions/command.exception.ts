import { CLIException } from './cli.exception';

export class CommandException extends CLIException {
  constructor(message: string, printHelp: boolean) {
    super(message, printHelp);
  }
}
