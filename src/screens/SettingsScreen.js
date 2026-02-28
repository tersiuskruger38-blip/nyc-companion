import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, StyleSheet } from 'react-native';
import { ACCENT, DARK, GRAY, GREEN, WHITE, LIGHT_BG } from '../theme';

const BUDGET_OPTIONS = [
  { id: 'budget', label: '💰 Budget', desc: 'Prioritize free & cheap options' },
  { id: 'moderate', label: '⚖️ Moderate', desc: 'Mix of free and paid' },
  { id: 'splurge', label: '✨ Splurge', desc: 'Best experiences, any price' },
];

const WALKING_OPTIONS = [
  { id: 'minimal', label: '🚇 Minimal', desc: 'Prefer transit, short walks' },
  { id: 'normal', label: '🚶 Normal', desc: 'Happy to walk 20-30 min' },
  { id: 'marathon', label: '🏃 Marathon', desc: 'Love walking everywhere' },
];

const FOOD_PREFS = [
  { id: 'local', label: '🗽 Local favorites' },
  { id: 'cheap_eats', label: '🥟 Cheap eats' },
  { id: 'fine_dining', label: '🍷 Fine dining' },
  { id: 'vegetarian', label: '🥗 Vegetarian' },
  { id: 'spicy', label: '🌶️ Spicy food' },
  { id: 'desserts', label: '🍪 Desserts & sweets' },
];

function OptionGroup({ title, options, selected, onSelect }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {options.map(o => (
        <TouchableOpacity
          key={o.id}
          onPress={() => onSelect(o.id)}
          style={[styles.option, selected === o.id && styles.optionActive]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.optionLabel, selected === o.id && styles.optionLabelActive]}>{o.label}</Text>
            {o.desc && <Text style={styles.optionDesc}>{o.desc}</Text>}
          </View>
          {selected === o.id && <Text style={{ fontSize: 16 }}>✓</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function SettingsScreen({ settings, setSettings }) {
  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  const set = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

  const toggleFoodPref = (id) => {
    setSettings(prev => {
      const prefs = prev.foodPreferences || [];
      return {
        ...prev,
        foodPreferences: prefs.includes(id) ? prefs.filter(p => p !== id) : [...prefs, id],
      };
    });
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Personalize your AI recommendations</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🤖 AI Preferences</Text>
        <Text style={styles.cardDesc}>
          These settings shape how the AI suggests activities, swaps, and recommendations throughout the app.
        </Text>
      </View>

      <OptionGroup
        title="💰 Budget Level"
        options={BUDGET_OPTIONS}
        selected={settings.budgetLevel}
        onSelect={(v) => set('budgetLevel', v)}
      />

      <OptionGroup
        title="🚶 Walking Comfort"
        options={WALKING_OPTIONS}
        selected={settings.walkingComfort}
        onSelect={(v) => set('walkingComfort', v)}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🍽️ Food Preferences</Text>
        <View style={styles.chipGrid}>
          {FOOD_PREFS.map(f => {
            const active = (settings.foodPreferences || []).includes(f.id);
            return (
              <TouchableOpacity
                key={f.id}
                onPress={() => toggleFoodPref(f.id)}
                style={[styles.foodChip, active && styles.foodChipActive]}
              >
                <Text style={[styles.foodChipText, active && styles.foodChipTextActive]}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ General</Text>

        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchLabel}>🏠 Prefer indoor activities</Text>
            <Text style={styles.switchDesc}>AI will suggest indoor options first</Text>
          </View>
          <Switch
            value={settings.preferIndoor}
            onValueChange={() => toggle('preferIndoor')}
            trackColor={{ false: '#E5E7EB', true: ACCENT }}
            thumbColor={WHITE}
          />
        </View>

        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchLabel}>👥 Avoid crowds</Text>
            <Text style={styles.switchDesc}>Skip busy tourist hotspots</Text>
          </View>
          <Switch
            value={settings.avoidCrowds}
            onValueChange={() => toggle('avoidCrowds')}
            trackColor={{ false: '#E5E7EB', true: ACCENT }}
            thumbColor={WHITE}
          />
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 These preferences are used by the AI chat buddy and the smart activity swapper. When weather is bad, tap "🔄 AI Swap" on any activity to get a personalized replacement.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: LIGHT_BG },
  container: { padding: 16, paddingBottom: 100 },
  title: { fontSize: 22, fontWeight: '800', color: DARK, marginBottom: 4 },
  subtitle: { fontSize: 13, color: GRAY, marginBottom: 16 },
  card: { backgroundColor: DARK, borderRadius: 16, padding: 16, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: WHITE, marginBottom: 4 },
  cardDesc: { fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 19 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: DARK, marginBottom: 10 },
  option: { flexDirection: 'row', alignItems: 'center', backgroundColor: WHITE, borderRadius: 12, padding: 14, marginBottom: 6, borderWidth: 2, borderColor: 'transparent' },
  optionActive: { borderColor: ACCENT, backgroundColor: '#FFFBEB' },
  optionLabel: { fontSize: 14, fontWeight: '600', color: DARK },
  optionLabelActive: { color: '#B45309' },
  optionDesc: { fontSize: 12, color: GRAY, marginTop: 1 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  foodChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: WHITE, borderWidth: 1, borderColor: '#E5E7EB' },
  foodChipActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  foodChipText: { fontSize: 13, fontWeight: '600', color: DARK },
  foodChipTextActive: { color: WHITE },
  switchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: WHITE, borderRadius: 12, padding: 14, marginBottom: 6 },
  switchLabel: { fontSize: 14, fontWeight: '600', color: DARK },
  switchDesc: { fontSize: 12, color: GRAY, marginTop: 1 },
  infoBox: { backgroundColor: '#EFF6FF', borderRadius: 12, padding: 14, marginTop: 4 },
  infoText: { fontSize: 13, color: '#1E40AF', lineHeight: 19 },
});
