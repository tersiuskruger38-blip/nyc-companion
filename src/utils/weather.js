import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = '@nyc_weather_cache';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// Trip dates: Mar 13-18, 2026
const TRIP_START = new Date('2026-03-13');

// WMO Weather Code mapping
function mapWeatherCode(code) {
  if (code === 0) return { condition: 'sunny', icon: '☀️', label: 'Clear Sky' };
  if (code === 1) return { condition: 'sunny', icon: '🌤️', label: 'Mainly Clear' };
  if (code === 2) return { condition: 'partly_cloudy', icon: '⛅', label: 'Partly Cloudy' };
  if (code === 3) return { condition: 'cloudy', icon: '☁️', label: 'Overcast' };
  if (code >= 45 && code <= 48) return { condition: 'cloudy', icon: '🌫️', label: 'Foggy' };
  if (code >= 51 && code <= 55) return { condition: 'rainy', icon: '🌦️', label: 'Light Drizzle' };
  if (code >= 56 && code <= 57) return { condition: 'rainy', icon: '🌧️', label: 'Freezing Drizzle' };
  if (code >= 61 && code <= 65) return { condition: 'rainy', icon: '🌧️', label: 'Rain' };
  if (code >= 66 && code <= 67) return { condition: 'rainy', icon: '🌧️', label: 'Freezing Rain' };
  if (code >= 71 && code <= 77) return { condition: 'rainy', icon: '🌨️', label: 'Snow' };
  if (code >= 80 && code <= 82) return { condition: 'rainy', icon: '🌧️', label: 'Rain Showers' };
  if (code >= 85 && code <= 86) return { condition: 'rainy', icon: '🌨️', label: 'Snow Showers' };
  if (code >= 95) return { condition: 'rainy', icon: '⛈️', label: 'Thunderstorm' };
  return { condition: 'partly_cloudy', icon: '⛅', label: 'Partly Cloudy' };
}

export async function fetchLiveWeather() {
  try {
    // Check cache
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        return data;
      }
    }

    const url = 'https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max,precipitation_probability_max&timezone=America/New_York';
    const response = await fetch(url);
    if (!response.ok) return null;

    const json = await response.json();
    const daily = json.daily;
    if (!daily || !daily.time) return null;

    const weatherByDay = {};
    for (let dayIndex = 0; dayIndex < 6; dayIndex++) {
      const tripDate = new Date(TRIP_START);
      tripDate.setDate(tripDate.getDate() + dayIndex);
      const dateStr = tripDate.toISOString().split('T')[0];

      const apiIndex = daily.time.indexOf(dateStr);
      if (apiIndex === -1) continue;

      const high = Math.round(daily.temperature_2m_max[apiIndex]);
      const low = Math.round(daily.temperature_2m_min[apiIndex]);
      const temp = Math.round((high + low) / 2);
      const code = daily.weathercode[apiIndex];
      const wind = Math.round(daily.windspeed_10m_max[apiIndex]);
      const rain = daily.precipitation_probability_max[apiIndex] || 0;
      const { condition, icon, label } = mapWeatherCode(code);

      weatherByDay[dayIndex] = {
        temp, high, low, condition, icon, label,
        wind, rain, humidity: 50, // Open-Meteo free tier doesn't include humidity in daily
      };
    }

    // Only return if we got at least some days
    if (Object.keys(weatherByDay).length === 0) return null;

    // Cache it
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({
      data: weatherByDay,
      timestamp: Date.now(),
    }));

    return weatherByDay;
  } catch (error) {
    console.warn('Live weather fetch failed:', error);
    return null;
  }
}
