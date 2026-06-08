import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = '@dictionary_search_history';
const MAX_HISTORY = 50;

export async function getHistory(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export async function addWord(word: string): Promise<string[]> {
  const trimmed = word.trim();
  if (!trimmed) {
    return getHistory();
  }

  const current = await getHistory();
  const normalized = trimmed.toLowerCase();
  const filtered = current.filter((item) => item.toLowerCase() !== normalized);
  const updated = [trimmed, ...filtered].slice(0, MAX_HISTORY);

  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

export async function removeWord(word: string): Promise<string[]> {
  const trimmed = word.trim();
  if (!trimmed) {
    return getHistory();
  }

  const current = await getHistory();
  const normalized = trimmed.toLowerCase();
  const updated = current.filter((item) => item.toLowerCase() !== normalized);

  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

export async function clearHistory(): Promise<string[]> {
  await AsyncStorage.removeItem(HISTORY_KEY);
  return [];
}
