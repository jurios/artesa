import { InputOutput } from './input-output';
import { IStream } from './stream/stream.interface';
import { getMockedStream } from '../../tests/fixtures/stream';

describe(InputOutput.name, () => {
  let io: InputOutput;
  let stream: IStream;

  beforeEach(() => {
    stream = getMockedStream();

    io = new InputOutput(stream);
  });

  describe('writeLn', () => {
    it('should call to stdout', () => {
      io.writeLn('message line');

      expect(stream.stdout.write).toHaveBeenCalledWith('message line');
    });
  });
});
