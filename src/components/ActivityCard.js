import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { CATEGORIES } from '../data/categories';
import { WEATHER } from '../data/weather';
import { getWeatherVerdict } from '../utils/weatherVerdict';
import { CatBadge, PriceBadge } from './Badges';
import WeatherAdvice from './WeatherAdvice';
import { ACCENT, DARK, GRAY, GREEN, WHITE, ACCENT_LIGHT } from '../theme';

export default function ActivityCard({ activity, onUpdate, dayId }) {
  const [expanded, setExpanded] = useState(false);
  const isDone = activity.status === 'done';
  const isSkipped = activity.status === 'skipped';
  const cat = CATEGORIES[activity.category] || CATEGORIES.sightseeing;
  const v = getWeatherVerdict(activity, WEATHER[dayId]);
  const hasBad = v && (v.severity === 'bad' || v.severity === 'warning');

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => setExpanded(!expanded)}
      style={[
        styles.card,
        { borderLeftColor: isDone ? GREEN : isSkipped ? GRAY : cat.color },
        isSkipped && { opacity: 0.55 },
      ]}
    >
      <View style={styles.row}>
        <Text style={styles.emoji}>{cat.emoji}</Text>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, isSkipped && styles.strikethrough]}>{activity.name}</Text>
            {isDone && <Text style={{ fontSize: 16 }}>✅</Text>}
            {isSkipped && <Text style={{ fontSize: 14, opacity: 0.5 }}>⏭️</Text>}
          </View>
          <View style={styles.badges}>
            <CatBadge cat={activity.category} />
            <PriceBadge price={activity.price} />
            <Text style={styles.duration}>⏱ {activity.duration}</Text>
            {hasBad && !expanded && (
              <View style={[styles.weatherRisk, { backgroundColor: v.bg }]}>
                <Text style={[styles.weatherRiskText, { color: v.color }]}>{v.icon} Weather risk</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.timeWrap}>
          <Text style={styles.time}>{activity.time}</Text>
        </View>
      </View>

      {expanded && (
        <View style={styles.expandedSection}>
          <Text style={styles.description}>{activity.description}</Text>
          <WeatherAdvice activity={activity} dayId={dayId} />
          {activity.address && (
            <TouchableOpacity
              onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(activity.address)}`)}
            >
              <Text style={styles.address}>📍 {activity.address}</Text>
            </TouchableOpacity>
          )}
          {activity.notes && (
            <View style={styles.notesBox}>
              <Text style={styles.notesText}>💡 {activity.notes}</Text>
            </View>
          )}
          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: isDone ? '#DCFCE7' : GREEN }]}
              onPress={() => onUpdate(activity.id, isDone ? 'upcoming' : 'done')}
            >
              <Text style={[styles.btnText, { color: isDone ? GREEN : WHITE }]}>
                {isDone ? '↩ Undo' : '✓ Done'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: '#F3F4F6' }]}
              onPress={() => onUpdate(activity.id, isSkipped ? 'upcoming' : 'skipped')}
            >
              <Text style={[styles.btnText, { color: '#6B7280' }]}>
                {isSkipped ? '↩ Undo' : '⏭ Skip'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: WHITE,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  emoji: { fontSize: 24 },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  name: { fontWeight: '700', fontSize: 15, color: DARK },
  strikethrough: { textDecorationLine: 'line-through' },
  badges: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' },
  duration: { fontSize: 12, color: '#6B7280' },
  weatherRisk: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8 },
  weatherRiskText: { fontSize: 11, fontWeight: '600' },
  timeWrap: { alignItems: 'flex-end' },
  time: { fontSize: 14, fontWeight: '700', color: ACCENT },
  expandedSection: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  description: { fontSize: 14, color: '#374151', lineHeight: 21 },
  address: { marginTop: 8, fontSize: 13, color: '#3B82F6' },
  notesBox: { marginTop: 8, padding: 8, backgroundColor: ACCENT_LIGHT, borderRadius: 8 },
  notesText: { fontSize: 13, color: '#92400E' },
  buttons: { flexDirection: 'row', gap: 8, marginTop: 12 },
  btn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  btnText: { fontWeight: '600', fontSize: 13 },
});
