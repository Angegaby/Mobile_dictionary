import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../components/EmptyState';
import { ErrorView } from '../components/ErrorView';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { MeaningSection } from '../components/MeaningSection';
import { PronunciationList } from '../components/PronunciationList';
import { useApp } from '../context/AppContext';
import { MainStackParamList } from '../navigation/RootNavigator';
import { getMeanings, getPhonetics, getPrimaryEntry } from '../utils/parseDictionary';
import { formatLongWord, getWordFontSize } from '../utils/wordDisplay';
import { colors, commonStyles, radii, shadows, spacing, typography } from '../theme/styles';

type Props = NativeStackScreenProps<MainStackParamList, 'WordDetail'>;

export function WordDetailScreen({ navigation }: Props) {
  const { wordData, loading, error, retry } = useApp();
  const entry = getPrimaryEntry(wordData);
  const phonetics = getPhonetics(entry);
  const meanings = getMeanings(entry);

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.screen}>
        <LoadingOverlay visible message="Loading word details..." />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={commonStyles.screen}>
        <ErrorView
          error={error}
          onRetry={() => void retry()}
          onBack={() => navigation.navigate('Search')}
        />
      </SafeAreaView>
    );
  }

  if (!entry) {
    return (
      <SafeAreaView style={commonStyles.screen}>
        <EmptyState
          title="No data available"
          message="Search for a word to see its definition."
          icon="search-outline"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.screen} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <Text
            style={[styles.word, { fontSize: getWordFontSize(entry.word) }]}
            adjustsFontSizeToFit
            minimumFontScale={0.55}
            numberOfLines={4}
          >
            {formatLongWord(entry.word)}
          </Text>
          <View style={styles.badge}>
            <Ionicons name="checkmark-circle" size={14} color={colors.success} />
            <Text style={styles.badgeText}>Found</Text>
          </View>
          <PronunciationList phonetics={phonetics} />
        </View>

        <View style={styles.meaningsHeader}>
          <Ionicons name="list" size={18} color={colors.primary} />
          <Text style={styles.meaningsTitle}>Definitions</Text>
          <Text style={styles.meaningsCount}>{meanings.length}</Text>
        </View>

        {meanings.length === 0 ? (
          <EmptyState
            title="No definitions found"
            message="This word was found but has no usable definition data."
          />
        ) : (
          meanings.map((meaning, index) => (
            <MeaningSection
              key={`${meaning.partOfSpeech}-${index}`}
              meaning={meaning}
              index={index}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginTop: spacing.sm,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  word: {
    fontWeight: '800',
    color: colors.text,
    textTransform: 'capitalize',
    letterSpacing: -0.5,
    width: '100%',
    flexShrink: 1,
    marginBottom: spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.full,
    marginBottom: spacing.sm,
  },
  badgeText: {
    fontSize: typography.caption,
    fontWeight: '700',
    color: colors.success,
  },
  meaningsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  meaningsTitle: {
    fontSize: typography.heading,
    fontWeight: '800',
    color: colors.text,
    flex: 1,
  },
  meaningsCount: {
    fontSize: typography.small,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.full,
    overflow: 'hidden',
  },
});
