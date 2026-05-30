import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PartnerReadinessCard } from '@/src/components/PartnerReadinessCard';
import {
  ActionButton,
  AppScreen,
  Badge,
  Card,
  DetailRow,
  ExternalLinkCard,
  MetricTile,
  SectionHeader,
} from '@/src/components/ui';
import { creditCrestLinks, loanOffers } from '@/src/data/demoData';
import { colors, radii, spacing } from '@/src/constants/theme';
import {
  calculateMonthlyPayment,
  calculateTotalInterest,
  calculateTotalRepayment,
  generateRepaymentSchedule,
} from '@/src/lib/lendingEngine';
import { formatCurrency, formatPercent } from '@/src/lib/formatters';

export default function RepaymentScreen() {
  const { offerId } = useLocalSearchParams<{ offerId?: string }>();
  const [selectedOfferId, setSelectedOfferId] = useState(offerId ?? 'personal-starter');

  const selectedOffer = useMemo(
    () => loanOffers.find((offer) => offer.id === selectedOfferId) ?? loanOffers[0],
    [selectedOfferId]
  );
  const monthlyPayment = calculateMonthlyPayment(
    selectedOffer.principal,
    selectedOffer.apr,
    selectedOffer.months
  );
  const totalRepayment = calculateTotalRepayment(monthlyPayment, selectedOffer.months);
  const totalInterest = calculateTotalInterest(totalRepayment, selectedOffer.principal);
  const schedule = generateRepaymentSchedule(selectedOffer, '2026-06-15');

  return (
    <AppScreen
      eyebrow="Repayment Schedule"
      title="Manage repayment readiness."
      subtitle="Review the payment path for a synthetic loan before any future partner servicing integration."
      rightSlot={<Badge label="Estimate only" variant="demo" />}
    >
      <ActionButton label="Back" icon="arrow-left" variant="ghost" onPress={() => router.back()} />

      <View style={styles.offerSelector}>
        {loanOffers.map((offer) => (
          <Pressable
            key={offer.id}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedOffer.id === offer.id }}
            onPress={() => setSelectedOfferId(offer.id)}
            style={({ pressed }) => [
              styles.offerPill,
              selectedOffer.id === offer.id ? styles.offerPillActive : null,
              pressed ? styles.pressed : null,
            ]}
          >
            <Text
              style={[
                styles.offerPillText,
                selectedOffer.id === offer.id ? styles.offerPillTextActive : null,
              ]}
            >
              {offer.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <Card accent="primary">
        <View style={styles.summaryHeader}>
          <View style={styles.summaryTitleWrap}>
            <Text style={styles.offerName}>{selectedOffer.name}</Text>
            <Text style={styles.offerMeta}>
              {formatCurrency(selectedOffer.principal)} at {formatPercent(selectedOffer.apr)} APR
            </Text>
          </View>
          <Badge label={selectedOffer.disclosureBadge} variant="neutral" />
        </View>
        <View style={styles.metricRow}>
          <MetricTile label="Monthly payment" value={formatCurrency(monthlyPayment)} />
          <MetricTile label="Total repayment" value={formatCurrency(totalRepayment)} />
        </View>
        <View style={styles.metricRow}>
          <MetricTile label="Total interest" value={formatCurrency(totalInterest)} />
          <MetricTile label="Term" value={`${selectedOffer.months} months`} />
        </View>
      </Card>

      <ExternalLinkCard
        title="Learn with CreditCrest AI"
        description="Understand monthly payment, APR, and payment burden before reviewing the schedule."
        url={creditCrestLinks.calculatorHub}
        icon="school-outline"
      />

      <SectionHeader
        title="Schedule"
        caption="Due dates begin June 15, 2026 for demo consistency."
      />
      <Card>
        {schedule.map((item) => (
          <View key={item.installment} style={styles.scheduleRow}>
            <View style={styles.scheduleTop}>
              <Text style={styles.installment}>Payment {item.installment}</Text>
              <Text style={styles.payment}>{formatCurrency(item.payment)}</Text>
            </View>
            <DetailRow label="Due date" value={item.dueDate} />
            <DetailRow label="Principal" value={formatCurrency(item.principal)} />
            <DetailRow label="Interest" value={formatCurrency(item.interest)} />
            <DetailRow label="Remaining balance" value={formatCurrency(item.remainingBalance)} />
          </View>
        ))}
      </Card>

      <Card accent="amber">
        <Text style={styles.noteTitle}>Early payoff note</Text>
        <Text style={styles.noteText}>
          Paying early can reduce interest in many real loans, but this demo does not calculate fees,
          payoff quotes, or lender-specific rules.
        </Text>
      </Card>
      <Card accent="coral">
        <Text style={styles.noteTitle}>Missed payment warning</Text>
        <Text style={styles.noteText}>
          Missing payments may lead to fees, collections, or credit consequences in real products.
          CrestLend does not predict official score changes.
        </Text>
      </Card>
      <PartnerReadinessCard />
      <ExternalLinkCard
        title="Open CreditCrest AI Calculator Hub"
        description="Go deeper on payment impact and sustainability concepts."
        url={creditCrestLinks.calculatorHub}
        icon="calculator-variant-outline"
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  offerSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  offerPill: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  offerPillActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  offerPillText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
  },
  offerPillTextActive: {
    color: colors.primaryDark,
  },
  pressed: {
    opacity: 0.78,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  summaryTitleWrap: {
    flex: 1,
    gap: 3,
  },
  offerName: {
    color: colors.ink,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '900',
  },
  offerMeta: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  metricRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  scheduleRow: {
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scheduleTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: 4,
  },
  installment: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900',
  },
  payment: {
    color: colors.primaryDark,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900',
  },
  noteTitle: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '900',
  },
  noteText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
});
