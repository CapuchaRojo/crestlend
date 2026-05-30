import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import type { PropsWithChildren, ReactNode } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  type StyleProp,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radii, shadow, spacing } from '@/src/constants/theme';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

type BadgeVariant = 'demo' | 'success' | 'warning' | 'danger' | 'neutral' | 'info';

const badgeStyles: Record<BadgeVariant, { backgroundColor: string; color: string }> = {
  demo: { backgroundColor: colors.primarySoft, color: colors.primaryDark },
  success: { backgroundColor: colors.greenSoft, color: colors.green },
  warning: { backgroundColor: colors.amberSoft, color: '#8A5B00' },
  danger: { backgroundColor: colors.coralSoft, color: '#9F3028' },
  neutral: { backgroundColor: '#EDF1F2', color: colors.slate },
  info: { backgroundColor: colors.sky, color: colors.blue },
};

interface AppScreenProps extends PropsWithChildren {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  scroll?: boolean;
  rightSlot?: ReactNode;
  contentStyle?: ViewStyle;
}

export function AppScreen({
  eyebrow,
  title,
  subtitle,
  scroll = true,
  rightSlot,
  children,
  contentStyle,
}: AppScreenProps) {
  const content = (
    <View style={[styles.content, contentStyle]}>
      {(eyebrow || title || subtitle || rightSlot) && (
        <LinearGradient
          colors={['#FFFFFF', '#EEF8F5', '#EAF4FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : <View />}
            {rightSlot}
          </View>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </LinearGradient>
      )}
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {scroll ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

export function Card({
  children,
  style,
  accent,
}: PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  accent?: 'primary' | 'amber' | 'coral' | 'blue';
}>) {
  const accentStyle =
    accent === 'primary'
      ? styles.primaryAccent
      : accent === 'amber'
        ? styles.amberAccent
        : accent === 'coral'
          ? styles.coralAccent
          : accent === 'blue'
            ? styles.blueAccent
            : null;

  return (
    <View style={[styles.card, accentStyle, style]}>{children}</View>
  );
}

export function Badge({ label, variant = 'neutral' }: { label: string; variant?: BadgeVariant }) {
  const variantStyle = badgeStyles[variant];

  return (
    <View style={[styles.badge, { backgroundColor: variantStyle.backgroundColor }]}>
      <Text style={[styles.badgeText, { color: variantStyle.color }]}>{label}</Text>
    </View>
  );
}

export function SectionHeader({
  title,
  caption,
}: {
  title: string;
  caption?: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {caption ? <Text style={styles.sectionCaption}>{caption}</Text> : null}
    </View>
  );
}

interface ButtonProps {
  label: string;
  icon?: IconName;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function ActionButton({
  label,
  icon,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}: ButtonProps) {
  const variantButtonStyle =
    variant === 'primary'
      ? styles.primaryButton
      : variant === 'secondary'
        ? styles.secondaryButton
        : variant === 'ghost'
          ? styles.ghostButton
          : styles.dangerButton;
  const variantTextStyle =
    variant === 'primary'
      ? styles.primaryButtonText
      : variant === 'secondary'
        ? styles.secondaryButtonText
        : variant === 'ghost'
          ? styles.ghostButtonText
          : styles.dangerButtonText;
  const buttonStyle = [styles.button, variantButtonStyle, disabled ? styles.disabledButton : null, style];
  const textStyle = [
    styles.buttonText,
    variantTextStyle as TextStyle,
    disabled ? styles.disabledButtonText : null,
  ];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [buttonStyle, pressed && !disabled ? styles.pressed : null]}
    >
      {icon ? (
        <MaterialCommunityIcons
          name={icon}
          size={18}
          color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : colors.primaryDark}
        />
      ) : null}
      <Text style={textStyle}>{label}</Text>
    </Pressable>
  );
}

export function MetricTile({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}) {
  const toneColor =
    tone === 'success'
      ? colors.green
      : tone === 'warning'
        ? '#9A6400'
        : tone === 'danger'
          ? colors.coral
          : colors.ink;

  return (
    <View style={styles.metricTile}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, { color: toneColor }]}>{value}</Text>
    </View>
  );
}

export function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.progressRow}>
      {Array.from({ length: total }, (_, index) => (
        <View
          key={index}
          style={[
            styles.progressDot,
            index <= current ? styles.progressDotActive : styles.progressDotInactive,
          ]}
        />
      ))}
    </View>
  );
}

export function EmptyState({
  title,
  body,
  icon = 'information-outline',
}: {
  title: string;
  body: string;
  icon?: IconName;
}) {
  return (
    <Card style={styles.emptyCard}>
      <MaterialCommunityIcons name={icon} size={28} color={colors.primary} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
    </Card>
  );
}

export function ExternalLinkCard({
  title,
  description,
  url,
  icon = 'open-in-new',
}: {
  title: string;
  description: string;
  url: string;
  icon?: IconName;
}) {
  return (
    <Pressable
      accessibilityRole="link"
      onPress={() => Linking.openURL(url)}
      style={({ pressed }) => [styles.linkCard, pressed ? styles.pressed : null]}
    >
      <View style={styles.linkIcon}>
        <MaterialCommunityIcons name={icon} size={20} color={colors.primaryDark} />
      </View>
      <View style={styles.linkTextWrap}>
        <Text style={styles.linkTitle}>{title}</Text>
        <Text style={styles.linkDescription}>{description}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={22} color={colors.softText} />
    </Pressable>
  );
}

export function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  header: {
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    ...shadow,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.ink,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: 0,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadow,
  },
  primaryAccent: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  amberAccent: {
    borderLeftWidth: 4,
    borderLeftColor: colors.amber,
  },
  coralAccent: {
    borderLeftWidth: 4,
    borderLeftColor: colors.coral,
  },
  blueAccent: {
    borderLeftWidth: 4,
    borderLeftColor: colors.blue,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  sectionHeader: {
    gap: 4,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
  },
  sectionCaption: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    minHeight: 48,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: '#B9E5DC',
  },
  ghostButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dangerButton: {
    backgroundColor: colors.coral,
  },
  buttonText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: colors.primaryDark,
  },
  ghostButtonText: {
    color: colors.primaryDark,
  },
  dangerButtonText: {
    color: '#FFFFFF',
  },
  disabledButton: {
    opacity: 0.55,
  },
  disabledButtonText: {
    color: colors.softText,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
  metricTile: {
    flex: 1,
    minWidth: 136,
    backgroundColor: '#F7FAFA',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 6,
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
  },
  metricValue: {
    color: colors.ink,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressDot: {
    flex: 1,
    height: 5,
    borderRadius: 999,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
  },
  progressDotInactive: {
    backgroundColor: '#D7E1E3',
  },
  emptyCard: {
    alignItems: 'flex-start',
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '800',
  },
  emptyBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  linkIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkTextWrap: {
    flex: 1,
    gap: 3,
  },
  linkTitle: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
  },
  linkDescription: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F2',
  },
  detailLabel: {
    flex: 1,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  detailValue: {
    flex: 1,
    color: colors.ink,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '800',
    textAlign: 'right',
  },
});
