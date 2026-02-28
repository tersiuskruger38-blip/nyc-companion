import { CATEGORIES } from '../data/categories';
import { PRICE_LABELS } from '../data/categories';

const INDOOR_ALTERNATIVES = [
  { name: "Metropolitan Museum of Art", category: "museum", price: "$$", duration: "2-3 hrs", why: "World-class art — you could spend all day" },
  { name: "MoMA", category: "museum", price: "$$", duration: "2 hrs", why: "Starry Night, Campbell's Soup, and more modern icons" },
  { name: "Chelsea Market", category: "food", price: "$$", duration: "1 hr", why: "Covered food hall — eat without getting wet" },
  { name: "American Museum of Natural History", category: "museum", price: "$$", duration: "2-3 hrs", why: "Dinosaurs, space, ocean life — incredible rainy day" },
  { name: "The Oculus / Westfield WTC", category: "shopping", price: "$", duration: "1 hr", why: "Stunning architecture + shopping, all indoors" },
  { name: "Grand Central Terminal", category: "sightseeing", price: "free", duration: "30 min", why: "Beaux-Arts architecture, great food hall" },
  { name: "Comedy Cellar", category: "entertainment", price: "$$", duration: "90 min", why: "Legendary comedy club in Greenwich Village" },
  { name: "Eataly NYC Flatiron", category: "food", price: "$$", duration: "1 hr", why: "Italian food market — pasta, espresso, gelato" },
  { name: "The Strand Bookstore", category: "shopping", price: "$", duration: "45 min", why: "18 miles of books since 1927" },
  { name: "Spyscape Museum", category: "entertainment", price: "$$", duration: "90 min", why: "Interactive spy museum — fun and weatherproof" },
  { name: "Brooklyn Brewery", category: "nightlife", price: "$", duration: "1 hr", why: "Beer tasting in Williamsburg" },
];

export function getWeatherVerdict(activity, weather) {
  const cat = CATEGORIES[activity.category];
  if (!cat || !weather) return null;
  const isOutdoor = !cat.indoor;
  const isRainy = weather.rain > 50;
  const isCold = weather.temp < 5;
  const isWindy = weather.wind > 22;
  const isNice = weather.condition === "sunny" && weather.temp >= 7;
  if (isOutdoor && isRainy) {
    const alts = [...INDOOR_ALTERNATIVES].sort(() => Math.random() - 0.5).slice(0, 2);
    return { icon: "🌧️", severity: "bad", text: `Rain expected (${weather.rain}%) — not ideal outdoors.`, suggestion: "Consider swapping for:", alternatives: alts, color: "#DC2626", bg: "#FEE2E2" };
  }
  if (isOutdoor && isCold && isWindy) {
    const alts = [...INDOOR_ALTERNATIVES].sort(() => Math.random() - 0.5).slice(0, 2);
    return { icon: "🥶", severity: "warning", text: `Cold (${weather.temp}°C) & windy — rough outdoors.`, suggestion: "Bundle up or swap for:", alternatives: alts, color: "#2563EB", bg: "#DBEAFE" };
  }
  if (isOutdoor && isWindy) return { icon: "💨", severity: "warning", text: `Windy (${weather.wind} km/h) — dress warm!`, color: "#D97706", bg: "#FEF3C7" };
  if (isOutdoor && isCold) return { icon: "🧤", severity: "warning", text: `Chilly (${weather.temp}°C) — warm coat + gloves.`, color: "#2563EB", bg: "#DBEAFE" };
  if (isOutdoor && isNice) return { icon: "✨", severity: "good", text: `Perfect! ${weather.temp}°C and sunny.`, color: "#16A34A", bg: "#DCFCE7" };
  if (isOutdoor && weather.condition === "partly_cloudy") return { icon: "👍", severity: "good", text: `Good conditions — bring a light layer.`, color: "#16A34A", bg: "#DCFCE7" };
  if (cat.indoor && isRainy) return { icon: "🎯", severity: "good", text: `Smart pick for a rainy day!`, color: "#16A34A", bg: "#DCFCE7" };
  if (cat.indoor) return { icon: "🏠", severity: "neutral", text: "Indoor — weatherproof!", color: "#6B7280", bg: "#F3F4F6" };
  return { icon: "🚶", severity: "neutral", text: `${weather.temp}°C, ${weather.label.toLowerCase()}.`, color: "#6B7280", bg: "#F3F4F6" };
}
