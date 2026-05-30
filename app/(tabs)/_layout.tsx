import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router/js-tabs';

import { colors } from '@/src/constants/theme';

export const unstable_settings = {
  initialRouteName: 'home',
};

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '800',
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: colors.border,
          height: 68,
          paddingTop: 8,
          paddingBottom: 10,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="view-dashboard-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="loans"
        options={{
          title: 'Loans',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="credit-card-search-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="apply"
        options={{
          title: 'Apply',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="file-document-edit-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="status"
        options={{
          title: 'Status',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="timeline-check-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: 'Help',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="school-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
