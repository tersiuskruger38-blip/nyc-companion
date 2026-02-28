import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  activities: '@nyc_activities',
  expenses: '@nyc_expenses',
  places: '@nyc_places',
  settings: '@nyc_settings',
};

export async function saveActivities(activities) {
  try {
    await AsyncStorage.setItem(KEYS.activities, JSON.stringify(activities));
  } catch (e) { console.warn('Save activities failed:', e); }
}

export async function loadActivities() {
  try {
    const data = await AsyncStorage.getItem(KEYS.activities);
    return data ? JSON.parse(data) : null;
  } catch (e) { console.warn('Load activities failed:', e); return null; }
}

export async function saveExpenses(expenses) {
  try {
    await AsyncStorage.setItem(KEYS.expenses, JSON.stringify(expenses));
  } catch (e) { console.warn('Save expenses failed:', e); }
}

export async function loadExpenses() {
  try {
    const data = await AsyncStorage.getItem(KEYS.expenses);
    return data ? JSON.parse(data) : null;
  } catch (e) { console.warn('Load expenses failed:', e); return null; }
}

export async function savePlaces(places) {
  try {
    await AsyncStorage.setItem(KEYS.places, JSON.stringify(places));
  } catch (e) { console.warn('Save places failed:', e); }
}

export async function loadPlaces() {
  try {
    const data = await AsyncStorage.getItem(KEYS.places);
    return data ? JSON.parse(data) : null;
  } catch (e) { console.warn('Load places failed:', e); return null; }
}

export const DEFAULT_SETTINGS = {
  preferIndoor: false,
  budgetLevel: 'moderate', // 'budget', 'moderate', 'splurge'
  walkingComfort: 'normal', // 'minimal', 'normal', 'marathon'
  foodPreferences: [], // ['vegetarian', 'spicy', 'local', 'cheap_eats']
  avoidCrowds: false,
};

export async function saveSettings(settings) {
  try {
    await AsyncStorage.setItem(KEYS.settings, JSON.stringify(settings));
  } catch (e) { console.warn('Save settings failed:', e); }
}

export async function loadSettings() {
  try {
    const data = await AsyncStorage.getItem(KEYS.settings);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch (e) { console.warn('Load settings failed:', e); return DEFAULT_SETTINGS; }
}
