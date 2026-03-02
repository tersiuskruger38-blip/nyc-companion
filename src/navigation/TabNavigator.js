import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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
  Itinerary: { name: 'calendar', outline: 'calendar-outline' },
  Places: { name: 'location', outline: 'location-outline' },
  Events: { name: 'ticket', outline: 'ticket-outline' },
  Flights: { name: 'airplane', outline: 'airplane-outline' },
  Stats: { name: 'stats-chart', outline: 'stats-chart-outline' },
  Guide: { name: 'book', outline: 'book-outline' },
  Settings: { name: 'settings', outline: 'settings-outline' },
};

function Header() {
  const theme = useTheme();
  return (
    <View style={[styles.header, { backgroundColor: theme.headerBg }]}>
      <View>
        <Text style={[styles.headerTitle, { color: theme.headerText }]}>
          NYC <Text style={{ color: theme.accent }}>Companion</Text>
        </Text>
        <Text style={styles.headerSub}>Mar 13–18, 2026 · Tersius & Suzanne</Text>
      </View>
      <View style={styles.headerRight}>
        <View style={[styles.hotelPill, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
          <Text style={styles.hotelPillText}>Madison LES</Text>
          <Text style={styles.hotelPillSub}>Lower East Side</Text>
        </View>
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
        <View style={{ height: 1, backgroundColor: theme.accent }} />
      </View>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color }) => {
            const iconSet = TAB_ICONS[route.name];
            return (
              <View style={{ alignItems: 'center' }}>
                <Ionicons
                  name={focused ? iconSet.name : iconSet.outline}
                  size={22}
                  color={color}
                />
                {focused && <View style={[styles.tabDot, { backgroundColor: theme.accent }]} />}
              </View>
            );
          },
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarLabelStyle: { fontSize: 9, fontWeight: '600' },
          tabBarStyle: {
            backgroundColor: theme.surface,
            borderTopColor: theme.border,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
            height: 60 + (insets.bottom > 0 ? insets.bottom : 8),
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
        style={[styles.fab, { bottom: 68 + (insets.bottom > 0 ? insets.bottom : 8), backgroundColor: theme.accent, shadowColor: theme.accent }]}
        activeOpacity={0.8}
        onPress={() => setChatOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Open AI chat"
        accessibilityHint="Opens the AI travel buddy chat overlay"
      >
        <Ionicons name="chatbubble-ellipses" size={24} color="#FFFFFF" />
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
  headerTitle: { fontSize: 22, fontWeight: '800' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  headerRight: { alignItems: 'flex-end' },
  hotelPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignItems: 'flex-end',
  },
  hotelPillText: { fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
  hotelPillSub: { fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 1 },
  tabDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 3,
  },
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
