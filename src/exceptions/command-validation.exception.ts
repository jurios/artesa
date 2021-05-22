import { CLIException } from './cli.exception';

export class CommandValidationException extends CLIException {
  constructor(message: string) {
    super(message, false);
  }
}
