import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { DAYS } from '../data/weather';
import { WEATHER as STATIC_WEATHER } from '../data/weather';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../theme';

export default function DaySelector() {
  const { state, dispatch } = useAppContext();
  const theme = useTheme();
  const weather = state.weather || STATIC_WEATHER;

  return (
    <FlatList
      horizontal
      data={DAYS}
      keyExtractor={d => String(d.id)}
      showsHorizontalScrollIndicator={false}
      style={styles.list}
      renderItem={({ item: d }) => {
        const active = state.selectedDay === d.id;
        return (
          <TouchableOpacity
            onPress={() => dispatch({ type: 'SET_SELECTED_DAY', payload: d.id })}
            style={[styles.chip, { backgroundColor: theme.cardBg }, active && { backgroundColor: theme.accent, shadowOpacity: 0.3, shadowColor: theme.accent, elevation: 3 }]}
            accessibilityRole="button"
            accessibilityLabel={`${d.label}: ${d.date}`}
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.label, { color: theme.text }, active && { fontWeight: '700', color: '#FFFFFF' }]}>{d.label}</Text>
            <Text style={[styles.sub, { color: theme.text }, active && { color: '#FFFFFF' }]}>
              {d.date.split(', ')[0]} {weather[d.id]?.icon}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  label: { fontSize: 13, fontWeight: '500' },
  sub: { fontSize: 11, opacity: 0.8, marginTop: 1 },
});
