import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ComparisonPanel } from '@/src/components/ComparisonPanel';
import { LoanCard } from '@/src/components/LoanCard';
import { PartnerReadinessCard } from '@/src/components/PartnerReadinessCard';
import { AppScreen, Badge, Card, SectionHeader } from '@/src/components/ui';
import { loanOffers } from '@/src/data/demoData';
import { colors, spacing } from '@/src/constants/theme';
import { useSandboxProfile } from '@/src/context/SandboxProfileContext';
import { compareLoanOffers } from '@/src/lib/lendingEngine';

export default function LoanMarketplaceScreen() {
  const { profile } = useSandboxProfile();
  const [selectedOfferIds, setSelectedOfferIds] = useState<string[]>([
    'personal-starter',
    'credit-builder',
  ]);

  const selectedOffers = useMemo(
    () => loanOffers.filter((offer) => selectedOfferIds.includes(offer.id)),
    [selectedOfferIds]
  );
  const comparisonResults = useMemo(
    () => compareLoanOffers(selectedOffers, profile),
    [profile, selectedOffers]
  );

  function toggleOffer(offerId: string) {
    setSelectedOfferIds((current) => {
      if (current.includes(offerId)) {
        return current.filter((id) => id !== offerId);
      }

      if (current.length >= 3) {
        return [...current.slice(1), offerId];
      }

      return [...current, offerId];
    });
  }

  return (
    <AppScreen
      eyebrow="Loan Marketplace"
      title="Compare lending paths."
      subtitle="Evaluate synthetic products with production-style payment, burden, and readiness signals."
      rightSlot={<Badge label="Synthetic offers" variant="demo" />}
    >
      <Card accent="amber">
        <Text style={styles.disclosureTitle}>Marketplace disclosure</Text>
        <Text style={styles.disclosureText}>
          These are not real lender offers. CrestLend does not guarantee approval, deny users, or
          match borrowers with lenders in this sandbox. Future live offers would require licensed
          lender partners and jurisdiction-specific compliance review.
        </Text>
      </Card>
      <Card accent="blue">
        <Text style={styles.disclosureTitle}>Using {profile.borrowerStatus.toLowerCase()}</Text>
        <Text style={styles.disclosureText}>
          Comparisons use the local sandbox income, obligations, desired amount, and payment
          comfort for {profile.name}. Stored locally on this device/browser only.
        </Text>
      </Card>

      <ComparisonPanel results={comparisonResults} />
      <PartnerReadinessCard />

      <SectionHeader
        title="Browse offers"
        caption="Select up to three offers. Choosing a fourth replaces the oldest comparison slot."
      />
      <View style={styles.list}>
        {loanOffers.map((offer) => (
          <LoanCard
            key={offer.id}
            offer={offer}
            selected={selectedOfferIds.includes(offer.id)}
            onCompare={() => toggleOffer(offer.id)}
            onStart={() => router.push('/apply')}
            onRepayment={() =>
              router.push({ pathname: '/repayment', params: { offerId: offer.id } })
            }
          />
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  disclosureTitle: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '900',
  },
  disclosureText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  list: {
    gap: spacing.md,
  },
});
