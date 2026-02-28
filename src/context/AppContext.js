import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { initialActivities } from '../data/activities';
import { WEATHER as STATIC_WEATHER } from '../data/weather';
import {
  saveActivities, loadActivities,
  saveExpenses, loadExpenses,
  saveSettings, loadSettings,
  DEFAULT_SETTINGS,
} from '../utils/storage';
import { fetchLiveWeather } from '../utils/weather';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  addedEventIds: '@nyc_added_event_ids',
  darkMode: '@nyc_dark_mode',
};

const initialState = {
  activities: initialActivities,
  selectedDay: 0,
  expenses: [],
  settings: DEFAULT_SETTINGS,
  weather: STATIC_WEATHER,
  addedEventIds: [],
  darkMode: 'system', // 'system' | 'light' | 'dark'
  loaded: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'LOAD_PERSISTED':
      return { ...state, ...action.payload, loaded: true };

    case 'SET_ACTIVITIES':
      return { ...state, activities: action.payload };

    case 'UPDATE_ACTIVITY_STATUS': {
      const { dayId, activityId, status } = action.payload;
      const day = { ...state.activities[dayId] };
      for (const s of ['morning', 'afternoon', 'evening']) {
        day[s] = day[s].map(a => a.id === activityId ? { ...a, status } : a);
      }
      return { ...state, activities: { ...state.activities, [dayId]: day } };
    }

    case 'SWAP_ACTIVITY': {
      const { dayId, activityId, newActivity } = action.payload;
      const day = { ...state.activities[dayId] };
      for (const s of ['morning', 'afternoon', 'evening']) {
        day[s] = day[s].map(a => a.id === activityId ? { ...newActivity, id: activityId } : a);
      }
      return { ...state, activities: { ...state.activities, [dayId]: day } };
    }

    case 'UPDATE_ACTIVITY_FIELD': {
      const { dayId, activityId, field, value } = action.payload;
      const day = { ...state.activities[dayId] };
      for (const s of ['morning', 'afternoon', 'evening']) {
        day[s] = day[s].map(a => a.id === activityId ? { ...a, [field]: value } : a);
      }
      return { ...state, activities: { ...state.activities, [dayId]: day } };
    }

    case 'ADD_ACTIVITY': {
      const { dayId, section, activity } = action.payload;
      const day = { ...state.activities[dayId] };
      day[section] = [...(day[section] || []), activity];
      return { ...state, activities: { ...state.activities, [dayId]: day } };
    }

    case 'SET_SELECTED_DAY':
      return { ...state, selectedDay: action.payload };

    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };

    case 'REMOVE_EXPENSE':
      return { ...state, expenses: state.expenses.filter(e => e.id !== action.payload) };

    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };

    case 'SET_WEATHER':
      return { ...state, weather: action.payload };

    case 'ADD_EVENT_TO_ITINERARY': {
      const { eventId, dayId, section, activity } = action.payload;
      if (state.addedEventIds.includes(eventId)) return state;
      const day = { ...state.activities[dayId] };
      day[section] = [...(day[section] || []), activity];
      return {
        ...state,
        activities: { ...state.activities, [dayId]: day },
        addedEventIds: [...state.addedEventIds, eventId],
      };
    }

    case 'SET_DARK_MODE':
      return { ...state, darkMode: action.payload };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const loaded = useRef(false);

  // Load persisted state on mount
  useEffect(() => {
    (async () => {
      const [savedActs, savedExp, savedSettings, savedEventIds, savedDarkMode] = await Promise.all([
        loadActivities(),
        loadExpenses(),
        loadSettings(),
        AsyncStorage.getItem(STORAGE_KEYS.addedEventIds).then(d => d ? JSON.parse(d) : []).catch(() => []),
        AsyncStorage.getItem(STORAGE_KEYS.darkMode).catch(() => null),
      ]);
      dispatch({
        type: 'LOAD_PERSISTED',
        payload: {
          ...(savedActs ? { activities: savedActs } : {}),
          ...(savedExp ? { expenses: savedExp } : {}),
          settings: savedSettings || DEFAULT_SETTINGS,
          addedEventIds: savedEventIds || [],
          darkMode: savedDarkMode || 'system',
        },
      });
      loaded.current = true;
    })();
  }, []);

  // Persist on changes (skip initial load)
  useEffect(() => {
    if (loaded.current) saveActivities(state.activities);
  }, [state.activities]);

  useEffect(() => {
    if (loaded.current) saveExpenses(state.expenses);
  }, [state.expenses]);

  useEffect(() => {
    if (loaded.current) saveSettings(state.settings);
  }, [state.settings]);

  useEffect(() => {
    if (loaded.current) {
      AsyncStorage.setItem(STORAGE_KEYS.addedEventIds, JSON.stringify(state.addedEventIds)).catch(() => {});
    }
  }, [state.addedEventIds]);

  useEffect(() => {
    if (loaded.current) {
      AsyncStorage.setItem(STORAGE_KEYS.darkMode, state.darkMode).catch(() => {});
    }
  }, [state.darkMode]);

  // Fetch live weather on mount and every 30 min
  useEffect(() => {
    const loadWeather = async () => {
      const liveWeather = await fetchLiveWeather();
      if (liveWeather && Object.keys(liveWeather).length >= 6) {
        dispatch({ type: 'SET_WEATHER', payload: liveWeather });
      }
    };
    loadWeather();
    const interval = setInterval(loadWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

export default AppContext;
