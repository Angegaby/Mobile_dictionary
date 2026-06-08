import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { fetchWord } from '../services/dictionaryApi';
import { addWord, clearHistory, getHistory, removeWord } from '../services/historyService';
import { AppError, DictionaryEntry } from '../types/dictionary';
import { validateSearchInput } from '../utils/validateSearchInput';

interface AppContextValue {
  wordData: DictionaryEntry[] | null;
  loading: boolean;
  error: AppError | null;
  lastSearchedWord: string;
  history: string[];
  search: (word: string) => Promise<boolean>;
  retry: () => Promise<boolean>;
  refreshHistory: () => Promise<void>;
  removeHistoryWord: (word: string) => Promise<void>;
  clearAllHistory: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [wordData, setWordData] = useState<DictionaryEntry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [lastSearchedWord, setLastSearchedWord] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  const refreshHistory = useCallback(async () => {
    const items = await getHistory();
    setHistory(items);
  }, []);

  useEffect(() => {
    void refreshHistory();
  }, [refreshHistory]);

  const search = useCallback(async (word: string): Promise<boolean> => {
    const validation = validateSearchInput(word);
    if (!validation.valid) {
      setError(new AppError('unknown', validation.message ?? 'Invalid search input.'));
      return false;
    }

    const trimmed = word.trim();
    setLoading(true);
    setError(null);
    setLastSearchedWord(trimmed);

    try {
      const data = await fetchWord(trimmed);
      setWordData(data);
      const updatedHistory = await addWord(trimmed);
      setHistory(updatedHistory);
      return true;
    } catch (err) {
      setWordData(null);
      if (err instanceof AppError) {
        setError(err);
      } else {
        setError(new AppError('unknown', 'Something went wrong. Please try again.'));
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const retry = useCallback(async () => {
    if (!lastSearchedWord) {
      return false;
    }
    return search(lastSearchedWord);
  }, [lastSearchedWord, search]);

  const removeHistoryWord = useCallback(async (word: string) => {
    const updated = await removeWord(word);
    setHistory(updated);
  }, []);

  const clearAllHistory = useCallback(async () => {
    const updated = await clearHistory();
    setHistory(updated);
  }, []);

  const value = useMemo(
    () => ({
      wordData,
      loading,
      error,
      lastSearchedWord,
      history,
      search,
      retry,
      refreshHistory,
      removeHistoryWord,
      clearAllHistory,
    }),
    [
      wordData,
      loading,
      error,
      lastSearchedWord,
      history,
      search,
      retry,
      refreshHistory,
      removeHistoryWord,
      clearAllHistory,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
