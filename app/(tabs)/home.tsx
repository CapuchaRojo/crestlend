import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { Linking, StyleSheet, Text, View } from 'react-native';

import { ActionButton, AppScreen, Badge, Card, ExternalLinkCard, MetricTile, SectionHeader } from '@/src/components/ui';
import { creditCrestLinks, exampleApplication, mayaProfile } from '@/src/data/demoData';
import { colors, radii, spacing } from '@/src/constants/theme';
import { formatCurrency } from '@/src/lib/formatters';

export default function HomeScreen() {
  return (
    <AppScreen
      eyebrow="CrestLend"
      title="Borrow with clarity."
      subtitle="A simulated lending app for comparing synthetic products, estimating payments, and learning before applying."
      rightSlot={<Badge label="Demo Mode" variant="demo" />}
    >
      <Card accent="primary">
        <View style={styles.profileTop}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>M</Text>
          </View>
          <View style={styles.profileCopy}>
            <Text style={styles.profileName}>{mayaProfile.name}</Text>
            <Text style={styles.profileStatus}>{mayaProfile.borrowerStatus}</Text>
          </View>
          <Badge label={mayaProfile.readiness} variant="warning" />
        </View>

        <View style={styles.metricRow}>
          <MetricTile label="Estimated income" value={formatCurrency(mayaProfile.estimatedMonthlyIncome)} />
          <MetricTile label="Obligations" value={formatCurrency(mayaProfile.currentMonthlyObligations)} />
        </View>
        <View style={styles.metricRow}>
          <MetricTile label="Utilization" value={`${mayaProfile.currentCreditUtilization}%`} tone="warning" />
          <MetricTile label="Recent inquiries" value={`${mayaProfile.recentInquiries}`} />
        </View>

        <View style={styles.notice}>
          <MaterialCommunityIcons name="shield-check-outline" size={19} color={colors.primaryDark} />
          <Text style={styles.noticeText}>
            CrestLend does not collect SSNs, bank logins, bureau credentials, or real documents.
          </Text>
        </View>
      </Card>

      <SectionHeader title="Dashboard" caption="Synthetic account state for the demo borrower." />
      <Card>
        <View style={styles.statusLine}>
          <Text style={styles.statusLabel}>Active simulated application</Text>
          <Badge label="In progress" variant="info" />
        </View>
        <Text style={styles.statusTitle}>{exampleApplication.purpose}</Text>
        <Text style={styles.statusBody}>
          Maya has one sandbox application in document-pending status. This is not a real approval,
          denial, or lender review.
        </Text>
        <ActionButton
          label="View status tracker"
          icon="timeline-check-outline"
          onPress={() => router.push('/status')}
        />
      </Card>

      <SectionHeader title="Quick actions" />
      <View style={styles.actionGrid}>
        <ActionButton
          label="Compare loans"
          icon="compare-horizontal"
          variant="secondary"
          style={styles.gridButton}
          onPress={() => router.push('/loans')}
        />
        <ActionButton
          label="Start application"
          icon="file-document-edit-outline"
          style={styles.gridButton}
          onPress={() => router.push('/apply')}
        />
        <ActionButton
          label="Repayment estimate"
          icon="calendar-month-outline"
          variant="ghost"
          style={styles.gridButton}
          onPress={() => router.push('/repayment')}
        />
        <ActionButton
          label="Learn first"
          icon="school-outline"
          variant="ghost"
          style={styles.gridButton}
          onPress={() => Linking.openURL(creditCrestLinks.home)}
        />
      </View>

      <ExternalLinkCard
        title="Learn with CreditCrest AI"
        description="Open the education and simulation app for credit and loan concepts."
        url={creditCrestLinks.lendingLab}
        icon="lightbulb-on-outline"
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  profileCopy: {
    flex: 1,
  },
  profileName: {
    color: colors.ink,
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '900',
  },
  profileStatus: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  metricRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  notice: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    backgroundColor: colors.primarySoft,
    padding: spacing.sm,
    borderRadius: radii.md,
  },
  noticeText: {
    flex: 1,
    color: colors.primaryDark,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  statusLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  statusLabel: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  statusTitle: {
    color: colors.ink,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '900',
  },
  statusBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gridButton: {
    flexBasis: '48%',
    flexGrow: 1,
  },
});
