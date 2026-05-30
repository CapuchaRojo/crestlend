import { router } from 'expo-router';

import { ActionButton, AppScreen, EmptyState } from '@/src/components/ui';

export default function NotFoundScreen() {
  return (
    <AppScreen>
      <EmptyState
        icon="map-marker-question-outline"
        title="Screen not found"
        body="This CrestLend route is not part of the demo experience."
      />
      <ActionButton label="Go home" icon="home-outline" onPress={() => router.replace('/home')} />
    </AppScreen>
  );
}
