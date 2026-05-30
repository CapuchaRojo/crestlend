import { router } from 'expo-router';
import { Linking, StyleSheet, Text } from 'react-native';

import { ActionButton, AppScreen, Badge, Card, ExternalLinkCard, SectionHeader } from '@/src/components/ui';
import { creditCrestLinks, helpTopics } from '@/src/data/demoData';
import { colors } from '@/src/constants/theme';

export default function HelpScreen() {
  return (
    <AppScreen
      eyebrow="Help and Learn"
      title="Understand before you borrow."
      subtitle="CrestLend handles simulated application flows. CreditCrest AI handles education, calculators, and methodology."
      rightSlot={<Badge label="Education links" variant="info" />}
    >
      <Card accent="primary">
        <Text style={styles.familyTitle}>Product family</Text>
        <Text style={styles.familyCopy}>
          CrestLend is application-first. CreditCrest AI is education-first. Help links open
          CreditCrest AI so lending decisions remain grounded in clear, directional learning.
        </Text>
        <ActionButton
          label="Open CreditCrest AI"
          icon="open-in-new"
          onPress={() => Linking.openURL(creditCrestLinks.home)}
          variant="secondary"
        />
      </Card>

      <SectionHeader title="CreditCrest AI guides" caption="Each item opens a public education page." />
      {helpTopics.map((topic) => (
        <ExternalLinkCard
          key={topic.title}
          title={topic.title}
          description={topic.description}
          url={topic.url}
          icon="book-open-page-variant-outline"
        />
      ))}

      <SectionHeader title="Compliance" />
      <ExternalLinkCard
        title="CreditCrest AI methodology"
        description="Review deterministic, educational methodology context."
        url={creditCrestLinks.methodology}
        icon="clipboard-text-search-outline"
      />
      <Card accent="amber">
        <Text style={styles.familyTitle}>CrestLend disclosures</Text>
        <Text style={styles.familyCopy}>
          Review why this demo avoids real lender offers, sensitive identifiers, document uploads,
          and real approval decisions.
        </Text>
        <ActionButton
          label="View disclosures"
          icon="shield-alert-outline"
          onPress={() => router.push('/disclosures')}
        />
      </Card>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  familyTitle: {
    color: colors.ink,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '900',
  },
  familyCopy: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
});
