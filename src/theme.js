import { useColorScheme } from 'react-native';
import { useAppContext } from './context/AppContext';

// Clean minimal palette — muted blue accent, white-forward design
export const ACCENT = "#2563EB";
export const ACCENT_LIGHT = "#EFF6FF";
export const ACCENT_WARM = "#F97316";
export const GREEN = "#22C55E";
export const GRAY = "#9CA3AF";
export const DARK = "#1F2937";
export const LIGHT_BG = "#FFFFFF";
export const WHITE = "#FFFFFF";

const lightTheme = {
  accent: ACCENT,
  accentLight: ACCENT_LIGHT,
  accentWarm: ACCENT_WARM,
  green: GREEN,
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  cardBg: '#F9FAFB',
  text: '#111827',
  textSecondary: '#9CA3AF',
  textTertiary: '#6B7280',
  border: '#F3F4F6',
  headerBg: '#FFFFFF',
  headerText: '#111827',
  inputBg: '#F9FAFB',
  inputBorder: '#E5E7EB',
  sectionBg: '#F9FAFB',
  isDark: false,
};

const darkTheme = {
  accent: ACCENT,
  accentLight: '#1E3A5F',
  accentWarm: ACCENT_WARM,
  green: GREEN,
  bg: '#111827',
  surface: '#1F2937',
  cardBg: '#1F2937',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textTertiary: '#D1D5DB',
  border: '#374151',
  headerBg: '#111827',
  headerText: '#F9FAFB',
  inputBg: '#374151',
  inputBorder: '#4B5563',
  sectionBg: '#374151',
  isDark: true,
};

export function useTheme() {
  const { state } = useAppContext();
  const systemScheme = useColorScheme();

  if (state.darkMode === 'dark') return darkTheme;
  if (state.darkMode === 'light') return lightTheme;
  // 'system'
  return systemScheme === 'dark' ? darkTheme : lightTheme;
}
