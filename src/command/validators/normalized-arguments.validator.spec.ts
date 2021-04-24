import { NormalizedArgumentsValidator } from './normalized-arguments.validator';
import { INormalizedArgument } from '../argument';
import { CommandValidationException } from '../../exceptions/command-validation.exception';

describe(NormalizedArgumentsValidator.name, () => {
  describe('validate()', () => {
    it('should throw an exception if required argument follows an optional', () => {
      const args: INormalizedArgument[] = [
        {
          name: 'arg1',
          description: 'desc1',
          required: false,
          type: String,
        },
        {
          name: 'arg2',
          description: 'desc2',
          required: true,
          type: String,
        },
      ];

      const t = () => {
        NormalizedArgumentsValidator.validate(args);
      };

      expect(t).toThrow(CommandValidationException);
    });

    it('should throw an exception if name argument is defined twice', () => {
      const args: INormalizedArgument[] = [
        {
          name: 'arg1',
          description: 'desc1',
          required: true,
          type: String,
        },
        {
          name: 'arg1',
          description: 'desc2',
          required: true,
          type: String,
        },
      ];

      const t = () => {
        NormalizedArgumentsValidator.validate(args);
      };

      expect(t).toThrow(CommandValidationException);
    });
  });
});
