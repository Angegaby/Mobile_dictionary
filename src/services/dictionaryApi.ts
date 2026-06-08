import axios, { AxiosError, isAxiosError } from 'axios';
import { AppError, DictionaryEntry } from '../types/dictionary';
import { validateSearchInput } from '../utils/validateSearchInput';

const BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

export async function fetchWord(word: string): Promise<DictionaryEntry[]> {
  const validation = validateSearchInput(word);
  if (!validation.valid) {
    throw new AppError('unknown', validation.message ?? 'Invalid search input.');
  }

  const trimmed = word.trim();
  const url = `${BASE_URL}/${encodeURIComponent(trimmed)}`;

  try {
    const response = await axios.get<DictionaryEntry[]>(url, {
      timeout: 15000,
      headers: { Accept: 'application/json' },
    });

    if (!Array.isArray(response.data) || response.data.length === 0) {
      throw new AppError('parse', 'Received an unexpected response from the dictionary API.');
    }

    return response.data;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404) {
        throw new AppError('not_found', 'Word not found');
      }
      if (!axiosError.response) {
        throw new AppError(
          'network',
          'Network error. Check your connection.',
        );
      }
      throw new AppError(
        'unknown',
        'Something went wrong. Please try again.',
      );
    }

    throw new AppError(
      'unknown',
      'Something went wrong. Please try again.',
    );
  }
}
