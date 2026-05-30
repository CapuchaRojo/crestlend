import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { Linking, StyleSheet, Text, View } from 'react-native';

import { ActionButton, AppScreen, Badge, Card } from '@/src/components/ui';
import { creditCrestLinks } from '@/src/data/demoData';
import { colors, radii, spacing } from '@/src/constants/theme';

const trustPoints = [
  'Synthetic offers only',
  'No SSNs, bank logins, bureau credentials, or document uploads',
  'No real approval, denial, funding, or lender matching',
];

export default function OnboardingScreen() {
  return (
    <AppScreen
      eyebrow="Welcome to CrestLend"
      title="Borrow with clarity."
      subtitle="Explore a polished lending app experience built entirely in Demo Mode."
      rightSlot={<Badge label="Sandbox" variant="demo" />}
    >
      <Card accent="primary">
        <View style={styles.logoMark}>
          <MaterialCommunityIcons name="bank-outline" size={30} color="#FFFFFF" />
        </View>
        <Text style={styles.heroTitle}>A safer way to understand lending flows.</Text>
        <Text style={styles.heroCopy}>
          CrestLend lets Maya compare products, estimate repayment, review requirements, and track a
          simulated application without collecting sensitive data.
        </Text>
        <ActionButton
          label="Explore loan options"
          icon="arrow-right"
          onPress={() => router.replace('/home')}
        />
        <ActionButton
          label="Learn first with CreditCrest AI"
          icon="school-outline"
          variant="ghost"
          onPress={() => Linking.openURL(creditCrestLinks.home)}
        />
      </Card>

      <Card accent="amber">
        <Badge label="Demo Mode disclosure" variant="warning" />
        {trustPoints.map((point) => (
          <View key={point} style={styles.trustRow}>
            <MaterialCommunityIcons name="check-circle-outline" size={19} color={colors.primary} />
            <Text style={styles.trustText}>{point}</Text>
          </View>
        ))}
      </Card>

      <Card>
        <Text style={styles.footerTitle}>Built for future integration, not live lending.</Text>
        <Text style={styles.footerCopy}>
          Future production work would require licensed partners, compliance review, privacy and
          security controls, identity verification, underwriting, and payment processing.
        </Text>
      </Card>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  logoMark: {
    width: 58,
    height: 58,
    borderRadius: radii.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    color: colors.ink,
    fontSize: 23,
    lineHeight: 30,
    fontWeight: '900',
  },
  heroCopy: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  trustText: {
    flex: 1,
    color: colors.ink,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  footerTitle: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '900',
  },
  footerCopy: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
});
