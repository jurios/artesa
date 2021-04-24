import { bindEmojis, getEmoji } from './emojis';

describe('emojis', () => {
  describe('getEmoji', () => {
    it('should return the emoji if it exists', () => {
      expect(getEmoji('coffee')).toBe('☕');
    });

    it('should return null if the emoji does not exist', () => {
      expect(getEmoji('unknown')).toBeNull();
    });
  });

  describe('bindEmojis', () => {
    it('should bind emojis to the text if they exist', () => {
      expect(bindEmojis('Do you want a :coffee:? :check:,:unknown:')).toBe(
        'Do you want a ☕? ✔,:unknown:',
      );
    });
  });
});
