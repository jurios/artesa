import { CommandValidationException } from '../../exceptions/command-validation.exception';
import { NormalizedOptionsValidator } from './normalized-options.validator';
import { INormalizedOption } from '../option';

describe(NormalizedOptionsValidator.name, () => {
  describe('validate()', () => {
    it('should throw an exception if option name is defined twice', () => {
      const args: INormalizedOption[] = [
        {
          name: 'opt1',
          description: 'desc1',
          type: String,
          required: false,
          aliases: [],
        },
        {
          name: 'opt1',
          description: 'desc2',
          type: String,
          required: false,
          aliases: [],
        },
      ];

      const t = () => {
        NormalizedOptionsValidator.validate(args);
      };

      expect(t).toThrow(CommandValidationException);
    });
    it('should throw an exception if option alias is defined twice', () => {
      const args: INormalizedOption[] = [
        {
          name: 'opt1',
          description: 'desc1',
          type: String,
          required: false,
          aliases: ['alias1'],
        },
        {
          name: 'opt2',
          description: 'desc2',
          type: String,
          required: false,
          aliases: ['alias1'],
        },
      ];

      const t = () => {
        NormalizedOptionsValidator.validate(args);
      };

      expect(t).toThrow(CommandValidationException);
    });

    it('should throw an exception if option alias is used by other option', () => {
      const args: INormalizedOption[] = [
        {
          name: 'alias1',
          description: 'desc1',
          type: String,
          required: false,
          aliases: [],
        },
        {
          name: 'opt2',
          description: 'desc2',
          type: String,
          required: false,
          aliases: ['alias1'],
        },
      ];

      const t = () => {
        NormalizedOptionsValidator.validate(args);
      };

      expect(t).toThrow(CommandValidationException);
    });

    it('should throw an exception if option is not using one or two hyphens', () => {
      const args: INormalizedOption[] = [
        {
          name: 'alias1',
          description: 'desc1',
          type: String,
          required: false,
          aliases: [],
        },
      ];

      const t = () => {
        NormalizedOptionsValidator.validate(args);
      };

      expect(t).toThrow(CommandValidationException);
    });

    it('should throw an exception if option is long option name but is using one hyphen', () => {
      const args: INormalizedOption[] = [
        {
          name: '-alias1',
          description: 'desc1',
          type: String,
          required: false,
          aliases: [],
        },
      ];

      const t = () => {
        NormalizedOptionsValidator.validate(args);
      };

      expect(t).toThrow(CommandValidationException);
    });

    it('should validate if a short option is is using one hyphen', () => {
      const args: INormalizedOption[] = [
        {
          name: '-h',
          description: 'desc1',
          type: String,
          required: false,
          aliases: [],
        },
      ];

      const t = () => {
        NormalizedOptionsValidator.validate(args);
      };

      expect(t).not.toThrow(CommandValidationException);
    });
  });
});
