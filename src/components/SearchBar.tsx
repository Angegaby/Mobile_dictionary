import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors, commonStyles, radii, spacing, typography } from '../theme/styles';
import { validateSearchInput } from '../utils/validateSearchInput';

interface SearchBarProps {
  onSearch: (word: string) => void;
  loading?: boolean;
  initialValue?: string;
}

export function SearchBar({ onSearch, loading = false, initialValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const [validationError, setValidationError] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSearch = () => {
    const result = validateSearchInput(query);
    if (!result.valid) {
      setValidationError(result.message ?? 'Invalid search input.');
      return;
    }

    setValidationError('');
    Keyboard.dismiss();
    onSearch(query.trim());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Look up a word</Text>
      <View style={[styles.inputWrap, focused && styles.inputWrapFocused]}>
        <Ionicons name="search" size={20} color={focused ? colors.primary : colors.textMuted} />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            if (validationError) {
              setValidationError('');
            }
          }}
          placeholder="e.g. beautiful, courage, learn..."
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={!loading}
        />
        {query.length > 0 ? (
          <Pressable onPress={() => setQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {validationError ? (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={16} color={colors.error} />
          <Text style={styles.errorText}>{validationError}</Text>
        </View>
      ) : null}
      <Pressable
        style={[commonStyles.button, loading && commonStyles.buttonDisabled]}
        onPress={handleSearch}
        disabled={loading}
      >
        <View style={styles.buttonInner}>
          {loading ? (
            <Ionicons name="hourglass-outline" size={18} color="#FFFFFF" />
          ) : (
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          )}
          <Text style={commonStyles.buttonText}>
            {loading ? 'Searching...' : 'Search Dictionary'}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  label: {
    fontSize: typography.small,
    fontWeight: '700',
    color: colors.text,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colors.background,
  },
  inputWrapFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    fontSize: typography.body,
    color: colors.text,
    paddingVertical: 0,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.small,
    fontWeight: '500',
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
