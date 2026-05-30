import { StyleSheet, Text, View } from 'react-native';

import { DocumentChecklist } from '@/src/components/DocumentChecklist';
import { PartnerReadinessCard } from '@/src/components/PartnerReadinessCard';
import { StatusTimeline } from '@/src/components/StatusTimeline';
import { AppScreen, Badge, Card, DetailRow, ExternalLinkCard, SectionHeader } from '@/src/components/ui';
import {
  creditCrestLinks,
  documentRequirements,
  exampleApplication,
  loanOffers,
} from '@/src/data/demoData';
import { colors, spacing } from '@/src/constants/theme';
import { formatCurrency } from '@/src/lib/formatters';
import { generateStatusTimeline } from '@/src/lib/lendingEngine';

export default function StatusScreen() {
  const timeline = generateStatusTimeline(exampleApplication);
  const offer = loanOffers.find((item) => item.id === exampleApplication.selectedOfferId);

  return (
    <AppScreen
      eyebrow="Application Status"
      title="Manage the lending journey."
      subtitle="A simulated tracker shows how future lender-ready milestones could be organized."
      rightSlot={<Badge label="Simulated" variant="demo" />}
    >
      <Card accent="blue">
        <View style={styles.summaryHeader}>
          <View>
            <Text style={styles.summaryEyebrow}>Example application</Text>
            <Text style={styles.summaryTitle}>{exampleApplication.id}</Text>
          </View>
          <Badge label="Documents pending" variant="warning" />
        </View>
        <DetailRow label="Applicant" value={exampleApplication.applicantName} />
        <DetailRow label="Purpose" value={exampleApplication.purpose} />
        <DetailRow label="Requested amount" value={formatCurrency(exampleApplication.requestedAmount)} />
        <DetailRow label="Synthetic offer" value={offer?.name ?? 'Synthetic offer'} />
        <Text style={styles.summaryCopy}>
          Statuses are local and educational. They do not represent underwriting, approval, denial,
          funding, or servicing activity.
        </Text>
      </Card>

      <SectionHeader
        title="Timeline"
        caption="A production app would connect this to compliant partner systems after launch readiness."
      />
      <StatusTimeline items={timeline} />

      <SectionHeader
        title="Document checklist"
        caption="Common categories are shown for education. Uploads are locked in this demo."
      />
      <DocumentChecklist requirements={documentRequirements} />

      <PartnerReadinessCard />

      <ExternalLinkCard
        title="Learn with CreditCrest AI"
        description="Review loan and credit concepts before comparing products."
        url={creditCrestLinks.lendingLab}
        icon="school-outline"
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  summaryEyebrow: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  summaryTitle: {
    color: colors.ink,
    fontSize: 19,
    lineHeight: 25,
    fontWeight: '900',
  },
  summaryCopy: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
});
