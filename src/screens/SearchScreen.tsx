import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { SearchBar } from '../components/SearchBar';
import { useApp } from '../context/AppContext';
import { MainStackParamList } from '../navigation/RootNavigator';
import { colors, commonStyles, radii, shadows, spacing, typography } from '../theme/styles';

type Props = NativeStackScreenProps<MainStackParamList, 'Search'>;

const SUGGESTIONS = ['hello', 'serendipity', 'eloquent', 'resilient'];

export function SearchScreen({ navigation }: Props) {
  const { search, loading } = useApp();

  const handleSearch = async (word: string) => {
    await search(word);
    navigation.navigate('WordDetail');
  };

  return (
    <SafeAreaView style={commonStyles.screen} edges={['bottom']}>
      <View style={styles.container}>
        <View style={styles.heroCard}>
          <View style={styles.iconBadge}>
            <Ionicons name="book" size={28} color={colors.primary} />
          </View>
          <Text style={styles.brand}>LexiTech</Text>
          <Text style={styles.brandSub}>Dictionary</Text>
          <Text style={styles.subtitle}>
            Discover meanings, hear pronunciations, and explore real usage examples.
          </Text>
        </View>

        <View style={styles.searchCard}>
          <SearchBar onSearch={(word) => void handleSearch(word)} loading={loading} />
        </View>

        <View style={styles.suggestions}>
          <Text style={styles.suggestionsLabel}>Try searching</Text>
          <View style={styles.chipRow}>
            {SUGGESTIONS.map((word) => (
              <Pressable
                key={word}
                style={styles.chip}
                onPress={() => void handleSearch(word)}
              >
                <Text style={styles.chipText}>{word}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
      <LoadingOverlay visible={loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.lg,
  },
  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: radii.xl,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.lg,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  brand: {
    fontSize: typography.hero,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  brandSub: {
    fontSize: typography.heading,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.small,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.sm,
  },
  searchCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  suggestions: {
    gap: spacing.sm,
  },
  suggestionsLabel: {
    fontSize: typography.caption,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.primarySoft,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
  },
  chipText: {
    color: colors.primary,
    fontSize: typography.small,
    fontWeight: '600',
  },
});
