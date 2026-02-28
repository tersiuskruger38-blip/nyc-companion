import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { FLIGHTS } from '../data/flights';
import { ACCENT, ACCENT_LIGHT, DARK, GRAY, GREEN, WHITE, LIGHT_BG } from '../theme';

export default function FlightsScreen() {
  const tripStart = new Date('2026-03-13T00:00:00');
  const now = new Date();
  const diff = tripStart - now;
  const daysUntil = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Flights</Text>
      <Text style={styles.subtitle}>All flight details for your NYC trip</Text>

      {/* Countdown */}
      <View style={styles.countdown}>
        <Text style={styles.countdownLabel}>✈️ Trip starts in</Text>
        <Text style={styles.countdownNumber}>{daysUntil}</Text>
        <Text style={styles.countdownUnit}>days</Text>
      </View>

      {/* Flight Cards */}
      {FLIGHTS.map(f => (
        <View key={f.id} style={[styles.card, { borderLeftColor: f.direction === 'return' ? '#8B5CF6' : ACCENT }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.who}>{f.who}</Text>
            <View style={[styles.dirBadge, f.direction === 'return' ? styles.returnBadge : styles.outboundBadge]}>
              <Text style={[styles.dirText, f.direction === 'return' ? styles.returnText : styles.outboundText]}>
                {f.direction === 'return' ? 'Return' : 'Outbound'}
              </Text>
            </View>
          </View>

          <View style={styles.routeRow}>
            <View style={styles.airport}>
              <Text style={styles.code}>{f.from}</Text>
              <Text style={styles.city}>{f.fromFull}</Text>
              <Text style={styles.departTime}>{f.depart}</Text>
            </View>
            <View style={styles.middle}>
              <Text style={styles.duration}>{f.duration}</Text>
              <View style={styles.line}>
                <Text style={styles.plane}>✈️</Text>
              </View>
              <Text style={styles.flightNum}>{f.flight} · {f.airline}</Text>
            </View>
            <View style={styles.airport}>
              <Text style={styles.code}>{f.to}</Text>
              <Text style={styles.city}>{f.toFull}</Text>
              <Text style={styles.arriveTime}>{f.arrive}</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>📅 {f.date} · {f.notes}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: LIGHT_BG },
  container: { padding: 16, paddingBottom: 100 },
  title: { fontSize: 22, fontWeight: '800', color: DARK, marginBottom: 4 },
  subtitle: { fontSize: 13, color: GRAY, marginBottom: 16 },
  countdown: { backgroundColor: DARK, borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 16 },
  countdownLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  countdownNumber: { fontSize: 48, fontWeight: '900', color: WHITE, letterSpacing: -2, marginVertical: 4 },
  countdownUnit: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  card: { backgroundColor: WHITE, borderRadius: 16, padding: 16, marginBottom: 12, borderLeftWidth: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  who: { fontSize: 13, fontWeight: '700', color: DARK },
  dirBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  outboundBadge: { backgroundColor: ACCENT_LIGHT },
  returnBadge: { backgroundColor: '#EDE9FE' },
  dirText: { fontSize: 11, fontWeight: '600' },
  outboundText: { color: '#B45309' },
  returnText: { color: '#7C3AED' },
  routeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  airport: { alignItems: 'center' },
  code: { fontSize: 24, fontWeight: '800', color: DARK },
  city: { fontSize: 11, color: GRAY },
  departTime: { fontSize: 14, fontWeight: '700', color: ACCENT, marginTop: 2 },
  arriveTime: { fontSize: 14, fontWeight: '700', color: GREEN, marginTop: 2 },
  middle: { flex: 1, paddingHorizontal: 12, alignItems: 'center' },
  duration: { fontSize: 11, color: GRAY },
  line: { height: 2, backgroundColor: '#E5E7EB', width: '100%', marginVertical: 6, position: 'relative', alignItems: 'center', justifyContent: 'center' },
  plane: { fontSize: 14, position: 'absolute' },
  flightNum: { fontSize: 11, color: GRAY },
  footer: { paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  footerText: { fontSize: 12, color: GRAY },
});
