import { IStream } from '../../src/io/stream/stream.interface';
import * as stream from 'stream';

export function getMockedStream(): IStream {
  return {
    stdin: ({
      on: jest.fn(),
      resume: jest.fn(),
      pause: jest.fn(),
      removeListener: jest.fn(),
    } as unknown) as stream.Readable,
    stdout: ({
      write: jest.fn(),
    } as unknown) as stream.Writable,
    stderr: ({
      write: jest.fn(),
    } as unknown) as stream.Writable,
  };
}
