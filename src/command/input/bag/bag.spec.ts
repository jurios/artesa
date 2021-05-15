import { Bag } from './bag';

describe(Bag.name, () => {
  class TestBag extends Bag {
    protected parseInput(input: Record<string, unknown>): Record<string, unknown> {
      return input;
    }
  }

  let bag: TestBag;

  beforeEach(() => {
    bag = new TestBag({ parsed: true });
  });
  describe('constructor', () => {
    it('should parse input', () => {
      expect(bag['items']).toStrictEqual({ parsed: true });
    });
  });

  describe('has()', () => {
    beforeEach(() => {
      bag = new TestBag({ arg1: 'value1', arg2: 'value2' });
    });
    it('should return true if argument has a value', () => {
      expect(bag.has('arg1')).toBeTruthy();
      expect(bag.has('arg2')).toBeTruthy();
    });

    it('should return false if argument has no value', () => {
      bag = new TestBag({ arg1: 'value1' });
      expect(bag.has('arg1')).toBeTruthy();
      expect(bag.has('arg2')).toBeFalsy();
    });

    it('should return true if argument has a null value', () => {
      bag = new TestBag({ arg1: null, arg2: null });

      expect(bag.has('arg1')).toBeTruthy();
    });
  });
});
