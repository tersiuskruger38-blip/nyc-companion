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
    <View style={[styles.container, { backgroundColor: theme.cardBg, borderColor: theme.border, borderWidth: 1 }]}
      accessibilityLabel={`Weather: ${w.label}, ${w.temp} degrees Celsius, wind ${w.wind} km/h, ${w.rain}% rain chance`}
    >
      <Text style={styles.icon} accessibilityLabel={w.label}>{w.icon}</Text>
      <View style={styles.info}>
        <Text style={[styles.label, { color: theme.text }]}>{w.label}</Text>
        <Text style={[styles.detail, { color: theme.textSecondary }]}>{w.high}/{w.low}C · Wind {w.wind} km/h · {w.rain}% rain</Text>
      </View>
      <View style={styles.tempWrap}>
        <Text style={[styles.temp, { color: theme.text }]}>{w.temp}°</Text>
        <Text style={[styles.unit, { color: theme.textSecondary }]}>C</Text>
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
  icon: { fontSize: 28 },
  info: { flex: 1 },
  label: { fontSize: 13, fontWeight: '600' },
  detail: { fontSize: 11, marginTop: 1 },
  tempWrap: { flexDirection: 'row', alignItems: 'baseline' },
  temp: { fontSize: 28, fontWeight: '700' },
  unit: { fontSize: 12, marginLeft: 1 },
});
