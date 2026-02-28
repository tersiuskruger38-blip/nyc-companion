import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ItineraryScreen from '../screens/ItineraryScreen';
import PlacesScreen from '../screens/PlacesScreen';
import EventsScreen from '../screens/EventsScreen';
import FlightsScreen from '../screens/FlightsScreen';
import StatsScreen from '../screens/StatsScreen';
import GuideScreen from '../screens/GuideScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ChatOverlay from '../components/ChatOverlay';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../theme';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Itinerary: '📅',
  Places: '📍',
  Events: '🎪',
  Flights: '✈️',
  Stats: '📊',
  Guide: '🗽',
  Settings: '⚙️',
};

function Header() {
  const theme = useTheme();
  return (
    <View style={[styles.header, { backgroundColor: theme.headerBg }]}>
      <View>
        <Text style={[styles.headerTitle, { color: theme.headerText }]}>NYC <Text style={{ color: theme.accent }}>Companion</Text></Text>
        <Text style={styles.headerSub}>Mar 13–18, 2026 · Tersius & Suzanne</Text>
      </View>
      <View style={styles.headerRight}>
        <Text style={styles.headerHotel}>🏨 Madison LES</Text>
        <Text style={styles.headerHotel}>Lower East Side</Text>
      </View>
    </View>
  );
}

export default function TabNavigator() {
  const [chatOpen, setChatOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ paddingTop: insets.top, backgroundColor: theme.headerBg }}>
        <Header />
      </View>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{TAB_ICONS[route.name]}</Text>
          ),
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarLabelStyle: { fontSize: 9, fontWeight: '600' },
          tabBarStyle: {
            backgroundColor: theme.surface,
            borderTopColor: theme.border,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
            height: 56 + (insets.bottom > 0 ? insets.bottom : 8),
          },
        })}
      >
        <Tab.Screen name="Itinerary" component={ItineraryScreen} />
        <Tab.Screen name="Places" component={PlacesScreen} />
        <Tab.Screen name="Events" component={EventsScreen} />
        <Tab.Screen name="Flights" component={FlightsScreen} />
        <Tab.Screen name="Stats" component={StatsScreen} />
        <Tab.Screen name="Guide" component={GuideScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>

      {/* Chat FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: 64 + (insets.bottom > 0 ? insets.bottom : 8), backgroundColor: theme.accent, shadowColor: theme.accent }]}
        activeOpacity={0.8}
        onPress={() => setChatOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Open AI chat"
        accessibilityHint="Opens the AI travel buddy chat overlay"
      >
        <Text style={{ fontSize: 24 }}>💬</Text>
      </TouchableOpacity>

      <ChatOverlay visible={chatOpen} onClose={() => setChatOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '800' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  headerRight: { alignItems: 'flex-end' },
  headerHotel: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  fab: {
    position: 'absolute',
    right: 16,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});
