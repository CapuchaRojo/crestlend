import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, View } from 'react-native';

import { Badge, Card } from '@/src/components/ui';
import { colors, spacing } from '@/src/constants/theme';
import { futurePartnerCapabilities } from '@/src/data/demoData';

export function PartnerReadinessCard() {
  return (
    <Card accent="blue">
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="shield-key-outline" size={22} color={colors.primaryDark} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>Future partner-ready capabilities</Text>
          <Text style={styles.copy}>
            These surfaces are designed for production integration later. They are inactive in the
            sandbox and do not collect real lending data.
          </Text>
        </View>
      </View>

      <View style={styles.grid}>
        {futurePartnerCapabilities.map((capability) => (
          <View key={capability.title} style={styles.item}>
            <View style={styles.itemTop}>
              <Text style={styles.itemTitle}>{capability.title}</Text>
              <Badge label="Future" variant="neutral" />
            </View>
            <Text style={styles.itemDescription}>{capability.description}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: colors.ink,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '900',
  },
  copy: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  grid: {
    gap: spacing.sm,
  },
  item: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    gap: 5,
  },
  itemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  itemTitle: {
    flex: 1,
    color: colors.ink,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '900',
  },
  itemDescription: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
});
