import { CLIException } from './cli.exception';

export class RouterException extends CLIException {
  constructor(message: string) {
    super(message, false);
  }
}
