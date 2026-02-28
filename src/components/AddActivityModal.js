import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Modal,
  ScrollView, KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { CATEGORIES } from '../data/categories';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../theme';

const CATEGORY_KEYS = Object.keys(CATEGORIES);
const PRICE_OPTIONS = ['free', '$', '$$', '$$$'];

function parseTimeToSection(timeStr) {
  if (!timeStr) return 'afternoon';
  const match = timeStr.match(/(\d{1,2})/);
  if (!match) return 'afternoon';
  const hour = parseInt(match[1]);
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

export default function AddActivityModal({ visible, onClose, dayId }) {
  const { dispatch } = useAppContext();
  const theme = useTheme();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('sightseeing');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('60 min');
  const [price, setPrice] = useState('free');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');

  const resetForm = () => {
    setName('');
    setCategory('sightseeing');
    setTime('');
    setDuration('60 min');
    setPrice('free');
    setDescription('');
    setAddress('');
  };

  const handleAdd = () => {
    if (!name.trim()) return;
    const section = parseTimeToSection(time);
    const activity = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      category,
      time: time || '12:00',
      duration,
      price,
      description: description.trim(),
      address: address.trim(),
      notes: '',
      status: 'upcoming',
      starred: false,
    };
    dispatch({ type: 'ADD_ACTIVITY', payload: { dayId, section, activity } });
    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close add activity form"
        />
        <View style={[styles.sheet, { backgroundColor: theme.surface }]}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
              <Text style={[styles.title, { color: theme.text }]} accessibilityRole="header">Add Activity</Text>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.closeBtn, { backgroundColor: theme.sectionBg }]}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <Text style={[styles.closeBtnText, { color: theme.text }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { color: theme.text }]}>Name *</Text>
            <TextInput
              style={[styles.input, { color: theme.text, backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Visit the Statue of Liberty"
              placeholderTextColor={theme.textSecondary}
              accessibilityLabel="Activity name"
            />

            <Text style={[styles.label, { color: theme.text }]}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              {CATEGORY_KEYS.map(key => {
                const cat = CATEGORIES[key];
                const active = category === key;
                return (
                  <TouchableOpacity
                    key={key}
                    onPress={() => setCategory(key)}
                    style={[styles.catChip, { backgroundColor: active ? cat.color : theme.sectionBg }]}
                    accessibilityRole="button"
                    accessibilityLabel={cat.label}
                    accessibilityState={{ selected: active }}
                  >
                    <Text style={[styles.catChipText, { color: active ? '#FFFFFF' : theme.text }]}>
                      {cat.emoji} {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: theme.text }]}>Time</Text>
                <TextInput
                  style={[styles.input, { color: theme.text, backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}
                  value={time}
                  onChangeText={setTime}
                  placeholder="e.g. 14:00"
                  placeholderTextColor={theme.textSecondary}
                  accessibilityLabel="Activity time"
                />
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: theme.text }]}>Duration</Text>
                <TextInput
                  style={[styles.input, { color: theme.text, backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}
                  value={duration}
                  onChangeText={setDuration}
                  placeholder="e.g. 90 min"
                  placeholderTextColor={theme.textSecondary}
                  accessibilityLabel="Activity duration"
                />
              </View>
            </View>

            <Text style={[styles.label, { color: theme.text }]}>Price</Text>
            <View style={styles.priceRow}>
              {PRICE_OPTIONS.map(p => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPrice(p)}
                  style={[styles.priceChip, { backgroundColor: price === p ? theme.accent : theme.sectionBg }]}
                  accessibilityRole="button"
                  accessibilityLabel={p === 'free' ? 'Free' : p}
                  accessibilityState={{ selected: price === p }}
                >
                  <Text style={[styles.priceChipText, { color: price === p ? '#FFFFFF' : theme.text }]}>
                    {p === 'free' ? 'Free' : p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: theme.text }]}>Description</Text>
            <TextInput
              style={[styles.input, styles.multiline, { color: theme.text, backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}
              value={description}
              onChangeText={setDescription}
              placeholder="What's this activity about?"
              placeholderTextColor={theme.textSecondary}
              multiline
              accessibilityLabel="Activity description"
            />

            <Text style={[styles.label, { color: theme.text }]}>Address</Text>
            <TextInput
              style={[styles.input, { color: theme.text, backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}
              value={address}
              onChangeText={setAddress}
              placeholder="e.g. 123 Broadway, New York"
              placeholderTextColor={theme.textSecondary}
              accessibilityLabel="Activity address"
            />

            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: theme.accent, opacity: name.trim() ? 1 : 0.5 }]}
              onPress={handleAdd}
              disabled={!name.trim()}
              accessibilityRole="button"
              accessibilityLabel="Add activity to itinerary"
            >
              <Text style={styles.addBtnText}>Add to Day</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%' },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1 },
  title: { fontSize: 18, fontWeight: '800' },
  closeBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  closeBtnText: { fontSize: 18 },
  label: { fontSize: 13, fontWeight: '700', marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 14, marginBottom: 12 },
  multiline: { minHeight: 70, textAlignVertical: 'top' },
  row: { flexDirection: 'row' },
  catChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 6 },
  catChipText: { fontSize: 12, fontWeight: '600' },
  priceRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  priceChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  priceChipText: { fontSize: 13, fontWeight: '600' },
  addBtn: { borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  addBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
});
