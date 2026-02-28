import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { DAYS, WEATHER } from '../data/weather';
import { ACCENT, DARK, WHITE } from '../theme';

export default function DaySelector({ selectedDay, onSelect }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll} contentContainerStyle={styles.content}>
      {DAYS.map(d => {
        const active = selectedDay === d.id;
        return (
          <TouchableOpacity
            key={d.id}
            onPress={() => onSelect(d.id)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{d.label}</Text>
            <Text style={[styles.sub, active && styles.subActive]}>
              {d.date.split(', ')[0]} {WEATHER[d.id]?.icon}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { marginBottom: 12 },
  content: { gap: 6, paddingRight: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: WHITE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chipActive: {
    backgroundColor: ACCENT,
    shadowOpacity: 0.3,
    shadowColor: ACCENT,
    elevation: 3,
  },
  label: { fontSize: 13, fontWeight: '500', color: DARK },
  labelActive: { fontWeight: '700', color: WHITE },
  sub: { fontSize: 11, opacity: 0.8, marginTop: 1, color: DARK },
  subActive: { color: WHITE },
});
