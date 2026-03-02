import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WEATHER as STATIC_WEATHER } from '../data/weather';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../theme';

export default function WeatherBar() {
  const { state } = useAppContext();
  const theme = useTheme();
  const weather = state.weather || STATIC_WEATHER;
  const w = weather[state.selectedDay];
  if (!w) return null;
  return (
    <View style={[styles.container, { backgroundColor: theme.isDark ? '#1E293B' : '#EFF6FF' }]}
      accessibilityLabel={`Weather: ${w.label}, ${w.temp} degrees Celsius, wind ${w.wind} km/h, ${w.rain}% rain chance`}
    >
      <Text style={styles.icon} accessibilityLabel={w.label}>{w.icon}</Text>
      <View style={styles.info}>
        <Text style={[styles.label, { color: theme.text }]}>{w.label}</Text>
        <Text style={[styles.detail, { color: theme.textTertiary }]}>{w.high}/{w.low}C · Wind {w.wind} km/h · {w.rain}% rain</Text>
      </View>
      <View style={styles.tempWrap}>
        <Text style={[styles.temp, { color: theme.accent }]}>{w.temp}°</Text>
        <Text style={[styles.unit, { color: theme.textSecondary }]}>Celsius</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  icon: { fontSize: 32 },
  info: { flex: 1 },
  label: { fontSize: 14, fontWeight: '700' },
  detail: { fontSize: 12 },
  tempWrap: { alignItems: 'flex-end' },
  temp: { fontSize: 32, fontWeight: '800' },
  unit: { fontSize: 10 },
});
