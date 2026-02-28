import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { EVENTS } from '../data/events';
import { DAYS } from '../data/weather';
import { CATEGORIES } from '../data/categories';
import { CatBadge, PriceBadge } from '../components/Badges';
import { ACCENT, DARK, GRAY, WHITE, LIGHT_BG } from '../theme';

export default function EventsScreen() {
  const [selectedDay, setSelectedDay] = useState(null);
  const days = selectedDay !== null ? EVENTS.filter(e => e.day === selectedDay) : EVENTS;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.title}>What's On</Text>
      <Text style={styles.subtitle}>Events happening March 13–18</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterRow}>
        <TouchableOpacity onPress={() => setSelectedDay(null)} style={[styles.chip, selectedDay === null && styles.chipActive]}>
          <Text style={[styles.chipText, selectedDay === null && styles.chipTextActive]}>All Days</Text>
        </TouchableOpacity>
        {DAYS.map(d => (
          <TouchableOpacity key={d.id} onPress={() => setSelectedDay(d.id)} style={[styles.chip, selectedDay === d.id && styles.chipActive]}>
            <Text style={[styles.chipText, selectedDay === d.id && styles.chipTextActive]}>{d.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {days.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No events this day</Text>
        </View>
      ) : days.map(ev => {
        const cat = CATEGORIES[ev.category] || CATEGORIES.entertainment;
        return (
          <View key={ev.id} style={[styles.card, { borderLeftColor: cat.color }]}>
            <View style={styles.cardRow}>
              <Text style={styles.emoji}>{cat.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{ev.name}</Text>
                <View style={styles.badgeRow}>
                  <CatBadge cat={ev.category} />
                  <PriceBadge price={ev.price} />
                  <Text style={styles.date}>{DAYS[ev.day]?.date}</Text>
                </View>
                <Text style={styles.desc}>{ev.description}</Text>
                <Text style={styles.meta}>📍 {ev.venue} · 🕐 {ev.time}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: LIGHT_BG },
  container: { padding: 16, paddingBottom: 100 },
  title: { fontSize: 22, fontWeight: '800', color: DARK, marginBottom: 4 },
  subtitle: { fontSize: 13, color: GRAY, marginBottom: 14 },
  filterScroll: { marginBottom: 14 },
  filterRow: { gap: 6 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: WHITE },
  chipActive: { backgroundColor: ACCENT },
  chipText: { fontSize: 12, fontWeight: '600', color: DARK },
  chipTextActive: { color: WHITE },
  empty: { alignItems: 'center', padding: 40 },
  emptyText: { color: GRAY },
  card: { backgroundColor: WHITE, borderRadius: 14, padding: 14, marginBottom: 10, borderLeftWidth: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 1 },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  emoji: { fontSize: 24 },
  name: { fontWeight: '700', fontSize: 15, color: DARK },
  badgeRow: { flexDirection: 'row', gap: 6, marginTop: 4, flexWrap: 'wrap', alignItems: 'center' },
  date: { fontSize: 11, color: GRAY },
  desc: { fontSize: 13, color: '#374151', lineHeight: 19, marginTop: 8 },
  meta: { marginTop: 6, fontSize: 12, color: '#6B7280' },
});
