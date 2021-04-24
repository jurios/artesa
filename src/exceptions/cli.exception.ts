export class CLIException extends Error {
  constructor(message: string, public readonly printHelp: boolean) {
    super(message);
  }
}
