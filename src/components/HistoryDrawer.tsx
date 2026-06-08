import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, radii, shadows, spacing, typography } from '../theme/styles';
import { EmptyState } from './EmptyState';

export function HistoryDrawer(props: DrawerContentComponentProps) {
  const { history, search, removeHistoryWord, clearAllHistory } = useApp();

  const handleSelect = async (word: string) => {
    props.navigation.closeDrawer();
    await search(word);
    props.navigation.navigate('Main', { screen: 'WordDetail' });
  };

  const handleRemove = (word: string) => {
    Alert.alert('Remove word', `Remove "${word}" from history?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => void removeHistoryWord(word),
      },
    ]);
  };

  const handleClearAll = () => {
    if (history.length === 0) {
      return;
    }
    Alert.alert('Clear history', 'Remove all searched words from history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear all',
        style: 'destructive',
        onPress: () => void clearAllHistory(),
      },
    ]);
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
      style={styles.drawer}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Search History</Text>
          <Text style={styles.subtitle}>
            {history.length} {history.length === 1 ? 'word' : 'words'} saved
          </Text>
        </View>
        {history.length > 0 ? (
          <Pressable style={styles.clearAllButton} onPress={handleClearAll}>
            <Ionicons name="trash-outline" size={18} color={colors.error} />
            <Text style={styles.clearAllText}>Clear all</Text>
          </Pressable>
        ) : null}
      </View>

      {history.length === 0 ? (
        <EmptyState
          title="No searches yet"
          message="Words you look up will appear here for quick access."
          icon="time-outline"
        />
      ) : (
        <View style={styles.list}>
          {history.map((item, index) => (
            <View key={`${item}-${index}`} style={styles.itemRow}>
              <Pressable
                style={styles.itemMain}
                onPress={() => void handleSelect(item)}
              >
                <View style={styles.itemIcon}>
                  <Ionicons name="book-outline" size={16} color={colors.primary} />
                </View>
                <Text style={styles.itemText} numberOfLines={1}>
                  {item}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </Pressable>
              <Pressable
                style={styles.deleteButton}
                onPress={() => handleRemove(item)}
                hitSlop={8}
              >
                <Ionicons name="close-circle" size={22} color={colors.textMuted} />
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: colors.surface,
  },
  container: {
    flexGrow: 1,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.heading,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.small,
    color: colors.textSecondary,
    marginTop: 4,
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm,
    backgroundColor: colors.errorBg,
  },
  clearAllText: {
    fontSize: typography.caption,
    fontWeight: '600',
    color: colors.error,
  },
  list: {
    gap: spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  itemMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radii.md,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.sm + 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  itemIcon: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  itemText: {
    flex: 1,
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.text,
    textTransform: 'capitalize',
  },
  deleteButton: {
    padding: spacing.xs,
  },
});
