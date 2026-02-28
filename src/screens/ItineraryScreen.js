import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { DAYS } from '../data/weather';
import DaySelector from '../components/DaySelector';
import WeatherBar from '../components/WeatherBar';
import ActivityCard from '../components/ActivityCard';
import { DARK, GRAY, ACCENT, LIGHT_BG } from '../theme';

function DayProgress({ activities }) {
  const all = [...(activities.morning || []), ...(activities.afternoon || []), ...(activities.evening || [])];
  if (!all.length) return null;
  const done = all.filter(a => a.status === 'done').length;
  const pct = Math.round((done / all.length) * 100);
  return (
    <View style={styles.progress}>
      <View style={styles.progressRow}>
        <Text style={styles.progressText}>{done}/{all.length} done</Text>
        <Text style={styles.progressText}>{pct}%</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${pct}%` }]} />
      </View>
    </View>
  );
}

function TimeSection({ label, emoji, activities, onUpdate, onSwap, dayId, settings }) {
  if (!activities || !activities.length) return null;
  return (
    <View style={{ marginBottom: 20 }}>
      <View style={styles.sectionHeader}>
        <Text style={{ fontSize: 18 }}>{emoji}</Text>
        <Text style={styles.sectionLabel}>{label}</Text>
        <Text style={styles.sectionCount}>{activities.length}</Text>
      </View>
      {activities.map(a => (
        <ActivityCard key={a.id} activity={a} onUpdate={onUpdate} onSwap={onSwap} dayId={dayId} settings={settings} />
      ))}
    </View>
  );
}

export default function ItineraryScreen({ activities, setActivities, selectedDay, setSelectedDay, settings }) {
  const [refreshing, setRefreshing] = useState(false);
  const day = DAYS[selectedDay];
  const da = activities[selectedDay] || { morning: [], afternoon: [], evening: [] };

  const update = (id, st) => {
    setActivities(prev => {
      const u = { ...prev };
      const d = { ...u[selectedDay] };
      for (const s of ['morning', 'afternoon', 'evening']) {
        d[s] = d[s].map(a => a.id === id ? { ...a, status: st } : a);
      }
      u[selectedDay] = d;
      return u;
    });
  };

  const swap = (id, newActivity) => {
    setActivities(prev => {
      const u = { ...prev };
      const d = { ...u[selectedDay] };
      for (const s of ['morning', 'afternoon', 'evening']) {
        d[s] = d[s].map(a => a.id === id ? { ...newActivity, id } : a);
      }
      u[selectedDay] = d;
      return u;
    });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const empty = !da.morning.length && !da.afternoon.length && !da.evening.length;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: LIGHT_BG }}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={ACCENT} colors={[ACCENT]} />}
    >
      <DaySelector selectedDay={selectedDay} onSelect={setSelectedDay} />
      <View style={styles.dayHeader}>
        <Text style={styles.dayTitle}>{day.title}</Text>
        <Text style={styles.dayDate}>{day.date}</Text>
      </View>
      <WeatherBar dayId={selectedDay} />
      <DayProgress activities={da} />
      {empty ? (
        <View style={styles.empty}>
          <Text style={{ fontSize: 48, marginBottom: 12 }}>🗓️</Text>
          <Text style={styles.emptyText}>No activities yet</Text>
        </View>
      ) : (
        <>
          <TimeSection label="Morning" emoji="🌅" activities={da.morning} onUpdate={update} onSwap={swap} dayId={selectedDay} settings={settings} />
          <TimeSection label="Afternoon" emoji="☀️" activities={da.afternoon} onUpdate={update} onSwap={swap} dayId={selectedDay} settings={settings} />
          <TimeSection label="Evening" emoji="🌙" activities={da.evening} onUpdate={update} onSwap={swap} dayId={selectedDay} settings={settings} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 100 },
  dayHeader: { marginTop: 8, marginBottom: 12 },
  dayTitle: { fontSize: 22, fontWeight: '800', color: DARK },
  dayDate: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  progress: { marginBottom: 16 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressText: { fontSize: 12, color: '#6B7280' },
  progressBar: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: ACCENT, borderRadius: 3 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  sectionLabel: { fontWeight: '700', fontSize: 14, color: DARK, textTransform: 'uppercase', letterSpacing: 0.5, marginLeft: 8 },
  sectionCount: { fontSize: 12, color: GRAY, marginLeft: 8 },
  empty: { alignItems: 'center', padding: 48 },
  emptyText: { fontSize: 15, fontWeight: '500', color: GRAY },
});
