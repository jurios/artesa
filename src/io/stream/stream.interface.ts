import * as stream from 'stream';

export interface IStream {
  stdin: stream.Readable;
  stdout: stream.Writable;
  stderr: stream.Writable;
}
