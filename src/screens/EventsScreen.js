import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Linking, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EVENTS } from '../data/events';
import { DAYS } from '../data/weather';
import { CATEGORIES } from '../data/categories';
import { CatBadge, PriceBadge } from '../components/Badges';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../theme';

const ALL_DAYS = [{ id: null, label: 'All Days' }, ...DAYS];

function parseTimeToSection(timeStr) {
  if (!timeStr) return 'afternoon';
  const match = timeStr.match(/(\d{1,2})/);
  if (!match) return 'afternoon';
  const hour = parseInt(match[1]);
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

export default function EventsScreen() {
  const { state, dispatch } = useAppContext();
  const theme = useTheme();
  const [selectedDay, setSelectedDay] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const filtered = selectedDay !== null ? EVENTS.filter(e => e.day === selectedDay) : EVENTS;

  const addEventToItinerary = (event) => {
    const section = parseTimeToSection(event.time);
    const activity = {
      id: `event_${event.id}`,
      name: event.name,
      category: event.category,
      time: event.time?.match(/\d{1,2}:\d{2}/) ? event.time.match(/\d{1,2}:\d{2}/)[0] : event.time,
      duration: '90 min',
      price: event.price,
      description: event.description,
      address: event.venue,
      notes: `Added from Events tab`,
      bookingUrl: event.bookingUrl || '',
      status: 'upcoming',
      starred: false,
    };
    dispatch({
      type: 'ADD_EVENT_TO_ITINERARY',
      payload: { eventId: event.id, dayId: event.day, section, activity },
    });
  };

  const renderHeader = () => (
    <View>
      <Text style={[styles.title, { color: theme.text }]} accessibilityRole="header">What's On</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Events happening March 13–18</Text>
      <FlatList
        horizontal
        data={ALL_DAYS}
        keyExtractor={d => String(d.id)}
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 14 }}
        renderItem={({ item: d }) => (
          <TouchableOpacity
            onPress={() => setSelectedDay(d.id)}
            style={[
              styles.chip,
              { borderColor: theme.border, borderWidth: 1, backgroundColor: 'transparent' },
              selectedDay === d.id && { backgroundColor: theme.accent, borderColor: theme.accent },
            ]}
            accessibilityRole="button"
            accessibilityLabel={d.label}
            accessibilityState={{ selected: selectedDay === d.id }}
          >
            <Text style={[styles.chipText, { color: theme.textTertiary }, selectedDay === d.id && { color: '#FFFFFF' }]}>{d.label}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
      />
    </View>
  );

  const renderEvent = ({ item: ev }) => {
    const cat = CATEGORIES[ev.category] || CATEGORIES.entertainment;
    const isAdded = state.addedEventIds.includes(ev.id);
    const isExpanded = expandedId === ev.id;
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setExpandedId(isExpanded ? null : ev.id)}
        style={[styles.card, { backgroundColor: theme.cardBg, borderLeftColor: cat.color }]}
      >
        <View style={styles.cardRow}>
          <Text style={styles.emoji} accessibilityLabel={cat.label}>{cat.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: theme.text }]}>{ev.name}</Text>
            <View style={styles.badgeRow}>
              <CatBadge cat={ev.category} />
              <PriceBadge price={ev.price} />
              <Text style={[styles.date, { color: theme.textSecondary }]}>{DAYS[ev.day]?.date}</Text>
            </View>
            <Text style={[styles.desc, { color: theme.textTertiary }]}>{ev.description}</Text>
            <Text style={[styles.meta, { color: theme.textTertiary }]}>{ev.venue} · {ev.time}</Text>

            {isExpanded && ev.details && (
              <View style={[styles.detailsBox, { backgroundColor: theme.isDark ? '#1E293B' : '#EFF6FF' }]}>
                <Text style={[styles.detailsText, { color: theme.text }]}>{ev.details}</Text>
              </View>
            )}

            <View style={styles.actionRow}>
              {ev.bookingUrl ? (
                <TouchableOpacity
                  style={[styles.bookBtn, { backgroundColor: theme.accent }]}
                  onPress={() => Linking.openURL(ev.bookingUrl)}
                  accessibilityRole="link"
                  accessibilityLabel={`Book or get tickets for ${ev.name}`}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="open-outline" size={13} color="#FFFFFF" style={{ marginRight: 5 }} />
                    <Text style={styles.bookBtnText}>Book / Get Tickets</Text>
                  </View>
                </TouchableOpacity>
              ) : null}

              {isAdded ? (
                <View style={styles.addedBadge} accessibilityLabel="Already added to itinerary">
                  <Text style={styles.addedBadgeText}>Added</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.addBtn, { borderColor: theme.accent, borderWidth: 1 }]}
                  onPress={() => addEventToItinerary(ev)}
                  accessibilityRole="button"
                  accessibilityLabel={`Add ${ev.name} to itinerary`}
                  accessibilityHint="Adds this event as an activity on the corresponding day"
                >
                  <Text style={[styles.addBtnText, { color: theme.accent }]}>+ Add to Itinerary</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.container}
        ListHeaderComponent={renderHeader}
        renderItem={renderEvent}
        ListEmptyComponent={
          <View style={styles.empty}><Text style={[styles.emptyText, { color: theme.textSecondary }]}>No events this day</Text></View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 100 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  subtitle: { fontSize: 13, marginBottom: 14 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10 },
  chipText: { fontSize: 12, fontWeight: '600' },
  empty: { alignItems: 'center', padding: 40 },
  emptyText: {},
  card: { borderRadius: 16, padding: 14, marginBottom: 10, borderLeftWidth: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 2, elevation: 1 },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start' },
  emoji: { fontSize: 24, marginRight: 10 },
  name: { fontWeight: '700', fontSize: 15 },
  badgeRow: { flexDirection: 'row', marginTop: 4, flexWrap: 'wrap', alignItems: 'center' },
  date: { fontSize: 11, marginLeft: 6 },
  desc: { fontSize: 13, lineHeight: 19, marginTop: 8 },
  meta: { marginTop: 6, fontSize: 12 },
  detailsBox: { marginTop: 10, padding: 10, borderRadius: 8 },
  detailsText: { fontSize: 13, lineHeight: 20 },
  actionRow: { flexDirection: 'row', marginTop: 10, flexWrap: 'wrap', gap: 8 },
  bookBtn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, alignSelf: 'flex-start' },
  bookBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
  addBtn: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 8, alignSelf: 'flex-start' },
  addBtnText: { fontWeight: '700', fontSize: 12 },
  addedBadge: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#DCFCE7', alignSelf: 'flex-start' },
  addedBadgeText: { color: '#16A34A', fontWeight: '700', fontSize: 12 },
});
