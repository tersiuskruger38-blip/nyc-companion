import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { FLIGHTS } from '../data/flights';
import { useTheme } from '../theme';

export default function FlightsScreen() {
  const theme = useTheme();
  const tripStart = new Date('2026-03-13T00:00:00');
  const now = new Date();
  const diff = tripStart - now;
  const daysUntil = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: theme.bg }]} contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: theme.text }]} accessibilityRole="header">Flights</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>All flight details for your NYC trip</Text>

      <View style={[styles.countdown, { backgroundColor: theme.headerBg }]}
        accessibilityLabel={`Trip starts in ${daysUntil} days`}
      >
        <Text style={styles.countdownLabel}>✈️ Trip starts in</Text>
        <Text style={styles.countdownNumber}>{daysUntil}</Text>
        <Text style={styles.countdownUnit}>days</Text>
      </View>

      {FLIGHTS.map(f => (
        <View key={f.id} style={[styles.card, { backgroundColor: theme.cardBg, borderLeftColor: f.direction === 'return' ? '#8B5CF6' : theme.accent }]}
          accessibilityLabel={`${f.who}, ${f.direction} flight ${f.flight}, ${f.from} to ${f.to}, ${f.date}`}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.who, { color: theme.text }]}>{f.who}</Text>
            <View style={[styles.dirBadge, f.direction === 'return' ? styles.returnBadge : { backgroundColor: theme.isDark ? '#78350F' : '#FEF3C7' }]}>
              <Text style={[styles.dirText, f.direction === 'return' ? styles.returnText : { color: theme.isDark ? '#FCD34D' : '#B45309' }]}>
                {f.direction === 'return' ? 'Return' : 'Outbound'}
              </Text>
            </View>
          </View>

          <View style={styles.routeRow}>
            <View style={styles.airport}>
              <Text style={[styles.code, { color: theme.text }]}>{f.from}</Text>
              <Text style={[styles.city, { color: theme.textSecondary }]}>{f.fromFull}</Text>
              <Text style={[styles.departTime, { color: theme.accent }]}>{f.depart}</Text>
            </View>
            <View style={styles.middle}>
              <Text style={[styles.duration, { color: theme.textSecondary }]}>{f.duration}</Text>
              <View style={[styles.line, { backgroundColor: theme.border }]}>
                <Text style={styles.plane}>✈️</Text>
              </View>
              <Text style={[styles.flightNum, { color: theme.textSecondary }]}>{f.flight} · {f.airline}</Text>
            </View>
            <View style={styles.airport}>
              <Text style={[styles.code, { color: theme.text }]}>{f.to}</Text>
              <Text style={[styles.city, { color: theme.textSecondary }]}>{f.toFull}</Text>
              <Text style={[styles.arriveTime, { color: theme.green }]}>{f.arrive}</Text>
            </View>
          </View>

          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>📅 {f.date} · {f.notes}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { padding: 16, paddingBottom: 100 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  subtitle: { fontSize: 13, marginBottom: 16 },
  countdown: { borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 16 },
  countdownLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  countdownNumber: { fontSize: 48, fontWeight: '900', color: '#FFFFFF', letterSpacing: -2, marginVertical: 4 },
  countdownUnit: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  card: { borderRadius: 16, padding: 16, marginBottom: 12, borderLeftWidth: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  who: { fontSize: 13, fontWeight: '700' },
  dirBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  returnBadge: { backgroundColor: '#EDE9FE' },
  dirText: { fontSize: 11, fontWeight: '600' },
  returnText: { color: '#7C3AED' },
  routeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  airport: { alignItems: 'center' },
  code: { fontSize: 24, fontWeight: '800' },
  city: { fontSize: 11 },
  departTime: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  arriveTime: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  middle: { flex: 1, paddingHorizontal: 12, alignItems: 'center' },
  duration: { fontSize: 11 },
  line: { height: 2, width: '100%', marginVertical: 6, position: 'relative', alignItems: 'center', justifyContent: 'center' },
  plane: { fontSize: 14, position: 'absolute' },
  flightNum: { fontSize: 11 },
  footer: { paddingTop: 8, borderTopWidth: 1 },
  footerText: { fontSize: 12 },
});
