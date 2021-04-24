import { IInputOutput } from '../../src/io/input-output.interface';

export function getMockedOutput(): IInputOutput {
  return {
    close: jest.fn(),
    write: jest.fn(),
    writeLn: jest.fn(),
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    err: jest.fn(),
    errLn: jest.fn(),
    space: jest.fn(),

    ask: jest.fn(),
  };
}
