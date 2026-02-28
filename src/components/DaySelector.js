import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { DAYS, WEATHER } from '../data/weather';
import { ACCENT, DARK, WHITE } from '../theme';

export default function DaySelector({ selectedDay, onSelect }) {
  return (
    <FlatList
      horizontal
      data={DAYS}
      keyExtractor={d => String(d.id)}
      showsHorizontalScrollIndicator={false}
      style={styles.list}
      renderItem={({ item: d }) => {
        const active = selectedDay === d.id;
        return (
          <TouchableOpacity
            onPress={() => onSelect(d.id)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{d.label}</Text>
            <Text style={[styles.sub, active && styles.subActive]}>
              {d.date.split(', ')[0]} {WEATHER[d.id]?.icon}
            </Text>
          </TouchableOpacity>
        );
      }}
      ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
    />
  );
}

const styles = StyleSheet.create({
  list: { marginBottom: 12 },
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
