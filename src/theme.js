import { useColorScheme } from 'react-native';
import { useAppContext } from './context/AppContext';

// Keep original exports for backward compatibility during migration
export const ACCENT = "#F59E0B";
export const ACCENT_LIGHT = "#FEF3C7";
export const GREEN = "#22C55E";
export const GRAY = "#9CA3AF";
export const DARK = "#1F2937";
export const LIGHT_BG = "#F9FAFB";
export const WHITE = "#FFFFFF";

const lightTheme = {
  accent: ACCENT,
  accentLight: ACCENT_LIGHT,
  green: GREEN,
  bg: '#F9FAFB',
  surface: '#FFFFFF',
  cardBg: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#9CA3AF',
  textTertiary: '#6B7280',
  border: '#E5E7EB',
  headerBg: '#1F2937',
  headerText: '#FFFFFF',
  inputBg: '#FFFFFF',
  inputBorder: '#E5E7EB',
  sectionBg: '#F3F4F6',
  isDark: false,
};

const darkTheme = {
  accent: ACCENT,
  accentLight: '#78350F',
  green: GREEN,
  bg: '#111827',
  surface: '#1F2937',
  cardBg: '#1F2937',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textTertiary: '#D1D5DB',
  border: '#374151',
  headerBg: '#0F172A',
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
