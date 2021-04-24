import { InputParser } from './input-parser';
import { createMockINormalizedArgument } from '../../tests/helpers';
import { INormalizedArgument } from './argument';
import { InputArgumentException } from '../exceptions/input-argument.exception';

describe(InputParser.name, () => {
  describe('arguments', () => {
    it('should add arguments to the arguments bag', () => {
      const [argumentBag] = InputParser.parse(
        ['value1'],
        [createMockINormalizedArgument('arg1')],
        [],
      );

      expect(argumentBag.has('arg1')).toBeTruthy();
    });

    it('should set argument to undefined if no value has been assigned', () => {
      const [argumentBag] = InputParser.parse([], [createMockINormalizedArgument('arg1')], []);

      expect(argumentBag.has('arg1')).toBeFalsy();
    });

    it('should throw an exception if required argument does not have value', () => {
      const argDef: INormalizedArgument = createMockINormalizedArgument('arg1');
      argDef.required = true;

      const t = () => {
        InputParser.parse([], [argDef], []);
      };

      expect(t).toThrow(InputArgumentException);
    });

    it('should not cast value if value is undefined', () => {
      const argDef: INormalizedArgument = createMockINormalizedArgument('arg1');
      argDef.type = Number; //should fail if arg1 is undefined

      const [argumentBag] = InputParser.parse([], [argDef], []);

      expect(argumentBag.has('arg1')).toBeFalsy();
    });

    it('should cast a number argument', () => {
      const argDef: INormalizedArgument = createMockINormalizedArgument('arg1');
      argDef.type = Number;

      const [argumentBag] = InputParser.parse(['10'], [argDef], []);

      expect(argumentBag.get('arg1')).toBe(10);
    });

    it('should cast a float argument', () => {
      const argDef: INormalizedArgument = createMockINormalizedArgument('arg1');
      argDef.type = Number;

      const [argumentBag] = InputParser.parse(['10.2'], [argDef], []);

      expect(argumentBag.get('arg1')).toBe(10.2);
    });

    it('should throw an exception when value cannot be casted to number', () => {
      const argDef: INormalizedArgument = createMockINormalizedArgument('arg1');
      argDef.type = Number;

      const t = () => {
        InputParser.parse(['other'], [argDef], []);
      };

      expect(t).toThrow(InputArgumentException);
    });

    it('should cast to boolean (true)', () => {
      const argDef: INormalizedArgument = createMockINormalizedArgument('arg1');
      argDef.type = Boolean;

      const [argumentBag] = InputParser.parse(['true'], [argDef], []);

      expect(argumentBag.get('arg1')).toBe(true);
    });

    it('should cast to boolean (1)', () => {
      const argDef: INormalizedArgument = createMockINormalizedArgument('arg1');
      argDef.type = Boolean;

      const [argumentBag] = InputParser.parse(['1'], [argDef], []);

      expect(argumentBag.get('arg1')).toBe(true);
    });

    it('should cast to boolean (false)', () => {
      const argDef: INormalizedArgument = createMockINormalizedArgument('arg1');
      argDef.type = Boolean;

      const [argumentBag] = InputParser.parse(['false'], [argDef], []);

      expect(argumentBag.get('arg1')).toBe(false);
    });

    it('should cast to boolean (0)', () => {
      const argDef: INormalizedArgument = createMockINormalizedArgument('arg1');
      argDef.type = Boolean;

      const [argumentBag] = InputParser.parse(['0'], [argDef], []);

      expect(argumentBag.get('arg1')).toBe(false);
    });

    it('should throw an exception if value cannot be casted to boolean', () => {
      const argDef: INormalizedArgument = createMockINormalizedArgument('arg1');
      argDef.type = Boolean;

      const t = () => {
        InputParser.parse(['other'], [argDef], []);
      };

      expect(t).toThrow(InputArgumentException);
    });
  });
});
