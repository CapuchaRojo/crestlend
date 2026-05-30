import { router } from 'expo-router';
import { Linking, StyleSheet, Text } from 'react-native';

import { PartnerReadinessCard } from '@/src/components/PartnerReadinessCard';
import { ActionButton, AppScreen, Badge, Card, ExternalLinkCard, SectionHeader } from '@/src/components/ui';
import { creditCrestLinks, helpTopics, productRelationship } from '@/src/data/demoData';
import { colors } from '@/src/constants/theme';

export default function HelpScreen() {
  return (
    <AppScreen
      eyebrow="Help and Learn"
      title="Understand before you borrow."
      subtitle="Move between lending workflow management and financial education without blurring the two."
      rightSlot={<Badge label="Education links" variant="info" />}
    >
      <Card accent="primary">
        <Text style={styles.familyTitle}>Product family relationship</Text>
        <Text style={styles.familyCopy}>
          {productRelationship.crestlend} {productRelationship.creditCrest}
        </Text>
        <ActionButton
          label="Learn with CreditCrest AI"
          icon="open-in-new"
          onPress={() => Linking.openURL(creditCrestLinks.home)}
          variant="secondary"
        />
      </Card>

      <ExternalLinkCard
        title="Learn with CreditCrest AI"
        description="Open the education companion before reviewing lending concepts or tradeoffs."
        url={creditCrestLinks.lendingLab}
        icon="school-outline"
      />

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
      <PartnerReadinessCard />
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
