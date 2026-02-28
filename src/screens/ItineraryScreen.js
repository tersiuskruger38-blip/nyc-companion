import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, StyleSheet } from 'react-native';
import { DAYS } from '../data/weather';
import DaySelector from '../components/DaySelector';
import WeatherBar from '../components/WeatherBar';
import ActivityCard from '../components/ActivityCard';
import AddActivityModal from '../components/AddActivityModal';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../theme';

function DayProgress({ activities }) {
  const theme = useTheme();
  const all = [...(activities.morning || []), ...(activities.afternoon || []), ...(activities.evening || [])];
  if (!all.length) return null;
  const done = all.filter(a => a.status === 'done').length;
  const pct = Math.round((done / all.length) * 100);
  return (
    <View style={styles.progress}>
      <View style={styles.progressRow}>
        <Text style={[styles.progressText, { color: theme.textTertiary }]}>{done}/{all.length} done</Text>
        <Text style={[styles.progressText, { color: theme.textTertiary }]}>{pct}%</Text>
      </View>
      <View style={[styles.progressBar, { backgroundColor: theme.border }]}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: pct }}
        accessibilityLabel={`Day progress: ${done} of ${all.length} activities done`}
      >
        <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: theme.accent }]} />
      </View>
    </View>
  );
}

function TimeSection({ label, emoji, activities, dayId }) {
  const { dispatch, state } = useAppContext();
  if (!activities || !activities.length) return null;
  const sorted = [...activities].sort((a, b) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0));

  const onUpdate = (id, status) => {
    dispatch({ type: 'UPDATE_ACTIVITY_STATUS', payload: { dayId, activityId: id, status } });
  };
  const onSwap = (id, newActivity) => {
    dispatch({ type: 'SWAP_ACTIVITY', payload: { dayId, activityId: id, newActivity } });
  };
  const onFieldUpdate = (id, field, value) => {
    dispatch({ type: 'UPDATE_ACTIVITY_FIELD', payload: { dayId, activityId: id, field, value } });
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <View style={styles.sectionHeader} accessibilityRole="header">
        <Text style={{ fontSize: 18 }} accessibilityLabel={label}>{emoji}</Text>
        <Text style={styles.sectionLabel}>{label}</Text>
        <Text style={styles.sectionCount}>{activities.length}</Text>
      </View>
      {sorted.map(a => (
        <ActivityCard key={a.id} activity={a} onUpdate={onUpdate} onSwap={onSwap} onFieldUpdate={onFieldUpdate} dayId={dayId} />
      ))}
    </View>
  );
}

export default function ItineraryScreen() {
  const { state, dispatch } = useAppContext();
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const { activities, selectedDay } = state;
  const day = DAYS[selectedDay];
  const da = activities[selectedDay] || { morning: [], afternoon: [], evening: [] };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const empty = !da.morning.length && !da.afternoon.length && !da.evening.length;

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.accent} colors={[theme.accent]} />}
      >
        <DaySelector />
        <View style={styles.dayHeader}>
          <Text style={[styles.dayTitle, { color: theme.text }]} accessibilityRole="header">{day.title}</Text>
          <Text style={[styles.dayDate, { color: theme.textTertiary }]}>{day.date}</Text>
        </View>
        <WeatherBar />
        <DayProgress activities={da} />
        {empty ? (
          <View style={styles.empty}>
            <Text style={{ fontSize: 48, marginBottom: 12 }} accessibilityLabel="Calendar">🗓️</Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No activities yet</Text>
            <Text style={[styles.emptyHint, { color: theme.textSecondary }]}>Tap + to add one</Text>
          </View>
        ) : (
          <>
            <TimeSection label="Morning" emoji="🌅" activities={da.morning} dayId={selectedDay} />
            <TimeSection label="Afternoon" emoji="☀️" activities={da.afternoon} dayId={selectedDay} />
            <TimeSection label="Evening" emoji="🌙" activities={da.evening} dayId={selectedDay} />
          </>
        )}
      </ScrollView>

      {/* FAB to add activity */}
      <TouchableOpacity
        style={[styles.addFab, { backgroundColor: theme.accent }]}
        onPress={() => setShowAddModal(true)}
        accessibilityRole="button"
        accessibilityLabel="Add activity"
        accessibilityHint="Opens form to add a custom activity to this day"
      >
        <Text style={styles.addFabText}>+</Text>
      </TouchableOpacity>

      <AddActivityModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        dayId={selectedDay}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 100 },
  dayHeader: { marginTop: 8, marginBottom: 12 },
  dayTitle: { fontSize: 22, fontWeight: '800' },
  dayDate: { fontSize: 14, marginTop: 2 },
  progress: { marginBottom: 16 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressText: { fontSize: 12 },
  progressBar: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  sectionLabel: { fontWeight: '700', fontSize: 14, color: '#1F2937', textTransform: 'uppercase', letterSpacing: 0.5, marginLeft: 8 },
  sectionCount: { fontSize: 12, color: '#9CA3AF', marginLeft: 8 },
  empty: { alignItems: 'center', padding: 48 },
  emptyText: { fontSize: 15, fontWeight: '500' },
  emptyHint: { fontSize: 13, marginTop: 4 },
  addFab: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  addFabText: { fontSize: 28, fontWeight: '600', color: '#FFFFFF', marginTop: -2 },
});
