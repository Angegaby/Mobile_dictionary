export function getWordFontSize(word: string): number {
  const length = word.length;
  if (length > 30) {
    return 20;
  }
  if (length > 22) {
    return 26;
  }
  if (length > 16) {
    return 32;
  }
  if (length > 12) {
    return 36;
  }
  return 42;
}

/** Inserts zero-width spaces so very long words can wrap instead of overflowing. */
export function formatLongWord(word: string): string {
  if (word.length <= 18) {
    return word;
  }
  return word.replace(/(.{6})/g, '$1\u200B').trim();
}
