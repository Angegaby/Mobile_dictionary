import { StyleSheet } from 'react-native';

export const colors = {
  background: '#F4F6FB',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  text: '#1A1D26',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  primary: '#5B4CDB',
  primaryLight: '#7C6EF0',
  primarySoft: '#EEEAFF',
  primaryDark: '#4338CA',
  secondary: '#0EA5E9',
  secondarySoft: '#E0F2FE',
  success: '#10B981',
  error: '#EF4444',
  errorBg: '#FEF2F2',
  warning: '#F59E0B',
  shadow: '#1A1D26',
  overlay: 'rgba(26, 29, 38, 0.45)',
  gradientStart: '#5B4CDB',
  gradientEnd: '#7C3AED',
  chip: '#F8F7FF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  hero: 36,
  title: 28,
  heading: 20,
  body: 16,
  small: 14,
  caption: 12,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const shadows = {
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
};

export const commonStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: typography.title,
    fontWeight: '700',
    color: colors.text,
  },
  heading: {
    fontSize: typography.heading,
    fontWeight: '600',
    color: colors.text,
  },
  body: {
    fontSize: typography.body,
    color: colors.text,
    lineHeight: 24,
  },
  caption: {
    fontSize: typography.caption,
    color: colors.textSecondary,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
});
