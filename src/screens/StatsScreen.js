import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, StyleSheet } from 'react-native';
import { DAYS, WEATHER } from '../data/weather';
import { getAllActivities, parseDuration, estimateSteps } from '../utils/helpers';
import { ACCENT, DARK, GRAY, GREEN, WHITE, LIGHT_BG } from '../theme';

function StatCard({ emoji, value, label, sub }) {
  return (
    <View style={styles.statCard}>
      <Text style={{ fontSize: 28 }}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {sub && <Text style={styles.statSub}>{sub}</Text>}
    </View>
  );
}

export default function StatsScreen({ activities, expenses, setExpenses }) {
  const all = getAllActivities(activities);
  const doneCount = all.filter(a => a.status === 'done').length;
  const totalActs = all.length;
  const totalSteps = estimateSteps(activities);
  const totalKm = (totalSteps * 0.0007).toFixed(1);
  const totalCalories = Math.round(totalSteps * 0.04);
  const totalMins = all.reduce((s, a) => s + parseDuration(a.duration), 0);
  const freeActs = all.filter(a => a.price === 'free').length;

  const [animSteps, setAnimSteps] = useState(0);
  useEffect(() => {
    let frame;
    const target = totalSteps;
    const dur = 1200;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / dur, 1);
      setAnimSteps(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [totalSteps]);

  const EUR_RATE = 0.92;
  const [expAmt, setExpAmt] = useState('');
  const [expCat, setExpCat] = useState('Food');
  const [expNote, setExpNote] = useState('');
  const totalUSD = expenses.reduce((s, e) => s + e.amount, 0);
  const totalEUR = (totalUSD * EUR_RATE).toFixed(2);
  const expCats = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Drinks', 'Other'];

  const addExpense = () => {
    const amt = parseFloat(expAmt);
    if (!amt || amt <= 0) return;
    setExpenses(prev => [...prev, { id: Date.now(), amount: amt, category: expCat, note: expNote, date: new Date().toLocaleDateString() }]);
    setExpAmt('');
    setExpNote('');
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Trip Stats & Budget</Text>
      <Text style={styles.subtitle}>Tersius & Suzanne's NYC numbers</Text>

      {/* Steps hero */}
      <View style={styles.stepsHero}>
        <Text style={styles.stepsLabel}>Estimated Total Steps</Text>
        <Text style={styles.stepsNumber}>{animSteps.toLocaleString()}</Text>
        <Text style={styles.stepsDetail}>{totalKm} km · {totalCalories} cal</Text>
        <View style={styles.stepsRow}>
          <View style={styles.stepsStat}>
            <Text style={styles.stepsStatVal}>{(totalMins / 60).toFixed(0)}</Text>
            <Text style={styles.stepsStatLabel}>hours</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stepsStat}>
            <Text style={styles.stepsStatVal}>{totalActs}</Text>
            <Text style={styles.stepsStatLabel}>activities</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stepsStat}>
            <Text style={styles.stepsStatVal}>6</Text>
            <Text style={styles.stepsStatLabel}>days</Text>
          </View>
        </View>
      </View>

      <View style={styles.statRow}>
        <StatCard emoji="✅" value={doneCount} label="Completed" sub={`of ${totalActs} planned`} />
        <StatCard emoji="🆓" value={freeActs} label="Free Activities" sub="NYC is affordable!" />
      </View>

      {/* Weather strip */}
      <Text style={styles.sectionTitle}>🌤️ 6-Day Forecast</Text>
      <View style={styles.weatherStrip}>
        {DAYS.map(d => {
          const w = WEATHER[d.id];
          return (
            <View key={d.id} style={styles.weatherDay}>
              <Text style={styles.weatherDayLabel}>{d.date.split(', ')[0].slice(0, 3)}</Text>
              <Text style={{ fontSize: 22, marginVertical: 4 }}>{w.icon}</Text>
              <Text style={styles.weatherTemp}>{w.temp}°</Text>
              <Text style={styles.weatherRain}>{w.rain}%🌧</Text>
            </View>
          );
        })}
      </View>

      {/* Budget tracker */}
      <Text style={styles.sectionTitle}>💰 Trip Budget</Text>
      <View style={styles.budgetCard}>
        <View style={styles.budgetRow}>
          <View>
            <Text style={styles.budgetLabel}>Total USD</Text>
            <Text style={styles.budgetAmount}>${totalUSD.toFixed(2)}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.budgetLabel}>Total EUR</Text>
            <Text style={[styles.budgetAmount, { color: '#2563EB' }]}>€{totalEUR}</Text>
          </View>
        </View>
        <Text style={styles.rateText}>Rate: 1 USD = {EUR_RATE} EUR</Text>
      </View>

      {/* Add expense */}
      <View style={styles.expenseForm}>
        <Text style={styles.formTitle}>Add Expense</Text>
        <View style={styles.formRow}>
          <TextInput
            keyboardType="numeric"
            placeholder="$ Amount"
            placeholderTextColor={GRAY}
            value={expAmt}
            onChangeText={setExpAmt}
            style={[styles.input, { flex: 1 }]}
          />
        </View>
        <FlatList
          horizontal
          data={expCats}
          keyExtractor={c => c}
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 8 }}
          renderItem={({ item: c }) => (
            <TouchableOpacity onPress={() => setExpCat(c)} style={[styles.catChip, expCat === c && styles.catChipActive]}>
              <Text style={[styles.catChipText, expCat === c && styles.catChipTextActive]}>{c}</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ width: 4 }} />}
        />
        <View style={styles.formRow}>
          <TextInput
            placeholder="Note (optional)"
            placeholderTextColor={GRAY}
            value={expNote}
            onChangeText={setExpNote}
            style={[styles.input, { flex: 1 }]}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addExpense}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Expense list */}
      {expenses.slice().reverse().map(exp => (
        <View key={exp.id} style={styles.expenseRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.expenseName}>{exp.category}{exp.note ? ` — ${exp.note}` : ''}</Text>
            <Text style={styles.expenseDate}>{exp.date}</Text>
          </View>
          <View style={{ alignItems: 'flex-end', marginRight: 8 }}>
            <Text style={styles.expenseAmt}>${exp.amount.toFixed(2)}</Text>
            <Text style={styles.expenseEur}>€{(exp.amount * EUR_RATE).toFixed(2)}</Text>
          </View>
          <TouchableOpacity onPress={() => setExpenses(prev => prev.filter(e => e.id !== exp.id))}>
            <Text style={styles.deleteBtn}>×</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Achievements */}
      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>🏆 Achievements</Text>
      {[
        { emoji: '🗽', title: 'First Timer', desc: 'Visit NYC for the first time', unlocked: true },
        { emoji: '🌉', title: 'Bridge Walker', desc: 'Walk the Brooklyn Bridge', unlocked: doneCount > 0 },
        { emoji: '🥟', title: 'Dumpling Hunter', desc: '$3.50 dumplings at King Dumplings', unlocked: false },
        { emoji: '🍀', title: 'Lucky Irish', desc: "St. Patrick's Day in NYC", unlocked: false },
        { emoji: '🌃', title: 'Night Owl', desc: 'Stay out past midnight', unlocked: false },
        { emoji: '📸', title: 'Gram Master', desc: 'Hit all photo spots', unlocked: false },
        { emoji: '🏃', title: 'Marathon Tourist', desc: '50,000+ steps', unlocked: totalSteps >= 50000 },
        { emoji: '✅', title: 'Completionist', desc: 'Complete every activity', unlocked: doneCount === totalActs && totalActs > 0 },
      ].map((a, i) => (
        <View key={i} style={[styles.achievement, !a.unlocked && styles.achievementLocked]}>
          <Text style={{ fontSize: 28 }}>{a.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.achieveTitle}>{a.title}</Text>
            <Text style={styles.achieveDesc}>{a.desc}</Text>
          </View>
          {a.unlocked && (
            <View style={styles.doneBadge}>
              <Text style={styles.doneText}>Done!</Text>
            </View>
          )}
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
  sectionTitle: { fontSize: 16, fontWeight: '700', color: DARK, marginBottom: 10 },

  stepsHero: { backgroundColor: DARK, borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 16 },
  stepsLabel: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  stepsNumber: { fontSize: 48, fontWeight: '900', color: WHITE, letterSpacing: -2, marginVertical: 4 },
  stepsDetail: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  stepsRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 14 },
  stepsStat: { alignItems: 'center' },
  stepsStatVal: { fontSize: 18, fontWeight: '800', color: WHITE },
  stepsStatLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)' },
  divider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },

  statRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: WHITE, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 1 },
  statValue: { fontSize: 26, fontWeight: '800', color: DARK, letterSpacing: -0.5, marginTop: 4 },
  statLabel: { fontSize: 13, fontWeight: '600', color: DARK },
  statSub: { fontSize: 11, color: GRAY },

  weatherStrip: { flexDirection: 'row', gap: 4, marginBottom: 20 },
  weatherDay: { flex: 1, alignItems: 'center', paddingVertical: 10, backgroundColor: WHITE, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 2, elevation: 1 },
  weatherDayLabel: { fontSize: 9, color: GRAY, fontWeight: '600' },
  weatherTemp: { fontSize: 13, fontWeight: '800', color: DARK },
  weatherRain: { fontSize: 9, color: GRAY },

  budgetCard: { backgroundColor: WHITE, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 1 },
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  budgetLabel: { fontSize: 12, color: GRAY },
  budgetAmount: { fontSize: 24, fontWeight: '800', color: DARK },
  rateText: { fontSize: 11, color: GRAY, textAlign: 'center' },

  expenseForm: { backgroundColor: WHITE, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 1 },
  formTitle: { fontSize: 14, fontWeight: '700', color: DARK, marginBottom: 10 },
  formRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  input: { padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', fontSize: 14, color: DARK, backgroundColor: WHITE },
  catPicker: { flex: 1 },
  catChip: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, backgroundColor: '#F3F4F6' },
  catChipActive: { backgroundColor: ACCENT },
  catChipText: { fontSize: 12, fontWeight: '600', color: DARK },
  catChipTextActive: { color: WHITE },
  addBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, backgroundColor: ACCENT, justifyContent: 'center' },
  addBtnText: { color: WHITE, fontWeight: '700', fontSize: 18 },

  expenseRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: WHITE, borderRadius: 10, padding: 10, marginBottom: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 2, elevation: 1 },
  expenseName: { fontSize: 14, fontWeight: '600', color: DARK },
  expenseDate: { fontSize: 11, color: GRAY },
  expenseAmt: { fontSize: 14, fontWeight: '700', color: DARK },
  expenseEur: { fontSize: 11, color: GRAY },
  deleteBtn: { fontSize: 20, color: '#EF4444', padding: 4 },

  achievement: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, backgroundColor: WHITE, borderRadius: 12, marginBottom: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  achievementLocked: { backgroundColor: '#F3F4F6', opacity: 0.5, shadowOpacity: 0 },
  achieveTitle: { fontSize: 13, fontWeight: '700', color: DARK },
  achieveDesc: { fontSize: 11, color: GRAY },
  doneBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  doneText: { fontSize: 10, fontWeight: '700', color: GREEN },
});
