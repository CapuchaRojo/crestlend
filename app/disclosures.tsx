import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { ActionButton, AppScreen, Badge, Card, ExternalLinkCard, SectionHeader } from '@/src/components/ui';
import { creditCrestLinks, disclosureItems } from '@/src/data/demoData';
import { colors } from '@/src/constants/theme';

export default function DisclosuresScreen() {
  return (
    <AppScreen
      eyebrow="Compliance"
      title="Demo disclosures"
      subtitle="CrestLend is a sandbox lending experience. It is not a lender, broker, underwriter, or loan servicer."
      rightSlot={<Badge label="Required reading" variant="warning" />}
    >
      <ActionButton label="Back" icon="arrow-left" variant="ghost" onPress={() => router.back()} />

      <SectionHeader title="CrestLend demo mode disclosure" />
      {disclosureItems.map((item) => (
        <Card key={item.title}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.body}>{item.body}</Text>
        </Card>
      ))}

      <Card accent="coral">
        <Text style={styles.title}>Production readiness boundary</Text>
        <Text style={styles.body}>
          Before any real lending use, CrestLend would need licensing review, partner compliance,
          APR and adverse-action workflows, privacy policy, consent management, secure document
          handling, audit logging, monitoring, and a security program.
        </Text>
      </Card>

      <ExternalLinkCard
        title="CreditCrest AI methodology"
        description="Open the related education app methodology page."
        url={creditCrestLinks.methodology}
        icon="clipboard-text-search-outline"
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '900',
  },
  body: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
});
