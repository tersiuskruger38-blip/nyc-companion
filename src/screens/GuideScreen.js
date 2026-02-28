import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { GUIDE_SECTIONS } from '../data/guide';
import { useTheme } from '../theme';

function GuideItem({ item, index, sectionId, openItem, setOpenItem, theme }) {
  const itemKey = `${sectionId}-${index}`;
  const isOpen = openItem === itemKey;
  return (
    <View style={{ marginTop: 6 }}>
      <TouchableOpacity
        onPress={() => setOpenItem(isOpen ? null : itemKey)}
        style={[styles.itemBtn, { backgroundColor: theme.bg }]}
        accessibilityRole="button"
        accessibilityLabel={item.q}
        accessibilityState={{ expanded: isOpen }}
      >
        <Text style={[styles.itemQ, { color: theme.text }]}>{item.q}</Text>
        <Text style={[styles.itemToggle, { color: theme.textSecondary }]}>{isOpen ? '−' : '+'}</Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={[styles.itemAnswer, { backgroundColor: theme.cardBg }]}>
          <Text style={[styles.itemA, { color: theme.textTertiary }]}>{item.a}</Text>
        </View>
      )}
    </View>
  );
}

export default function GuideScreen() {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [openSection, setOpenSection] = useState('transport');
  const [openItem, setOpenItem] = useState(null);

  const sections = GUIDE_SECTIONS.map(section => {
    const items = search
      ? section.items.filter(i => i.q.toLowerCase().includes(search.toLowerCase()) || i.a.toLowerCase().includes(search.toLowerCase()))
      : section.items;
    if (search && !items.length) return null;
    return { ...section, filteredItems: items };
  }).filter(Boolean);

  const renderHeader = () => (
    <View>
      <Text style={[styles.title, { color: theme.text }]} accessibilityRole="header">NYC Survival Guide</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Everything you need to know — from a first-timer's perspective</Text>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="🔍 Search tips..."
        placeholderTextColor={theme.textSecondary}
        style={[styles.searchInput, { backgroundColor: theme.cardBg, borderColor: theme.inputBorder, color: theme.text }]}
        accessibilityLabel="Search survival guide"
      />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <FlatList
        data={sections}
        keyExtractor={s => s.id}
        contentContainerStyle={styles.container}
        ListHeaderComponent={renderHeader}
        renderItem={({ item: section }) => {
          const isOpen = openSection === section.id || !!search;
          return (
            <View style={{ marginBottom: 10 }}>
              <TouchableOpacity
                onPress={() => setOpenSection(isOpen && !search ? null : section.id)}
                style={[styles.sectionBtn, { backgroundColor: theme.cardBg }]}
                accessibilityRole="button"
                accessibilityLabel={section.title}
                accessibilityState={{ expanded: isOpen }}
              >
                <Text style={[styles.sectionTitle, { color: theme.text }]} accessibilityRole="header">{section.title}</Text>
                <Text style={[styles.arrow, { color: theme.textSecondary }, isOpen && styles.arrowOpen]}>▼</Text>
              </TouchableOpacity>
              {isOpen && section.filteredItems.map((item, i) => (
                <GuideItem key={i} item={item} index={i} sectionId={section.id} openItem={openItem} setOpenItem={setOpenItem} theme={theme} />
              ))}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 100 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  subtitle: { fontSize: 13, marginBottom: 12 },
  searchInput: { padding: 12, borderRadius: 12, borderWidth: 1, fontSize: 14, marginBottom: 14 },
  sectionBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  arrow: { fontSize: 14 },
  arrowOpen: { transform: [{ rotate: '180deg' }] },
  itemBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderRadius: 10 },
  itemQ: { fontSize: 14, fontWeight: '600', flex: 1 },
  itemToggle: { fontSize: 16, marginLeft: 8 },
  itemAnswer: { padding: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, marginTop: -4 },
  itemA: { fontSize: 13, lineHeight: 20 },
});
