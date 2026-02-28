import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, StyleSheet } from 'react-native';
import { DAYS } from '../data/weather';
import { WEATHER as STATIC_WEATHER } from '../data/weather';
import { getAllActivities, parseDuration, estimateSteps } from '../utils/helpers';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../theme';

function StatCard({ emoji, value, label, sub }) {
  const theme = useTheme();
  return (
    <View style={[styles.statCard, { backgroundColor: theme.cardBg }]}
      accessibilityLabel={`${label}: ${value}${sub ? `, ${sub}` : ''}`}
    >
      <Text style={{ fontSize: 28 }} accessibilityLabel={label}>{emoji}</Text>
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.text }]}>{label}</Text>
      {sub && <Text style={[styles.statSub, { color: theme.textSecondary }]}>{sub}</Text>}
    </View>
  );
}

export default function StatsScreen() {
  const { state, dispatch } = useAppContext();
  const theme = useTheme();
  const { activities, expenses } = state;
  const weather = state.weather || STATIC_WEATHER;

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
  const expCats = ['🍕 Food', '🚇 Transport', '🛍️ Shopping', '🎭 Entertainment', '🍺 Drinks', '📦 Other'];

  const addExpense = () => {
    const amt = parseFloat(expAmt);
    if (!amt || amt <= 0) return;
    dispatch({ type: 'ADD_EXPENSE', payload: { id: Date.now(), amount: amt, category: expCat, note: expNote, date: new Date().toLocaleDateString() } });
    setExpAmt('');
    setExpNote('');
  };

  const removeExpense = (id) => {
    dispatch({ type: 'REMOVE_EXPENSE', payload: id });
  };

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: theme.bg }]} contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>Trip Stats & Budget</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Tersius & Suzanne's NYC numbers</Text>

      <View style={[styles.stepsHero, { backgroundColor: theme.headerBg }]}>
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

      <Text style={[styles.sectionTitle, { color: theme.text }]}>🌤️ 6-Day Forecast</Text>
      <View style={styles.weatherStrip}>
        {DAYS.map(d => {
          const w = weather[d.id];
          return (
            <View key={d.id} style={[styles.weatherDay, { backgroundColor: theme.cardBg }]}
              accessibilityLabel={`${d.date}: ${w.label}, ${w.temp} degrees, ${w.rain}% rain`}
            >
              <Text style={[styles.weatherDayLabel, { color: theme.textSecondary }]}>{d.date.split(', ')[0].slice(0, 3)}</Text>
              <Text style={{ fontSize: 22, marginVertical: 4 }} accessibilityLabel={w.label}>{w.icon}</Text>
              <Text style={[styles.weatherTemp, { color: theme.text }]}>{w.temp}°</Text>
              <Text style={[styles.weatherRain, { color: theme.textSecondary }]}>{w.rain}%🌧</Text>
            </View>
          );
        })}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>💰 Trip Budget</Text>
      <View style={[styles.budgetCard, { backgroundColor: theme.cardBg }]}>
        <View style={styles.budgetRow}>
          <View>
            <Text style={[styles.budgetLabel, { color: theme.textSecondary }]}>Total USD</Text>
            <Text style={[styles.budgetAmount, { color: theme.text }]}>${totalUSD.toFixed(2)}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.budgetLabel, { color: theme.textSecondary }]}>Total EUR</Text>
            <Text style={[styles.budgetAmount, { color: '#2563EB' }]}>€{totalEUR}</Text>
          </View>
        </View>
        <Text style={[styles.rateText, { color: theme.textSecondary }]}>Rate: 1 USD = {EUR_RATE} EUR</Text>
      </View>

      <View style={[styles.expenseForm, { backgroundColor: theme.cardBg }]}>
        <Text style={[styles.formTitle, { color: theme.text }]}>Add Expense</Text>
        <View style={styles.formRow}>
          <TextInput
            keyboardType="numeric"
            placeholder="$ Amount"
            placeholderTextColor={theme.textSecondary}
            value={expAmt}
            onChangeText={setExpAmt}
            style={[styles.input, { flex: 1, color: theme.text, backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}
            accessibilityLabel="Expense amount in dollars"
          />
        </View>
        <FlatList
          horizontal
          data={expCats}
          keyExtractor={c => c}
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 8 }}
          renderItem={({ item: c }) => (
            <TouchableOpacity
              onPress={() => setExpCat(c)}
              style={[styles.catChip, expCat === c && { backgroundColor: theme.accent }]}
              accessibilityRole="button"
              accessibilityLabel={`Category: ${c}`}
              accessibilityState={{ selected: expCat === c }}
            >
              <Text style={[styles.catChipText, { color: theme.text }, expCat === c && { color: '#FFFFFF' }]}>{c}</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ width: 4 }} />}
        />
        <View style={styles.formRow}>
          <TextInput
            placeholder="Note (optional)"
            placeholderTextColor={theme.textSecondary}
            value={expNote}
            onChangeText={setExpNote}
            style={[styles.input, { flex: 1, color: theme.text, backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}
            accessibilityLabel="Expense note"
          />
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: theme.accent }]}
            onPress={addExpense}
            accessibilityRole="button"
            accessibilityLabel="Add expense"
          >
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {expenses.slice().reverse().map(exp => (
        <View key={exp.id} style={[styles.expenseRow, { backgroundColor: theme.cardBg }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.expenseName, { color: theme.text }]}>{exp.category}{exp.note ? ` — ${exp.note}` : ''}</Text>
            <Text style={[styles.expenseDate, { color: theme.textSecondary }]}>{exp.date}</Text>
          </View>
          <View style={{ alignItems: 'flex-end', marginRight: 8 }}>
            <Text style={[styles.expenseAmt, { color: theme.text }]}>${exp.amount.toFixed(2)}</Text>
            <Text style={[styles.expenseEur, { color: theme.textSecondary }]}>€{(exp.amount * EUR_RATE).toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            onPress={() => removeExpense(exp.id)}
            accessibilityRole="button"
            accessibilityLabel={`Delete expense: ${exp.category} $${exp.amount.toFixed(2)}`}
          >
            <Text style={styles.deleteBtn}>×</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Text style={[styles.sectionTitle, { marginTop: 20, color: theme.text }]}>🏆 Achievements</Text>
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
        <View key={i} style={[styles.achievement, { backgroundColor: theme.cardBg }, !a.unlocked && styles.achievementLocked]}
          accessibilityLabel={`${a.title}: ${a.desc}. ${a.unlocked ? 'Unlocked' : 'Locked'}`}
        >
          <Text style={{ fontSize: 28 }} accessibilityLabel="">{a.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.achieveTitle, { color: theme.text }]}>{a.title}</Text>
            <Text style={[styles.achieveDesc, { color: theme.textSecondary }]}>{a.desc}</Text>
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
  scroll: { flex: 1 },
  container: { padding: 16, paddingBottom: 100 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  subtitle: { fontSize: 13, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  stepsHero: { borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 16 },
  stepsLabel: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  stepsNumber: { fontSize: 48, fontWeight: '900', color: '#FFFFFF', letterSpacing: -2, marginVertical: 4 },
  stepsDetail: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  stepsRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 14 },
  stepsStat: { alignItems: 'center' },
  stepsStatVal: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  stepsStatLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)' },
  divider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  statRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: { flex: 1, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 1 },
  statValue: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5, marginTop: 4 },
  statLabel: { fontSize: 13, fontWeight: '600' },
  statSub: { fontSize: 11 },
  weatherStrip: { flexDirection: 'row', gap: 4, marginBottom: 20 },
  weatherDay: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 2, elevation: 1 },
  weatherDayLabel: { fontSize: 9, fontWeight: '600' },
  weatherTemp: { fontSize: 13, fontWeight: '800' },
  weatherRain: { fontSize: 9 },
  budgetCard: { borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 1 },
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  budgetLabel: { fontSize: 12 },
  budgetAmount: { fontSize: 24, fontWeight: '800' },
  rateText: { fontSize: 11, textAlign: 'center' },
  expenseForm: { borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 1 },
  formTitle: { fontSize: 14, fontWeight: '700', marginBottom: 10 },
  formRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  input: { padding: 10, borderRadius: 10, borderWidth: 1, fontSize: 14 },
  catChip: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, backgroundColor: '#F3F4F6' },
  catChipText: { fontSize: 12, fontWeight: '600' },
  addBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, justifyContent: 'center' },
  addBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 18 },
  expenseRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, padding: 10, marginBottom: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 2, elevation: 1 },
  expenseName: { fontSize: 14, fontWeight: '600' },
  expenseDate: { fontSize: 11 },
  expenseAmt: { fontSize: 14, fontWeight: '700' },
  expenseEur: { fontSize: 11 },
  deleteBtn: { fontSize: 20, color: '#EF4444', padding: 4 },
  achievement: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 12, marginBottom: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  achievementLocked: { opacity: 0.5, shadowOpacity: 0 },
  achieveTitle: { fontSize: 13, fontWeight: '700' },
  achieveDesc: { fontSize: 11 },
  doneBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  doneText: { fontSize: 10, fontWeight: '700', color: '#22C55E' },
});
