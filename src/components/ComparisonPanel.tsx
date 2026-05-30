import { StyleSheet, Text, View } from 'react-native';

import { creditCrestLinks } from '@/src/data/demoData';
import { Badge, Card, DetailRow, EmptyState, ExternalLinkCard, SectionHeader } from '@/src/components/ui';
import { colors, spacing } from '@/src/constants/theme';
import { formatBurden, formatCurrency, formatPercent } from '@/src/lib/formatters';
import type { LoanComparisonResult } from '@/src/types/lending';

function readinessVariant(level: string) {
  if (level === 'Ready to compare') {
    return 'success' as const;
  }

  if (level === 'High caution') {
    return 'danger' as const;
  }

  return 'warning' as const;
}

export function ComparisonPanel({ results }: { results: LoanComparisonResult[] }) {
  if (results.length < 2) {
    return (
      <View style={styles.wrap}>
        <SectionHeader
          title="Loan comparison"
          caption="Select two or three synthetic offers to compare payments, cost, burden, and readiness."
        />
        <EmptyState
          icon="compare-horizontal"
          title="Choose at least two offers"
          body="Tap Compare on loan cards to build a side-by-side demo comparison."
        />
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <SectionHeader
        title="Loan comparison"
        caption="Directional results only. No real offer, approval, denial, or official score prediction."
      />
      {results.map((result) => (
        <Card key={result.offerId} accent={result.readiness.directionalRisk === 'Significant risk' ? 'coral' : 'primary'}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultName}>{result.name}</Text>
            <Badge
              label={result.readiness.level}
              variant={readinessVariant(result.readiness.level)}
            />
          </View>
          <View style={styles.details}>
            <DetailRow label="Principal" value={formatCurrency(result.principal)} />
            <DetailRow label="APR" value={formatPercent(result.apr)} />
            <DetailRow label="Term" value={`${result.months} months`} />
            <DetailRow label="Monthly payment" value={formatCurrency(result.monthlyPayment)} />
            <DetailRow label="Total repayment" value={formatCurrency(result.totalRepayment)} />
            <DetailRow label="Total interest" value={formatCurrency(result.totalInterest)} />
            <DetailRow
              label="Payment burden"
              value={`${formatBurden(result.paymentBurden)} - ${result.paymentBurdenLevel}`}
            />
            <DetailRow label="Funding speed" value={result.fundingSpeedEstimate} />
          </View>
          <Text style={styles.listTitle}>Pros</Text>
          {result.pros.map((item) => (
            <Text key={item} style={styles.listItem}>
              + {item}
            </Text>
          ))}
          <Text style={styles.listTitle}>Cons</Text>
          {result.cons.map((item) => (
            <Text key={item} style={styles.listItem}>
              - {item}
            </Text>
          ))}
        </Card>
      ))}
      <ExternalLinkCard
        title="Learn what this means"
        description="Open CreditCrest AI Calculator Hub for payment and APR education."
        url={creditCrestLinks.calculatorHub}
        icon="calculator-variant-outline"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  resultName: {
    flex: 1,
    color: colors.ink,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '800',
  },
  details: {
    marginTop: 2,
  },
  listTitle: {
    color: colors.ink,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  listItem: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
});
