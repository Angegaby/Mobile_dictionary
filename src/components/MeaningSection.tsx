import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Meaning } from '../types/dictionary';
import { colors, radii, shadows, spacing, typography } from '../theme/styles';

interface MeaningSectionProps {
  meaning: Meaning;
  index: number;
}

const partOfSpeechColors: Record<string, { bg: string; text: string }> = {
  noun: { bg: '#EEF2FF', text: '#4F46E5' },
  verb: { bg: '#FEF3C7', text: '#D97706' },
  adjective: { bg: '#DCFCE7', text: '#16A34A' },
  adverb: { bg: '#FCE7F3', text: '#DB2777' },
  default: { bg: colors.primarySoft, text: colors.primary },
};

function getPosStyle(partOfSpeech: string) {
  const key = partOfSpeech.toLowerCase();
  return partOfSpeechColors[key] ?? partOfSpeechColors.default;
}

export function MeaningSection({ meaning, index }: MeaningSectionProps) {
  const posStyle = getPosStyle(meaning.partOfSpeech);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.posBadge, { backgroundColor: posStyle.bg }]}>
          <Text style={[styles.posText, { color: posStyle.text }]}>
            {meaning.partOfSpeech}
          </Text>
        </View>
        <Text style={styles.indexLabel}>#{index + 1}</Text>
      </View>

      {meaning.definitions.map((definition, definitionIndex) => (
        <View key={`${meaning.partOfSpeech}-${definitionIndex}`} style={styles.definitionBlock}>
          <View style={styles.definitionRow}>
            <View style={styles.numberCircle}>
              <Text style={styles.numberText}>{definitionIndex + 1}</Text>
            </View>
            <Text style={styles.definition}>{definition.definition}</Text>
          </View>
          {definition.example ? (
            <View style={styles.exampleBox}>
              <Ionicons name="chatbubble-ellipses-outline" size={14} color={colors.secondary} />
              <Text style={styles.example}>"{definition.example}"</Text>
            </View>
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  posBadge: {
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
  },
  posText: {
    fontSize: typography.small,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  indexLabel: {
    fontSize: typography.caption,
    fontWeight: '700',
    color: colors.textMuted,
  },
  definitionBlock: {
    marginBottom: spacing.md,
  },
  definitionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  numberCircle: {
    width: 24,
    height: 24,
    borderRadius: radii.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  numberText: {
    fontSize: typography.caption,
    fontWeight: '800',
    color: colors.primary,
  },
  definition: {
    flex: 1,
    fontSize: typography.body,
    color: colors.text,
    lineHeight: 24,
  },
  exampleBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    marginTop: spacing.sm,
    marginLeft: 32,
    backgroundColor: colors.secondarySoft,
    borderRadius: radii.md,
    padding: spacing.sm + 4,
    borderLeftWidth: 3,
    borderLeftColor: colors.secondary,
  },
  example: {
    flex: 1,
    fontSize: typography.small,
    color: colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 22,
  },
});
