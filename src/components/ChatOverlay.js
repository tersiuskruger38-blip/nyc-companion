import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Modal, KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { CHAT_RESPONSES } from '../data/chat';
import { ACCENT, DARK, GRAY, WHITE } from '../theme';

export default function ChatOverlay({ visible, onClose }) {
  const [messages, setMessages] = useState([
    { id: 0, from: 'ai', text: "Hey Tersius & Suzanne! 👋 Welcome to NYC! I'm your AI travel buddy. Ask me anything about your trip, or tap a quick action below!" },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);
  const chips = Object.keys(CHAT_RESPONSES);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const send = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), from: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      const response = CHAT_RESPONSES[text] || `Great question! Here's what I'd suggest for "${text}": Check your itinerary for today's plan, or explore the Places tab for more options. You can also check the Guide for practical tips about getting around, tipping, and neighborhoods. Let me know if you need anything specific! 🗽`;
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'ai', text: response }]);
    }, 600);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>🤖 AI Travel Buddy</Text>
              <Text style={styles.headerSub}>Ask me anything about NYC!</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <ScrollView ref={scrollRef} style={styles.messages} contentContainerStyle={styles.messagesContent}>
            {messages.map(m => (
              <View key={m.id} style={[styles.msgRow, m.from === 'user' && styles.msgRowUser]}>
                <View style={[styles.bubble, m.from === 'user' ? styles.bubbleUser : styles.bubbleAi]}>
                  <Text style={[styles.bubbleText, m.from === 'user' && styles.bubbleTextUser]}>{m.text}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Quick chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll} contentContainerStyle={styles.chipRow}>
            {chips.map(c => (
              <TouchableOpacity key={c} onPress={() => send(c)} style={styles.chip}>
                <Text style={styles.chipText}>{c}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputRow}>
            <TextInput
              value={input}
              onChangeText={setInput}
              onSubmitEditing={() => send(input)}
              placeholder="Ask anything..."
              placeholderTextColor={GRAY}
              style={styles.input}
              returnKeyType="send"
            />
            <TouchableOpacity onPress={() => send(input)} style={styles.sendBtn}>
              <Text style={styles.sendBtnText}>↑</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  sheet: { backgroundColor: WHITE, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%', overflow: 'hidden' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: DARK },
  headerSub: { fontSize: 12, color: GRAY },
  closeBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  closeBtnText: { fontSize: 18 },
  messages: { flex: 1, minHeight: 200 },
  messagesContent: { padding: 16 },
  msgRow: { flexDirection: 'row', marginBottom: 10 },
  msgRowUser: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '80%', padding: 10, borderRadius: 16 },
  bubbleAi: { backgroundColor: '#F3F4F6', borderBottomLeftRadius: 4 },
  bubbleUser: { backgroundColor: ACCENT, borderBottomRightRadius: 4 },
  bubbleText: { fontSize: 14, color: DARK, lineHeight: 21 },
  bubbleTextUser: { color: WHITE },
  chipScroll: { borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  chipRow: { padding: 8, paddingHorizontal: 16, gap: 6 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: WHITE },
  chipText: { fontSize: 12, color: DARK, fontWeight: '500' },
  inputRow: { flexDirection: 'row', gap: 8, padding: 10, paddingBottom: 20, paddingHorizontal: 16 },
  input: { flex: 1, padding: 12, borderRadius: 24, borderWidth: 1, borderColor: '#E5E7EB', fontSize: 14, color: DARK },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: ACCENT, alignItems: 'center', justifyContent: 'center' },
  sendBtnText: { color: WHITE, fontSize: 18, fontWeight: '700' },
});
