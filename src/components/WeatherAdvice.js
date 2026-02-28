import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WEATHER as STATIC_WEATHER } from '../data/weather';
import { CATEGORIES, PRICE_LABELS } from '../data/categories';
import { getWeatherVerdict } from '../utils/weatherVerdict';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../theme';

export default function WeatherAdvice({ activity, dayId }) {
  const { state } = useAppContext();
  const theme = useTheme();
  const weather = state.weather || STATIC_WEATHER;
  const w = weather[dayId];
  const v = getWeatherVerdict(activity, w);
  if (!v) return null;

  return (
    <View style={[styles.container, { borderColor: v.color + '22' }]}
      accessibilityLabel={`Weather advice: ${v.text}`}
    >
      <View style={[styles.header, { backgroundColor: v.bg }]}>
        <Text style={styles.headerIcon} accessibilityLabel="">{v.icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: v.color }]}>
            {v.severity === 'bad' ? '⚠️ AI Weather Warning' : v.severity === 'warning' ? 'AI Weather Advisory' : 'AI Weather Check'}
          </Text>
          <Text style={[styles.headerText, { color: v.color }]}>{v.text}</Text>
        </View>
      </View>
      {v.alternatives && (
        <View style={[styles.altSection, { backgroundColor: theme.cardBg, borderTopColor: '#00000010' }]}>
          <Text style={[styles.suggestion, { color: theme.text }]}>💡 {v.suggestion}</Text>
          {v.alternatives.map((alt, i) => {
            const ac = CATEGORIES[alt.category] || CATEGORIES.sightseeing;
            return (
              <View key={i} style={[styles.altCard, { backgroundColor: theme.bg }, i < v.alternatives.length - 1 && { marginBottom: 6 }]}>
                <Text style={styles.altEmoji} accessibilityLabel={ac.label}>{ac.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.altName, { color: theme.text }]}>{alt.name}</Text>
                  <Text style={[styles.altMeta, { color: theme.textSecondary }]}>{ac.label} · {PRICE_LABELS[alt.price]} · {alt.duration}</Text>
                  <Text style={[styles.altWhy, { color: theme.textTertiary }]}>{alt.why}</Text>
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
  altSection: { padding: 10, borderTopWidth: 1 },
  suggestion: { fontSize: 12, fontWeight: '700', marginBottom: 8 },
  altCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 10, borderRadius: 10 },
  altEmoji: { fontSize: 24 },
  altName: { fontWeight: '700', fontSize: 13 },
  altMeta: { fontSize: 11 },
  altWhy: { fontSize: 12, marginTop: 3 },
  indoorBadge: { backgroundColor: '#DCFCE7', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  indoorText: { fontSize: 10, fontWeight: '700', color: '#16A34A' },
});
