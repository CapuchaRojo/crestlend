import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, View } from 'react-native';

import { Badge, Card } from '@/src/components/ui';
import { colors, spacing } from '@/src/constants/theme';

interface DocumentRequirement {
  title: string;
  description: string;
}

export function DocumentChecklist({ requirements }: { requirements: DocumentRequirement[] }) {
  return (
    <View style={styles.wrap}>
      {requirements.map((requirement) => (
        <Card key={requirement.title} style={styles.card}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name="file-lock-outline" size={22} color={colors.primaryDark} />
          </View>
          <View style={styles.textWrap}>
            <View style={styles.topLine}>
              <Text style={styles.title}>{requirement.title}</Text>
              <Badge label="Locked demo" variant="neutral" />
            </View>
            <Text style={styles.description}>{requirement.description}</Text>
            <Text style={styles.lockedText}>Document upload disabled in demo mode.</Text>
          </View>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    gap: 6,
  },
  topLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    color: colors.ink,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
  },
  description: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  lockedText: {
    color: colors.primaryDark,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '800',
  },
});
