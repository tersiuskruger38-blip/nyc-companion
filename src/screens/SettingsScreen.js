import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert, StyleSheet } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../theme';
import { requestPermissions, scheduleDailySummary, scheduleActivityReminders, cancelAllNotifications } from '../utils/notifications';

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

const DARK_MODE_OPTIONS = [
  { id: 'system', label: '📱 System', desc: 'Follow device setting' },
  { id: 'light', label: '☀️ Light', desc: 'Always light mode' },
  { id: 'dark', label: '🌙 Dark', desc: 'Always dark mode' },
];

function OptionGroup({ title, options, selected, onSelect }) {
  const theme = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      {options.map(o => (
        <TouchableOpacity
          key={o.id}
          onPress={() => onSelect(o.id)}
          style={[styles.option, { backgroundColor: theme.cardBg, borderColor: selected === o.id ? theme.accent : 'transparent' }, selected === o.id && { backgroundColor: theme.isDark ? '#78350F' : '#FFFBEB' }]}
          accessibilityRole="button"
          accessibilityLabel={`${o.label}${o.desc ? `: ${o.desc}` : ''}`}
          accessibilityState={{ selected: selected === o.id }}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.optionLabel, { color: theme.text }, selected === o.id && { color: theme.isDark ? '#FCD34D' : '#B45309' }]}>{o.label}</Text>
            {o.desc && <Text style={[styles.optionDesc, { color: theme.textSecondary }]}>{o.desc}</Text>}
          </View>
          {selected === o.id && <Text style={{ fontSize: 16 }}>✓</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function SettingsScreen() {
  const { state, dispatch } = useAppContext();
  const theme = useTheme();
  const { settings, darkMode } = state;

  const toggle = (key) => dispatch({ type: 'SET_SETTINGS', payload: { ...settings, [key]: !settings[key] } });
  const set = (key, val) => dispatch({ type: 'SET_SETTINGS', payload: { ...settings, [key]: val } });

  const toggleFoodPref = (id) => {
    const prefs = settings.foodPreferences || [];
    dispatch({
      type: 'SET_SETTINGS',
      payload: {
        ...settings,
        foodPreferences: prefs.includes(id) ? prefs.filter(p => p !== id) : [...prefs, id],
      },
    });
  };

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: theme.bg }]} contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: theme.text }]} accessibilityRole="header">Settings</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Personalize your AI recommendations</Text>

      <View style={[styles.card, { backgroundColor: theme.headerBg }]}>
        <Text style={styles.cardTitle}>🤖 AI Preferences</Text>
        <Text style={styles.cardDesc}>
          These settings shape how the AI suggests activities, swaps, and recommendations throughout the app.
        </Text>
      </View>

      <OptionGroup
        title="🌓 Appearance"
        options={DARK_MODE_OPTIONS}
        selected={darkMode}
        onSelect={(v) => dispatch({ type: 'SET_DARK_MODE', payload: v })}
      />

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
        <Text style={[styles.sectionTitle, { color: theme.text }]}>🍽️ Food Preferences</Text>
        <View style={styles.chipGrid}>
          {FOOD_PREFS.map(f => {
            const active = (settings.foodPreferences || []).includes(f.id);
            return (
              <TouchableOpacity
                key={f.id}
                onPress={() => toggleFoodPref(f.id)}
                style={[styles.foodChip, { backgroundColor: theme.cardBg, borderColor: theme.border }, active && { backgroundColor: theme.accent, borderColor: theme.accent }]}
                accessibilityRole="button"
                accessibilityLabel={f.label}
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.foodChipText, { color: theme.text }, active && { color: '#FFFFFF' }]}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>⚙️ General</Text>

        <View style={[styles.switchRow, { backgroundColor: theme.cardBg }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.switchLabel, { color: theme.text }]}>🏠 Prefer indoor activities</Text>
            <Text style={[styles.switchDesc, { color: theme.textSecondary }]}>AI will suggest indoor options first</Text>
          </View>
          <Switch
            value={settings.preferIndoor}
            onValueChange={() => toggle('preferIndoor')}
            trackColor={{ false: theme.border, true: theme.accent }}
            thumbColor="#FFFFFF"
            accessibilityLabel="Prefer indoor activities"
          />
        </View>

        <View style={[styles.switchRow, { backgroundColor: theme.cardBg }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.switchLabel, { color: theme.text }]}>👥 Avoid crowds</Text>
            <Text style={[styles.switchDesc, { color: theme.textSecondary }]}>Skip busy tourist hotspots</Text>
          </View>
          <Switch
            value={settings.avoidCrowds}
            onValueChange={() => toggle('avoidCrowds')}
            trackColor={{ false: theme.border, true: theme.accent }}
            thumbColor="#FFFFFF"
            accessibilityLabel="Avoid crowds"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>🔔 Notifications</Text>

        <View style={[styles.switchRow, { backgroundColor: theme.cardBg }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.switchLabel, { color: theme.text }]}>🌅 Morning Summary</Text>
            <Text style={[styles.switchDesc, { color: theme.textSecondary }]}>Daily plan at 8:00 AM on trip days</Text>
          </View>
          <Switch
            value={settings.notifyMorning || false}
            onValueChange={async (val) => {
              if (val) {
                const granted = await requestPermissions();
                if (!granted) {
                  Alert.alert('Notifications disabled', 'Enable notifications in your device settings to use this feature.');
                  return;
                }
                await scheduleDailySummary(state.activities);
              } else {
                await cancelAllNotifications();
              }
              dispatch({ type: 'SET_SETTINGS', payload: { ...settings, notifyMorning: val } });
            }}
            trackColor={{ false: theme.border, true: theme.accent }}
            thumbColor="#FFFFFF"
            accessibilityLabel="Morning summary notifications"
          />
        </View>

        <View style={[styles.switchRow, { backgroundColor: theme.cardBg }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.switchLabel, { color: theme.text }]}>⏰ Activity Reminders</Text>
            <Text style={[styles.switchDesc, { color: theme.textSecondary }]}>15 min before each activity</Text>
          </View>
          <Switch
            value={settings.notifyReminders || false}
            onValueChange={async (val) => {
              if (val) {
                const granted = await requestPermissions();
                if (!granted) {
                  Alert.alert('Notifications disabled', 'Enable notifications in your device settings to use this feature.');
                  return;
                }
                await scheduleActivityReminders(state.activities);
              } else {
                await cancelAllNotifications();
              }
              dispatch({ type: 'SET_SETTINGS', payload: { ...settings, notifyReminders: val } });
            }}
            trackColor={{ false: theme.border, true: theme.accent }}
            thumbColor="#FFFFFF"
            accessibilityLabel="Activity reminder notifications"
          />
        </View>
      </View>

      <View style={[styles.infoBox, { backgroundColor: theme.isDark ? '#1E3A5F' : '#EFF6FF' }]}>
        <Text style={[styles.infoText, { color: theme.isDark ? '#93C5FD' : '#1E40AF' }]}>
          💡 These preferences are used by the AI chat buddy and the smart activity swapper. When weather is bad, tap "🔄 AI Swap" on any activity to get a personalized replacement.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { padding: 16, paddingBottom: 100 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  subtitle: { fontSize: 13, marginBottom: 16 },
  card: { borderRadius: 16, padding: 16, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 19 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 10 },
  option: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 14, marginBottom: 6, borderWidth: 2 },
  optionLabel: { fontSize: 14, fontWeight: '600' },
  optionDesc: { fontSize: 12, marginTop: 1 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  foodChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  foodChipText: { fontSize: 13, fontWeight: '600' },
  switchRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 14, marginBottom: 6 },
  switchLabel: { fontSize: 14, fontWeight: '600' },
  switchDesc: { fontSize: 12, marginTop: 1 },
  infoBox: { borderRadius: 12, padding: 14, marginTop: 4 },
  infoText: { fontSize: 13, lineHeight: 19 },
});
