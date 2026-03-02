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
        <Text style={[styles.progressText, { color: theme.textSecondary }]}>{done}/{all.length} done</Text>
        <Text style={[styles.progressText, { color: theme.textSecondary }]}>{pct}%</Text>
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

function TimeSection({ label, activities, dayId }) {
  const { dispatch, state } = useAppContext();
  const theme = useTheme();
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
        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>{label}</Text>
        <View style={[styles.sectionCountBadge, { backgroundColor: theme.cardBg }]}>
          <Text style={[styles.sectionCount, { color: theme.textSecondary }]}>{activities.length}</Text>
        </View>
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
          <Text style={[styles.dayDate, { color: theme.textSecondary }]}>{day.date}</Text>
        </View>
        <WeatherBar />
        <DayProgress activities={da} />
        {empty ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No activities yet</Text>
            <Text style={[styles.emptyHint, { color: theme.textSecondary }]}>Tap + to add one</Text>
          </View>
        ) : (
          <>
            <TimeSection label="Morning" activities={da.morning} dayId={selectedDay} />
            <TimeSection label="Afternoon" activities={da.afternoon} dayId={selectedDay} />
            <TimeSection label="Evening" activities={da.evening} dayId={selectedDay} />
          </>
        )}
      </ScrollView>

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
  dayTitle: { fontSize: 20, fontWeight: '700' },
  dayDate: { fontSize: 13, marginTop: 2 },
  progress: { marginBottom: 16 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressText: { fontSize: 11 },
  progressBar: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  sectionLabel: { fontWeight: '600', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 },
  sectionCountBadge: { marginLeft: 8, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  sectionCount: { fontSize: 11, fontWeight: '600' },
  empty: { alignItems: 'center', padding: 48 },
  emptyText: { fontSize: 14 },
  emptyHint: { fontSize: 13, marginTop: 4 },
  addFab: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  addFabText: { fontSize: 26, fontWeight: '500', color: '#FFFFFF', marginTop: -2 },
});
