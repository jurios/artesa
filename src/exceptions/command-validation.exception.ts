import { CommandException } from './command.exception';

export class CommandValidationException extends CommandException {
  constructor(message: string) {
    super(message, false);
  }
}
