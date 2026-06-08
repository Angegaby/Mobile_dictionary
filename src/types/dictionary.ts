export interface Phonetic {
  text?: string;
  audio?: string;
  sourceUrl?: string;
  license?: {
    name?: string;
    url?: string;
  };
}

export interface Definition {
  definition: string;
  synonyms?: string[];
  antonyms?: string[];
  example?: string;
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms?: string[];
  antonyms?: string[];
}

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  license?: {
    name?: string;
    url?: string;
  };
  sourceUrls?: string[];
}

export type AppErrorType = 'not_found' | 'network' | 'parse' | 'unknown';

export class AppError extends Error {
  type: AppErrorType;

  constructor(type: AppErrorType, message: string) {
    super(message);
    this.type = type;
    this.name = 'AppError';
  }
}
