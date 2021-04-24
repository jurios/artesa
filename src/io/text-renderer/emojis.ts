//Regexp to detect ":emoji_name:" in a text
const emojiRegexp = /:([a-zA-Z0-9_\-+]+):/g;

export const EMOJIS: Record<string, string> = {
  coffee: '☕',
  check: '✔',
  error: '✖',
  warning: '⚠',
};

/**
 * Returns an emoji. It returns null if the emoji does not exist
 *
 * @param name
 */
export function getEmoji(name: string): string | null {
  return EMOJIS[name] ?? null;
}

/**
 * Binds emojis to a text matching :emoji_name:. If the emoji was not found
 * it leaves the :emoji_name: text.
 *
 * @param text
 */
export function bindEmojis(text: unknown): unknown {
  // Maybe a number, boolean or object is being printed.
  if (!(typeof text === 'string')) {
    return text;
  }

  return text.replace(new RegExp(emojiRegexp), (match, id) => {
    return this.getEmoji(id) ?? `:${id}:`;
  });
}
