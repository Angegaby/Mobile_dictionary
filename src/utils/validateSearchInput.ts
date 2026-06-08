export const SearchValidationMessages = {
  empty: 'Please enter a word to search.',
  multipleWords: 'Please search for one word, not a sentence.',
  containsNumbers: 'Please search for a word instead of numbers.',
  containsSymbols: 'Please search for a word instead of symbols.',
} as const;

export type SearchValidationCode = keyof typeof SearchValidationMessages;

export interface SearchValidationResult {
  valid: boolean;
  message?: string;
  code?: SearchValidationCode;
}

/** Allows letters plus apostrophe/hyphen within a single English word (e.g. don't, well-being). */
const SINGLE_WORD_PATTERN = /^[a-zA-Z]+(?:[-'][a-zA-Z]+)*$/;

export function validateSearchInput(input: string): SearchValidationResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return { valid: false, code: 'empty', message: SearchValidationMessages.empty };
  }

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    return {
      valid: false,
      code: 'multipleWords',
      message: SearchValidationMessages.multipleWords,
    };
  }

  const word = words[0];

  if (/\d/.test(word)) {
    return {
      valid: false,
      code: 'containsNumbers',
      message: SearchValidationMessages.containsNumbers,
    };
  }

  if (!SINGLE_WORD_PATTERN.test(word)) {
    return {
      valid: false,
      code: 'containsSymbols',
      message: SearchValidationMessages.containsSymbols,
    };
  }

  return { valid: true };
}
