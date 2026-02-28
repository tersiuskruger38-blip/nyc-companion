import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WEATHER } from '../data/weather';
import { DARK, GRAY, WHITE } from '../theme';

export default function WeatherBar({ dayId }) {
  const w = WEATHER[dayId];
  if (!w) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{w.icon}</Text>
      <View style={styles.info}>
        <Text style={styles.label}>{w.label}</Text>
        <Text style={styles.detail}>{w.high}°/{w.low}°C · Wind {w.wind} km/h · {w.rain}% rain</Text>
      </View>
      <View style={styles.tempWrap}>
        <Text style={styles.temp}>{w.temp}°</Text>
        <Text style={styles.unit}>Celsius</Text>
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
    backgroundColor: WHITE,
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  icon: { fontSize: 32 },
  info: { flex: 1 },
  label: { fontSize: 14, fontWeight: '700', color: DARK },
  detail: { fontSize: 12, color: '#6B7280' },
  tempWrap: { alignItems: 'flex-end' },
  temp: { fontSize: 28, fontWeight: '800', color: DARK },
  unit: { fontSize: 10, color: GRAY },
});
