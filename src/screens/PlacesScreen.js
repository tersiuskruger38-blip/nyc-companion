import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Linking, StyleSheet } from 'react-native';
import { PLACES } from '../data/places';
import { CATEGORIES } from '../data/categories';
import { CatBadge, PriceBadge } from '../components/Badges';
import { useTheme } from '../theme';

const FILTERS = [
  { id: 'all', label: 'All' }, { id: 'food', label: 'Food' }, { id: 'sightseeing', label: 'Sights' },
  { id: 'entertainment', label: 'Fun' }, { id: 'nightlife', label: 'Night' }, { id: 'bar', label: 'Bars' },
  { id: 'shopping', label: 'Shop' }, { id: 'museum', label: 'Museum' }, { id: 'park', label: 'Parks' },
  { id: 'photo', label: 'Photo' }, { id: 'sports', label: 'Sports' }, { id: 'coffee', label: 'Coffee' },
];
const PRICES = [
  { id: 'all', label: 'Any $' }, { id: 'free', label: 'Free' }, { id: '$', label: '$' },
  { id: '$$', label: '$$' }, { id: '$$$', label: '$$$' }, { id: '$$$$', label: '$$$$' },
];
const PRIORITIES = [
  { id: 'all', label: 'All' },
  { id: 'must-visit', label: 'Must Visit' },
  { id: 'recommended', label: 'Recommended' },
  { id: 'if-time', label: 'If Time' },
];
const PRIORITY_ORDER = { 'must-visit': 0, 'recommended': 1, 'if-time': 2 };
const PRIORITY_COLORS = {
  'must-visit': { bg: '#DBEAFE', text: '#1D4ED8' },
  'recommended': { bg: '#FEF3C7', text: '#92400E' },
  'if-time': { bg: '#F3F4F6', text: '#6B7280' },
};

