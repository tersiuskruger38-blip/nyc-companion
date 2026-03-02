import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CATEGORIES, PRICE_LABELS } from '../data/categories';
import { ACCENT_LIGHT } from '../theme';

export function CatBadge({ cat }) {
  const c = CATEGORIES[cat] || CATEGORIES.sightseeing;
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.color }]}>{c.emoji} {c.label}</Text>
    </View>
  );
}

export function PriceBadge({ price }) {
  const isFree = price === 'free';
  return (
    <View style={[styles.badge, { backgroundColor: isFree ? '#DCFCE7' : ACCENT_LIGHT }]}>
      <Text style={[styles.badgeText, { color: isFree ? '#16A34A' : '#1D4ED8' }]}>
        {PRICE_LABELS[price] || price}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
