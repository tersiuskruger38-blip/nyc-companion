import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WEATHER } from '../data/weather';
import { CATEGORIES, PRICE_LABELS } from '../data/categories';
import { getWeatherVerdict } from '../utils/weatherVerdict';
import { DARK, GRAY, WHITE, LIGHT_BG } from '../theme';

export default function WeatherAdvice({ activity, dayId }) {
  const w = WEATHER[dayId];
  const v = getWeatherVerdict(activity, w);
  if (!v) return null;

  return (
    <View style={[styles.container, { borderColor: v.color + '22' }]}>
      <View style={[styles.header, { backgroundColor: v.bg }]}>
        <Text style={styles.headerIcon}>{v.icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: v.color }]}>
            {v.severity === 'bad' ? '⚠️ AI Weather Warning' : v.severity === 'warning' ? 'AI Weather Advisory' : 'AI Weather Check'}
          </Text>
          <Text style={[styles.headerText, { color: v.color }]}>{v.text}</Text>
        </View>
      </View>
      {v.alternatives && (
        <View style={styles.altSection}>
          <Text style={styles.suggestion}>💡 {v.suggestion}</Text>
          {v.alternatives.map((alt, i) => {
            const ac = CATEGORIES[alt.category] || CATEGORIES.sightseeing;
            return (
              <View key={i} style={[styles.altCard, i < v.alternatives.length - 1 && { marginBottom: 6 }]}>
                <Text style={styles.altEmoji}>{ac.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.altName}>{alt.name}</Text>
                  <Text style={styles.altMeta}>{ac.label} · {PRICE_LABELS[alt.price]} · {alt.duration}</Text>
                  <Text style={styles.altWhy}>{alt.why}</Text>
                </View>
                <View style={styles.indoorBadge}>
                  <Text style={styles.indoorText}>🏠 Indoor</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 10, overflow: 'hidden', marginTop: 8, borderWidth: 1 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 10 },
  headerIcon: { fontSize: 18 },
  headerTitle: { fontWeight: '700', fontSize: 12, marginBottom: 2 },
  headerText: { fontSize: 12 },
  altSection: { padding: 10, backgroundColor: WHITE, borderTopWidth: 1, borderTopColor: '#00000010' },
  suggestion: { fontSize: 12, fontWeight: '700', color: DARK, marginBottom: 8 },
  altCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 10, backgroundColor: LIGHT_BG, borderRadius: 10 },
  altEmoji: { fontSize: 24 },
  altName: { fontWeight: '700', fontSize: 13 },
  altMeta: { fontSize: 11, color: GRAY },
  altWhy: { fontSize: 12, color: '#374151', marginTop: 3 },
  indoorBadge: { backgroundColor: '#DCFCE7', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  indoorText: { fontSize: 10, fontWeight: '700', color: '#16A34A' },
});
