import { DictionaryEntry } from '../types/dictionary';

export interface PhoneticItem {
  id: string;
  text: string | null;
  audioUrl: string | null;
  label: string;
}

export function getPrimaryEntry(data: DictionaryEntry[] | null): DictionaryEntry | null {
  if (!data || data.length === 0) {
    return null;
  }
  return data[0] ?? null;
}

function normalizeAudioUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) {
    return '';
  }
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }
  return trimmed;
}

function inferAccentLabel(url: string, index: number): string {
  const lower = url.toLowerCase();
  if (lower.includes('-uk') || lower.includes('_uk')) {
    return 'UK';
  }
  if (lower.includes('-us') || lower.includes('_us')) {
    return 'US';
  }
  if (lower.includes('-au') || lower.includes('_au')) {
    return 'AU';
  }
  return `Pronunciation ${index + 1}`;
}

export function getPhonetics(entry: DictionaryEntry | null): PhoneticItem[] {
  if (!entry?.phonetics?.length) {
    return [];
  }

  const seenAudio = new Set<string>();
  const seenText = new Set<string>();
  const items: PhoneticItem[] = [];

  entry.phonetics.forEach((phonetic, index) => {
    const text = phonetic.text?.trim() || null;
    const audioUrl = phonetic.audio ? normalizeAudioUrl(phonetic.audio) : null;
    const hasAudio = Boolean(audioUrl);
    const hasText = Boolean(text);

    if (!hasAudio && !hasText) {
      return;
    }

    const audioKey = audioUrl ?? '';
    const textKey = text ?? '';

    if (hasAudio && seenAudio.has(audioKey)) {
      return;
    }
    if (!hasAudio && hasText && seenText.has(textKey)) {
      return;
    }

    if (hasAudio) {
      seenAudio.add(audioKey);
    }
    if (hasText) {
      seenText.add(textKey);
    }

    items.push({
      id: `${textKey}-${audioKey}-${index}`,
      text,
      audioUrl: hasAudio ? audioUrl : null,
      label: hasAudio ? inferAccentLabel(audioUrl!, items.filter((i) => i.audioUrl).length) : 'Spelling',
    });
  });

  return items;
}

export function getPhoneticText(entry: DictionaryEntry | null): string | null {
  const phonetics = getPhonetics(entry);
  if (phonetics.length === 0) {
    return entry?.phonetic?.trim() ?? null;
  }
  return phonetics.map((p) => p.text).filter(Boolean).join(' · ') || null;
}

export function getMeanings(entry: DictionaryEntry | null) {
  if (!entry?.meanings?.length) {
    return [];
  }

  return entry.meanings.filter(
    (meaning) =>
      meaning.partOfSpeech?.trim() &&
      Array.isArray(meaning.definitions) &&
      meaning.definitions.length > 0,
  );
}
