import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/src/components/ui';
import { colors, spacing } from '@/src/constants/theme';
import type { StatusTimelineItem } from '@/src/types/lending';

export function StatusTimeline({ items }: { items: StatusTimelineItem[] }) {
  return (
    <Card>
      {items.map((item, index) => {
        const complete = item.state === 'complete';
        const current = item.state === 'current';
        const iconName = complete ? 'check' : current ? 'clock-outline' : 'lock-outline';

        return (
          <View key={item.status} style={styles.row}>
            <View style={styles.markerWrap}>
              <View
                style={[
                  styles.marker,
                  complete ? styles.completeMarker : current ? styles.currentMarker : styles.lockedMarker,
                ]}
              >
                <MaterialCommunityIcons
                  name={iconName}
                  size={15}
                  color={complete || current ? '#FFFFFF' : colors.softText}
                />
              </View>
              {index < items.length - 1 ? <View style={styles.line} /> : null}
            </View>
            <View style={styles.textWrap}>
              <Text style={[styles.title, current ? styles.currentTitle : null]}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 72,
  },
  markerWrap: {
    alignItems: 'center',
  },
  marker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeMarker: {
    backgroundColor: colors.green,
  },
  currentMarker: {
    backgroundColor: colors.primary,
  },
  lockedMarker: {
    backgroundColor: '#EEF2F3',
    borderWidth: 1,
    borderColor: colors.border,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  textWrap: {
    flex: 1,
    paddingBottom: spacing.md,
  },
  title: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
  },
  currentTitle: {
    color: colors.primaryDark,
  },
  description: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3,
  },
});
