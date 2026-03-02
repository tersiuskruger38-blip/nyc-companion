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
            style={[
              styles.chip,
              { borderColor: theme.border, borderWidth: 1, backgroundColor: 'transparent' },
              active && { backgroundColor: theme.accent, borderColor: theme.accent, shadowOpacity: 0.25, shadowColor: theme.accent, elevation: 3 },
            ]}
            accessibilityRole="button"
            accessibilityLabel={`${d.label}: ${d.date}`}
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.label, { color: theme.textTertiary }, active && { fontWeight: '700', color: '#FFFFFF' }]}>{d.label}</Text>
            <Text style={[styles.sub, { color: theme.textSecondary }, active && { color: 'rgba(255,255,255,0.8)' }]}>
              {d.date.split(', ')[0]} {weather[d.id]?.icon}
            </Text>
            {active && <View style={styles.activeIndicator} />}
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
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0,
    shadowRadius: 2,
    elevation: 0,
    alignItems: 'center',
  },
  label: { fontSize: 13, fontWeight: '500' },
  sub: { fontSize: 11, marginTop: 1 },
  activeIndicator: {
    width: 16,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
});
