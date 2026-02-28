import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { GUIDE_SECTIONS } from '../data/guide';
import { DARK, GRAY, WHITE, LIGHT_BG } from '../theme';

export default function GuideScreen() {
  const [search, setSearch] = useState('');
  const [openSection, setOpenSection] = useState('transport');
  const [openItem, setOpenItem] = useState(null);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.title}>NYC Survival Guide</Text>
      <Text style={styles.subtitle}>Everything you need to know — from a first-timer's perspective</Text>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="🔍 Search tips..."
        placeholderTextColor={GRAY}
        style={styles.searchInput}
      />

      {GUIDE_SECTIONS.map(section => {
        const items = search
          ? section.items.filter(i => i.q.toLowerCase().includes(search.toLowerCase()) || i.a.toLowerCase().includes(search.toLowerCase()))
          : section.items;
        if (search && !items.length) return null;
        const isOpen = openSection === section.id || !!search;

        return (
          <View key={section.id} style={{ marginBottom: 10 }}>
            <TouchableOpacity
              onPress={() => setOpenSection(isOpen && !search ? null : section.id)}
              style={styles.sectionBtn}
            >
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={[styles.arrow, isOpen && styles.arrowOpen]}>▼</Text>
            </TouchableOpacity>

            {isOpen && items.map((item, i) => {
              const itemKey = `${section.id}-${i}`;
              const isItemOpen = openItem === itemKey;
              return (
                <View key={i} style={{ marginTop: 6 }}>
                  <TouchableOpacity
                    onPress={() => setOpenItem(isItemOpen ? null : itemKey)}
                    style={styles.itemBtn}
                  >
                    <Text style={styles.itemQ}>{item.q}</Text>
                    <Text style={styles.itemToggle}>{isItemOpen ? '−' : '+'}</Text>
                  </TouchableOpacity>
                  {isItemOpen && (
                    <View style={styles.itemAnswer}>
                      <Text style={styles.itemA}>{item.a}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: LIGHT_BG },
  container: { padding: 16, paddingBottom: 100 },
  title: { fontSize: 22, fontWeight: '800', color: DARK, marginBottom: 4 },
  subtitle: { fontSize: 13, color: GRAY, marginBottom: 12 },
  searchInput: { backgroundColor: WHITE, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', fontSize: 14, marginBottom: 14, color: DARK },
  sectionBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, backgroundColor: WHITE, borderRadius: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: DARK },
  arrow: { fontSize: 14, color: GRAY },
  arrowOpen: { transform: [{ rotate: '180deg' }] },
  itemBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: LIGHT_BG, borderRadius: 10 },
  itemQ: { fontSize: 14, fontWeight: '600', color: DARK, flex: 1 },
  itemToggle: { fontSize: 16, color: GRAY, marginLeft: 8 },
  itemAnswer: { padding: 10, backgroundColor: WHITE, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, marginTop: -4 },
  itemA: { fontSize: 13, color: '#374151', lineHeight: 20 },
});
