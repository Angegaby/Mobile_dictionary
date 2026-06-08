import { Ionicons } from '@expo/vector-icons';
import { AVPlaybackStatus } from 'expo-av';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  getActiveAudioUrl,
  isActiveUrl,
  pauseActiveSound,
  resumeActiveSound,
  startAudio,
  stopActiveSound,
} from '../services/audioService';
import { colors, radii, spacing, typography } from '../theme/styles';
import { PhoneticItem } from '../utils/parseDictionary';

interface PronunciationListProps {
  phonetics: PhoneticItem[];
}

type ItemState = 'idle' | 'loading' | 'playing' | 'paused' | 'stopped' | 'error';

function getStatusLabel(state: ItemState): string {
  switch (state) {
    case 'loading':
      return 'Loading audio...';
    case 'playing':
      return 'Playing';
    case 'paused':
      return 'Paused';
    case 'stopped':
      return 'Stopped';
    case 'error':
      return 'Playback failed';
    default:
      return 'Ready to play';
  }
}

export function PronunciationList({ phonetics }: PronunciationListProps) {
  const [states, setStates] = useState<Record<string, ItemState>>({});
  const [activeId, setActiveId] = useState<string | null>(null);

  const withAudio = phonetics.filter((p) => p.audioUrl);
  const textOnly = phonetics.filter((p) => !p.audioUrl && p.text);

  const resetOtherItems = useCallback((keepId: string) => {
    setStates((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((id) => {
        if (id !== keepId) {
          next[id] = 'idle';
        }
      });
      return next;
    });
  }, []);

  const setItemState = useCallback((id: string, state: ItemState) => {
    setStates((prev) => ({ ...prev, [id]: state }));
  }, []);

  const attachStatusHandler = useCallback(
    (item: PhoneticItem) => (status: AVPlaybackStatus) => {
      if (!status.isLoaded) {
        if ('error' in status && status.error) {
          setItemState(item.id, 'error');
        }
        return;
      }
      if (status.isPlaying) {
        setItemState(item.id, 'playing');
      } else if (status.didJustFinish) {
        setItemState(item.id, 'idle');
        setActiveId(null);
      } else if (getActiveAudioUrl() === item.audioUrl) {
        setItemState(item.id, 'paused');
      }
    },
    [setItemState],
  );

  useEffect(() => {
    return () => {
      void stopActiveSound();
    };
  }, []);

  const handlePlay = async (item: PhoneticItem) => {
    if (!item.audioUrl) {
      return;
    }

    const currentState = states[item.id] ?? 'idle';
    const isActive = activeId === item.id && isActiveUrl(item.audioUrl);

    try {
      setActiveId(item.id);
      resetOtherItems(item.id);

      if (isActive && currentState === 'paused') {
        setItemState(item.id, 'loading');
        await resumeActiveSound();
        setItemState(item.id, 'playing');
        return;
      }

      setItemState(item.id, 'loading');
      await startAudio(item.audioUrl, attachStatusHandler(item));
      setItemState(item.id, 'playing');
    } catch {
      setItemState(item.id, 'error');
    }
  };

  const handlePause = async (item: PhoneticItem) => {
    if (!item.audioUrl || activeId !== item.id) {
      return;
    }

    try {
      await pauseActiveSound();
      setItemState(item.id, 'paused');
    } catch {
      setItemState(item.id, 'error');
    }
  };

  const handleStop = async (item: PhoneticItem) => {
    if (!item.audioUrl || activeId !== item.id) {
      return;
    }

    try {
      await stopActiveSound();
      setItemState(item.id, 'stopped');
      setActiveId(null);
    } catch {
      setItemState(item.id, 'error');
    }
  };

  if (withAudio.length === 0 && textOnly.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Pronunciations</Text>
      {withAudio.map((item) => {
        const state = states[item.id] ?? 'idle';
        const isActive = activeId === item.id;
        const isPlaying = state === 'playing';
        const isPaused = state === 'paused';
        const isLoading = state === 'loading';
        const canPlay = !isLoading && (!isActive || state === 'idle' || isPaused || state === 'stopped');
        const canPause = isActive && isPlaying;
        const canStop = isActive && (isPlaying || isPaused);

        return (
          <View key={item.id} style={styles.row}>
            <View style={styles.textBlock}>
              <Text style={styles.accentLabel}>{item.label}</Text>
              {item.text ? (
                <Text style={styles.phoneticText} numberOfLines={3}>
                  {item.text}
                </Text>
              ) : null}
            </View>

            <View style={styles.controlsSection}>
              <View style={styles.statusPill}>
                <View
                  style={[
                    styles.statusDot,
                    isPlaying && styles.statusDotPlaying,
                    isPaused && styles.statusDotPaused,
                    state === 'error' && styles.statusDotError,
                  ]}
                />
                <Text style={styles.statusText}>{getStatusLabel(state)}</Text>
              </View>

              <View style={styles.controlsRow}>
                <Pressable
                  style={[styles.controlButton, canPlay && styles.controlButtonEnabled]}
                  onPress={() => void handlePlay(item)}
                  disabled={!canPlay}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <Ionicons
                      name="play"
                      size={16}
                      color={canPlay ? colors.primary : colors.textMuted}
                    />
                  )}
                  <Text style={[styles.controlLabel, canPlay && styles.controlLabelEnabled]}>
                    Play
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.controlButton, canPause && styles.controlButtonEnabled]}
                  onPress={() => void handlePause(item)}
                  disabled={!canPause}
                >
                  <Ionicons
                    name="pause"
                    size={16}
                    color={canPause ? colors.primary : colors.textMuted}
                  />
                  <Text style={[styles.controlLabel, canPause && styles.controlLabelEnabled]}>
                    Pause
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.controlButton, canStop && styles.controlButtonEnabled]}
                  onPress={() => void handleStop(item)}
                  disabled={!canStop}
                >
                  <Ionicons
                    name="stop"
                    size={16}
                    color={canStop ? colors.error : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.controlLabel,
                      canStop && styles.controlLabelStop,
                    ]}
                  >
                    Stop
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        );
      })}
      {textOnly.map((item) => (
        <View key={item.id} style={styles.textOnlyRow}>
          <Text style={styles.phoneticText} numberOfLines={3}>
            {item.text}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  sectionLabel: {
    fontSize: typography.caption,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row: {
    backgroundColor: colors.primarySoft,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    gap: spacing.md,
  },
  textBlock: {
    flexShrink: 1,
  },
  accentLabel: {
    fontSize: typography.caption,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  phoneticText: {
    fontSize: typography.body,
    color: colors.text,
    fontStyle: 'italic',
    flexShrink: 1,
  },
  controlsSection: {
    gap: spacing.sm,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textMuted,
  },
  statusDotPlaying: {
    backgroundColor: colors.success,
  },
  statusDotPaused: {
    backgroundColor: colors.warning,
  },
  statusDotError: {
    backgroundColor: colors.error,
  },
  statusText: {
    fontSize: typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    opacity: 0.55,
  },
  controlButtonEnabled: {
    opacity: 1,
    borderColor: colors.primary,
    backgroundColor: '#FFFFFF',
  },
  controlLabel: {
    fontSize: typography.caption,
    fontWeight: '700',
    color: colors.textMuted,
  },
  controlLabelEnabled: {
    color: colors.primary,
  },
  controlLabelStop: {
    color: colors.error,
  },
  textOnlyRow: {
    backgroundColor: colors.chip,
    borderRadius: radii.md,
    padding: spacing.md,
  },
});
