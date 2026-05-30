import { StyleSheet, Text, View } from 'react-native';

import { Badge, Card, DetailRow, ActionButton } from '@/src/components/ui';
import { colors, radii, spacing } from '@/src/constants/theme';
import { calculateMonthlyPayment } from '@/src/lib/lendingEngine';
import { formatCurrency, formatPercent } from '@/src/lib/formatters';
import type { DirectionalRisk, LoanOffer } from '@/src/types/lending';

function riskVariant(risk: DirectionalRisk) {
  if (risk === 'Helps') {
    return 'success' as const;
  }

  if (risk === 'Significant risk') {
    return 'danger' as const;
  }

  if (risk === 'Slight risk') {
    return 'warning' as const;
  }

  return 'info' as const;
}

interface LoanCardProps {
  offer: LoanOffer;
  selected?: boolean;
  onCompare: () => void;
  onStart: () => void;
  onRepayment: () => void;
}

export function LoanCard({ offer, selected = false, onCompare, onStart, onRepayment }: LoanCardProps) {
  const monthlyPayment = calculateMonthlyPayment(offer.principal, offer.apr, offer.months);

  return (
    <Card style={[styles.card, selected ? styles.selectedCard : null]}>
      <View style={styles.cardHeader}>
        <View style={styles.titleWrap}>
          <Text style={styles.name}>{offer.name}</Text>
          <Text style={styles.bestFor}>{offer.bestFor}</Text>
        </View>
        <Badge label={selected ? 'Selected' : 'Demo Mode'} variant={selected ? 'success' : 'demo'} />
      </View>

      <View style={styles.badgeRow}>
        <Badge label={offer.disclosureBadge} variant="neutral" />
        <Badge label={offer.directionalRisk} variant={riskVariant(offer.directionalRisk)} />
      </View>

      <View style={styles.summaryGrid}>
        <DetailRow
          label="Amount range"
          value={`${formatCurrency(offer.minAmount)}-${formatCurrency(offer.maxAmount)}`}
        />
        <DetailRow
          label="APR range"
          value={`${formatPercent(offer.minApr)}-${formatPercent(offer.maxApr)}`}
        />
        <DetailRow label="Term range" value={`${offer.minMonths}-${offer.maxMonths} months`} />
        <DetailRow label="Estimated monthly" value={formatCurrency(monthlyPayment)} />
      </View>

      <View style={styles.noteBox}>
        <Text style={styles.noteText}>All offers are synthetic and cannot approve or deny a real borrower.</Text>
      </View>

      <View style={styles.actions}>
        <ActionButton
          label={selected ? 'Remove' : 'Compare'}
          icon={selected ? 'minus-circle-outline' : 'compare-horizontal'}
          variant={selected ? 'ghost' : 'secondary'}
          style={styles.actionButton}
          onPress={onCompare}
        />
        <ActionButton
          label="Apply"
          icon="file-document-edit-outline"
          style={styles.actionButton}
          onPress={onStart}
        />
      </View>
      <ActionButton
        label="View repayment estimate"
        icon="calendar-month-outline"
        variant="ghost"
        onPress={onRepayment}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  selectedCard: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  titleWrap: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: colors.ink,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
  },
  bestFor: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  summaryGrid: {
    backgroundColor: '#F7FAFA',
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm,
  },
  noteBox: {
    backgroundColor: colors.amberSoft,
    borderRadius: radii.md,
    padding: spacing.sm,
  },
  noteText: {
    color: '#745000',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
