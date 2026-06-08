import { Audio, AVPlaybackStatus } from 'expo-av';

let activeSound: Audio.Sound | null = null;
let activeUrl: string | null = null;

export async function stopActiveSound(): Promise<void> {
  if (!activeSound) {
    activeUrl = null;
    return;
  }
  try {
    await activeSound.stopAsync();
    await activeSound.unloadAsync();
  } catch {
    // Ignore cleanup errors.
  }
  activeSound = null;
  activeUrl = null;
}

export function getActiveAudioUrl(): string | null {
  return activeUrl;
}

export function isActiveUrl(url: string): boolean {
  const normalized = normalizeUrl(url);
  return activeUrl === normalized;
}

function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }
  return trimmed;
}

async function ensureAudioMode(): Promise<void> {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  });
}

export async function startAudio(
  url: string,
  onStatus?: (status: AVPlaybackStatus) => void,
): Promise<Audio.Sound> {
  const normalized = normalizeUrl(url);

  if (activeUrl === normalized && activeSound) {
    const status = await activeSound.getStatusAsync();
    if (status.isLoaded && !status.isPlaying) {
      await activeSound.playAsync();
      return activeSound;
    }
    if (status.isLoaded && status.isPlaying) {
      return activeSound;
    }
  }

  await stopActiveSound();
  await ensureAudioMode();

  const { sound } = await Audio.Sound.createAsync(
    { uri: normalized },
    { shouldPlay: true, volume: 1.0 },
    (status) => {
      if (status.isLoaded && status.didJustFinish) {
        void stopActiveSound();
      }
      onStatus?.(status);
    },
  );

  activeSound = sound;
  activeUrl = normalized;
  return sound;
}

export async function pauseActiveSound(): Promise<void> {
  if (activeSound) {
    const status = await activeSound.getStatusAsync();
    if (status.isLoaded && status.isPlaying) {
      await activeSound.pauseAsync();
    }
  }
}

export async function resumeActiveSound(): Promise<void> {
  if (activeSound) {
    const status = await activeSound.getStatusAsync();
    if (status.isLoaded && !status.isPlaying) {
      await activeSound.playAsync();
    }
  }
}