function PlaceCard({ p, isExpanded, onToggle, onVisit, theme }) {
  const cat = CATEGORIES[p.category] || CATEGORIES.sightseeing;
  const prioStyle = PRIORITY_COLORS[p.priority];
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onToggle}
      style={[styles.card, { backgroundColor: theme.cardBg, borderLeftColor: p.priority === 'must-visit' ? theme.accent : cat.color }]}
      accessibilityRole="button"
      accessibilityLabel={`${p.name}, ${cat.label}, ${p.neighborhood}${p.status === 'visited' ? ', visited' : ''}`}
      accessibilityHint={isExpanded ? 'Tap to collapse' : 'Tap to expand details'}
    >
      <View style={styles.cardRow}>
        <Text style={styles.cardEmoji} accessibilityLabel={cat.label}>{cat.emoji}</Text>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.cardName, { color: theme.text }]}>{p.name}</Text>
            {p.priority === 'must-visit' && prioStyle && (
              <View style={[styles.priorityBadge, { backgroundColor: prioStyle.bg }]}>
                <Text style={[styles.priorityBadgeText, { color: prioStyle.text }]}>Must Visit</Text>
              </View>
            )}
          </View>
          <View style={styles.badgeRow}>
            <CatBadge cat={p.category} />
            <PriceBadge price={p.price} />
            <Text style={[styles.neighborhood, { color: theme.textSecondary }]}>{p.neighborhood}</Text>
          </View>
        </View>
        {p.status === 'visited' && <Text style={{ fontSize: 18, color: theme.green }} accessibilityLabel="Visited">Done</Text>}
      </View>
      {isExpanded && (
        <View style={[styles.expandedSection, { borderTopColor: theme.border }]}>
          <Text style={[styles.desc, { color: theme.textTertiary }]}>{p.description}</Text>
          {p.address && (
            <TouchableOpacity
              onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(p.address)}`)}
              accessibilityRole="link"
              accessibilityLabel={`Open ${p.address} in maps`}
            >
              <Text style={[styles.address, { color: theme.accent }]}>{p.address}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.visitBtn, { backgroundColor: p.status === 'visited' ? '#DCFCE7' : '#22C55E' }]}
            onPress={onVisit}
            accessibilityRole="button"
            accessibilityLabel={p.status === 'visited' ? 'Mark as not visited' : 'Mark as visited'}
          >
            <Text style={[styles.visitBtnText, p.status === 'visited' && styles.visitedBtnText]}>
              {p.status === 'visited' ? 'Unvisit' : 'Visited'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function PlacesScreen() {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [places, setPlaces] = useState(PLACES);
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    const result = places.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.neighborhood.toLowerCase().includes(search.toLowerCase())) return false;
      if (filter !== 'all' && p.category !== filter) return false;
      if (priceFilter !== 'all' && p.price !== priceFilter) return false;
      if (priorityFilter !== 'all' && p.priority !== priorityFilter) return false;
      return true;
    });
    return result.sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3));
  }, [places, search, filter, priceFilter, priorityFilter]);

  const toggleStatus = (id) => {
    setPlaces(ps => ps.map(p => p.id === id ? { ...p, status: p.status === 'visited' ? 'want' : 'visited' } : p));
  };

  const renderChip = (item, activeId, onPress, activeColor) => (
    <TouchableOpacity
      onPress={() => onPress(item.id)}
      style={[
        styles.filterChip,
        { borderColor: theme.border, borderWidth: 1, backgroundColor: 'transparent' },
        activeId === item.id && { backgroundColor: activeColor || theme.accent, borderColor: activeColor || theme.accent },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Filter: ${item.label}`}
      accessibilityState={{ selected: activeId === item.id }}
    >
      <Text style={[styles.filterText, { color: theme.textTertiary }, activeId === item.id && { color: '#FFFFFF' }]}>{item.label}</Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View>
      <Text style={[styles.title, { color: theme.text }]} accessibilityRole="header">Places & Wishlist</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{PLACES.length} curated spots across NYC</Text>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search places or neighborhoods..."
        placeholderTextColor={theme.textSecondary}
        style={[styles.searchInput, { backgroundColor: theme.cardBg, borderColor: theme.inputBorder, color: theme.text }]}
        accessibilityLabel="Search places"
      />

      <FlatList
        horizontal
        data={PRIORITIES}
        keyExtractor={f => f.id}
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 8 }}
        renderItem={({ item }) => renderChip(item, priorityFilter, setPriorityFilter, theme.accent)}
        ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
      />

      <FlatList
        horizontal
        data={FILTERS}
        keyExtractor={f => f.id}
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 8 }}
        renderItem={({ item }) => renderChip(item, filter, setFilter, theme.accent)}
        ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
      />

      <FlatList
        horizontal
        data={PRICES}
        keyExtractor={p => p.id}
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 14 }}
        renderItem={({ item }) => renderChip(item, priceFilter, setPriceFilter, theme.green)}
        ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
      />

      <Text style={[styles.count, { color: theme.textSecondary }]}>{filtered.length} places</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
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
            theme={theme}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 100 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  subtitle: { fontSize: 13, marginBottom: 12 },
  searchInput: { padding: 12, borderRadius: 10, borderWidth: 1, fontSize: 14, marginBottom: 10 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  filterText: { fontSize: 12, fontWeight: '600' },
  count: { fontSize: 12, marginBottom: 10 },
  card: { borderRadius: 16, padding: 12, marginBottom: 8, borderLeftWidth: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 2, elevation: 1 },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  cardEmoji: { fontSize: 22, marginRight: 10 },
  cardName: { fontWeight: '700', fontSize: 14 },
  priorityBadge: { marginLeft: 8, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 6 },
  priorityBadgeText: { fontSize: 10, fontWeight: '700' },
  badgeRow: { flexDirection: 'row', marginTop: 3, flexWrap: 'wrap', alignItems: 'center' },
  neighborhood: { fontSize: 11, marginLeft: 6 },
  expandedSection: { marginTop: 10, paddingTop: 10, borderTopWidth: 1 },
  desc: { fontSize: 13, lineHeight: 20 },
  address: { marginTop: 6, fontSize: 12 },
  visitBtn: { marginTop: 10, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  visitedBtn: { backgroundColor: '#DCFCE7' },
  visitBtnText: { fontWeight: '600', fontSize: 13, color: '#FFFFFF' },
  visitedBtnText: { color: '#22C55E' },
});
