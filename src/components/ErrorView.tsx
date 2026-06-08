import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppError } from '../types/dictionary';
import { colors, commonStyles, radii, spacing, typography } from '../theme/styles';

interface ErrorViewProps {
  error: AppError;
  onRetry?: () => void;
  onBack?: () => void;
}

function getErrorMessage(error: AppError): string {
  switch (error.type) {
    case 'not_found':
      return 'Word not found';
    case 'network':
      return 'Network error';
    case 'parse':
      return 'Unexpected response';
    default:
      return error.message || 'Something went wrong';
  }
}

function getErrorIcon(error: AppError): keyof typeof Ionicons.glyphMap {
  switch (error.type) {
    case 'not_found':
      return 'help-circle-outline';
    case 'network':
      return 'cloud-offline-outline';
    default:
      return 'warning-outline';
  }
}

function getErrorSubtitle(error: AppError): string {
  switch (error.type) {
    case 'not_found':
      return 'Try checking the spelling or search for another word.';
    case 'network':
      return 'Check your internet connection and try again.';
    default:
      return 'You can retry the search or go back to enter a new word.';
  }
}

export function ErrorView({ error, onRetry, onBack }: ErrorViewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name={getErrorIcon(error)} size={40} color={colors.error} />
      </View>
      <Text style={styles.title}>{getErrorMessage(error)}</Text>
      <Text style={styles.subtitle}>{getErrorSubtitle(error)}</Text>
      <View style={styles.actions}>
        {onRetry ? (
          <Pressable style={commonStyles.button} onPress={onRetry}>
            <View style={styles.buttonInner}>
              <Ionicons name="refresh" size={18} color="#FFFFFF" />
              <Text style={commonStyles.buttonText}>Try again</Text>
            </View>
          </Pressable>
        ) : null}
        {onBack ? (
          <Pressable style={styles.secondaryButton} onPress={onBack}>
            <Text style={styles.secondaryButtonText}>Back to search</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: radii.full,
    backgroundColor: colors.errorBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.heading,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
    maxWidth: 300,
  },
  actions: {
    gap: spacing.sm,
    width: '100%',
    maxWidth: 280,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  secondaryButtonText: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.text,
  },
});
