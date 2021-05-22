import { CLIException } from './cli.exception';

export class InputArgumentException extends CLIException {
  constructor(message: string) {
    super(message, true);
  }
}
