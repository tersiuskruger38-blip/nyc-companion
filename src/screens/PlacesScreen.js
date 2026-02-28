import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, Linking, StyleSheet } from 'react-native';
import { PLACES } from '../data/places';
import { CATEGORIES } from '../data/categories';
import { CatBadge, PriceBadge } from '../components/Badges';
import { ACCENT, DARK, GRAY, GREEN, WHITE, LIGHT_BG } from '../theme';

const FILTERS = [
  { id: 'all', label: 'All' }, { id: 'food', label: '🍕 Food' }, { id: 'sightseeing', label: '🗽 Sights' },
  { id: 'entertainment', label: '🎭 Fun' }, { id: 'nightlife', label: '🌃 Night' }, { id: 'bar', label: '🍸 Bars' },
  { id: 'shopping', label: '🛍️ Shop' }, { id: 'museum', label: '🏛️ Museum' }, { id: 'park', label: '🌳 Parks' },
  { id: 'photo', label: '📸 Photo' }, { id: 'sports', label: '🏟️ Sports' }, { id: 'coffee', label: '☕ Coffee' },
];
const PRICES = [
  { id: 'all', label: 'Any $' }, { id: 'free', label: 'Free' }, { id: '$', label: '$' },
  { id: '$$', label: '$$' }, { id: '$$$', label: '$$$' }, { id: '$$$$', label: '$$$$' },
];

function PlaceCard({ p, isExpanded, onToggle, onVisit }) {
  const cat = CATEGORIES[p.category] || CATEGORIES.sightseeing;
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onToggle} style={[styles.card, { borderLeftColor: cat.color }]}>
      <View style={styles.cardRow}>
        <Text style={styles.cardEmoji}>{cat.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardName}>{p.name}</Text>
          <View style={styles.badgeRow}>
            <CatBadge cat={p.category} />
            <PriceBadge price={p.price} />
            <Text style={styles.neighborhood}>{p.neighborhood}</Text>
          </View>
        </View>
        {p.status === 'visited' && <Text style={{ fontSize: 18 }}>✅</Text>}
      </View>
      {isExpanded && (
        <View style={styles.expandedSection}>
          <Text style={styles.desc}>{p.description}</Text>
          {p.address && (
            <TouchableOpacity onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(p.address)}`)}>
              <Text style={styles.address}>📍 {p.address}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.visitBtn, p.status === 'visited' && styles.visitedBtn]} onPress={onVisit}>
            <Text style={[styles.visitBtnText, p.status === 'visited' && styles.visitedBtnText]}>
              {p.status === 'visited' ? '↩ Unvisit' : '✓ Visited'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function PlacesScreen() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [places, setPlaces] = useState(PLACES);
  const [expanded, setExpanded] = useState(null);

  const filtered = places.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.neighborhood.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter !== 'all' && p.category !== filter) return false;
    if (priceFilter !== 'all' && p.price !== priceFilter) return false;
    return true;
  });

  const toggleStatus = (id) => {
    setPlaces(ps => ps.map(p => p.id === id ? { ...p, status: p.status === 'visited' ? 'want' : 'visited' } : p));
  };

  const renderHeader = () => (
    <View>
      <Text style={styles.title}>Places & Wishlist</Text>
      <Text style={styles.subtitle}>{PLACES.length} curated spots across NYC</Text>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="🔍 Search places or neighborhoods..."
        placeholderTextColor={GRAY}
        style={styles.searchInput}
      />

      <FlatList
        horizontal
        data={FILTERS}
        keyExtractor={f => f.id}
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 8 }}
        renderItem={({ item: f }) => (
          <TouchableOpacity onPress={() => setFilter(f.id)} style={[styles.filterChip, filter === f.id && styles.filterActive]}>
            <Text style={[styles.filterText, filter === f.id && styles.filterTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
      />

      <FlatList
        horizontal
        data={PRICES}
        keyExtractor={p => p.id}
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 14 }}
        renderItem={({ item: p }) => (
          <TouchableOpacity onPress={() => setPriceFilter(p.id)} style={[styles.filterChip, priceFilter === p.id && styles.priceActive]}>
            <Text style={[styles.filterText, priceFilter === p.id && styles.filterTextActive]}>{p.label}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
      />

      <Text style={styles.count}>{filtered.length} places</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: LIGHT_BG }}>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.container}
        ListHeaderComponent={renderHeader}
        renderItem={({ item: p }) => (
          <PlaceCard
            p={p}
            isExpanded={expanded === p.id}
            onToggle={() => setExpanded(expanded === p.id ? null : p.id)}
            onVisit={() => toggleStatus(p.id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 100 },
  title: { fontSize: 22, fontWeight: '800', color: DARK, marginBottom: 4 },
  subtitle: { fontSize: 13, color: GRAY, marginBottom: 12 },
  searchInput: { backgroundColor: WHITE, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', fontSize: 14, marginBottom: 10, color: DARK },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: WHITE },
  filterActive: { backgroundColor: ACCENT },
  priceActive: { backgroundColor: GREEN },
  filterText: { fontSize: 12, fontWeight: '600', color: DARK },
  filterTextActive: { color: WHITE },
  count: { fontSize: 12, color: GRAY, marginBottom: 10 },
  card: { backgroundColor: WHITE, borderRadius: 14, padding: 12, marginBottom: 8, borderLeftWidth: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  cardEmoji: { fontSize: 22, marginRight: 10 },
  cardName: { fontWeight: '700', fontSize: 14, color: DARK },
  badgeRow: { flexDirection: 'row', marginTop: 3, flexWrap: 'wrap', alignItems: 'center' },
  neighborhood: { fontSize: 11, color: GRAY, marginLeft: 6 },
  expandedSection: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  desc: { fontSize: 13, color: '#374151', lineHeight: 20 },
  address: { marginTop: 6, fontSize: 12, color: '#3B82F6' },
  visitBtn: { marginTop: 10, paddingVertical: 9, borderRadius: 10, backgroundColor: GREEN, alignItems: 'center' },
  visitedBtn: { backgroundColor: '#DCFCE7' },
  visitBtnText: { fontWeight: '600', fontSize: 13, color: WHITE },
  visitedBtnText: { color: GREEN },
});
