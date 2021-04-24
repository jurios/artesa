import { IStream } from './stream.interface';
import * as stream from 'stream';

export class ConsoleStream implements IStream {
  stdin: stream.Readable = process.stdin;
  stdout: stream.Writable = process.stdout;
  stderr: stream.Writable = process.stderr;
}
