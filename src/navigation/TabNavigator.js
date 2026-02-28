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
import { initialActivities } from '../data/activities';
import { ACCENT, DARK, GRAY, WHITE } from '../theme';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Itinerary: '📅',
  Places: '📍',
  Events: '🎪',
  Flights: '✈️',
  Stats: '📊',
  Guide: '🗽',
};

function Header() {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerTitle}>NYC <Text style={{ color: ACCENT }}>Companion</Text></Text>
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
  const [activities, setActivities] = useState(initialActivities);
  const [selectedDay, setSelectedDay] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingTop: insets.top }}>
        <Header />
      </View>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{TAB_ICONS[route.name]}</Text>
          ),
          tabBarActiveTintColor: ACCENT,
          tabBarInactiveTintColor: GRAY,
          tabBarLabelStyle: { fontSize: 9, fontWeight: '600' },
          tabBarStyle: {
            backgroundColor: WHITE,
            borderTopColor: '#E5E7EB',
            paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
            height: 56 + (insets.bottom > 0 ? insets.bottom : 8),
          },
        })}
      >
        <Tab.Screen name="Itinerary">
          {() => (
            <ItineraryScreen
              activities={activities}
              setActivities={setActivities}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Places" component={PlacesScreen} />
        <Tab.Screen name="Events" component={EventsScreen} />
        <Tab.Screen name="Flights" component={FlightsScreen} />
        <Tab.Screen name="Stats" component={StatsScreen} />
        <Tab.Screen name="Guide" component={GuideScreen} />
      </Tab.Navigator>

      {/* Chat FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: 64 + (insets.bottom > 0 ? insets.bottom : 8) }]}
        activeOpacity={0.8}
        onPress={() => {/* Chat overlay coming later */}}
      >
        <Text style={{ fontSize: 24 }}>💬</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: DARK,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: WHITE },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  headerRight: { alignItems: 'flex-end' },
  headerHotel: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  fab: {
    position: 'absolute',
    right: 16,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});
