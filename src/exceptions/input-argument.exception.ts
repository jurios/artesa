import { CommandException } from './command.exception';

export class InputArgumentException extends CommandException {
  constructor(message: string) {
    super(message, true);
  }
}
