import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  Modal, KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet, Keyboard,
} from 'react-native';
import { CHAT_RESPONSES } from '../data/chat';
import { sendChatMessage } from '../utils/api';
import { ACCENT, DARK, GRAY, WHITE } from '../theme';

export default function ChatOverlay({ visible, onClose, settings }) {
  const [messages, setMessages] = useState([
    { id: '0', from: 'ai', text: "Hey Tersius & Suzanne! 👋 Welcome to NYC! I'm your AI travel buddy. Ask me anything about your trip, or tap a quick action below!" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);
  const inputRef = useRef(null);
  const chips = Object.keys(CHAT_RESPONSES);

  useEffect(() => {
    if (visible) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [visible]);

  const scrollToEnd = () => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const send = async (text) => {
    if (!text.trim() || loading) return;
    Keyboard.dismiss();
    const trimmed = text.trim();
    const userMsg = { id: String(Date.now()), from: 'user', text: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    scrollToEnd();

    const allMessages = [...messages, userMsg];
    const aiResponse = await sendChatMessage(trimmed, allMessages.slice(-10), settings);

    if (aiResponse) {
      setMessages(prev => [...prev, { id: String(Date.now() + 1), from: 'ai', text: aiResponse }]);
    } else {
      const fallback = CHAT_RESPONSES[trimmed] || "I'm having trouble connecting right now. Check your itinerary for today's plan, or the Guide tab for practical NYC tips! 🗽";
      setMessages(prev => [...prev, { id: String(Date.now() + 1), from: 'ai', text: fallback }]);
    }
    setLoading(false);
    scrollToEnd();
  };

  const renderMessage = ({ item: m }) => (
    <View style={[styles.msgRow, m.from === 'user' && styles.msgRowUser]}>
      <View style={[styles.bubble, m.from === 'user' ? styles.bubbleUser : styles.bubbleAi]}>
        <Text style={[styles.bubbleText, m.from === 'user' && styles.bubbleTextUser]}>{m.text}</Text>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
        keyboardVerticalOffset={0}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>🤖 AI Travel Buddy</Text>
              <Text style={styles.headerSub}>Powered by Claude · Ask me anything!</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={[...messages, ...(loading ? [{ id: 'loading', from: 'loading', text: '' }] : [])]}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messagesContent}
            onContentSizeChange={scrollToEnd}
            renderItem={({ item }) => {
              if (item.from === 'loading') {
                return (
                  <View style={styles.msgRow}>
                    <View style={[styles.bubble, styles.bubbleAi, styles.loadingBubble]}>
                      <ActivityIndicator size="small" color={ACCENT} />
                      <Text style={styles.loadingText}>Thinking...</Text>
                    </View>
                  </View>
                );
              }
              return renderMessage({ item });
            }}
          />

          {/* Quick chips */}
          <FlatList
            horizontal
            data={chips}
            keyExtractor={c => c}
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
            contentContainerStyle={styles.chipRow}
            renderItem={({ item: c }) => (
              <TouchableOpacity onPress={() => send(c)} style={styles.chip} disabled={loading}>
                <Text style={styles.chipText}>{c}</Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
          />

          {/* Input */}
          <View style={styles.inputRow}>
            <TextInput
              ref={inputRef}
              value={input}
              onChangeText={setInput}
              onSubmitEditing={() => send(input)}
              placeholder="Ask anything about NYC..."
              placeholderTextColor={GRAY}
              style={styles.input}
              returnKeyType="send"
              editable={!loading}
              autoCorrect={true}
              blurOnSubmit={false}
            />
            <TouchableOpacity onPress={() => send(input)} style={[styles.sendBtn, loading && { opacity: 0.5 }]} disabled={loading}>
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
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: { backgroundColor: WHITE, borderTopLeftRadius: 20, borderTopRightRadius: 20, height: '88%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: DARK },
  headerSub: { fontSize: 12, color: GRAY, marginTop: 2 },
  closeBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  closeBtnText: { fontSize: 18 },
  messagesContent: { padding: 16, paddingBottom: 8 },
  msgRow: { flexDirection: 'row', marginBottom: 10 },
  msgRowUser: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '82%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  bubbleAi: { backgroundColor: '#F3F4F6', borderBottomLeftRadius: 4 },
  bubbleUser: { backgroundColor: ACCENT, borderBottomRightRadius: 4 },
  bubbleText: { fontSize: 14, color: DARK, lineHeight: 21 },
  bubbleTextUser: { color: WHITE },
  loadingBubble: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  loadingText: { fontSize: 13, color: GRAY, marginLeft: 8 },
  chipScroll: { borderTopWidth: 1, borderTopColor: '#F3F4F6', maxHeight: 44 },
  chipRow: { paddingHorizontal: 16, paddingVertical: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: WHITE },
  chipText: { fontSize: 12, color: DARK, fontWeight: '500' },
  inputRow: { flexDirection: 'row', padding: 12, paddingBottom: 24, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  input: { flex: 1, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 24, borderWidth: 1, borderColor: '#E5E7EB', fontSize: 15, color: DARK, marginRight: 8, backgroundColor: '#FAFAFA' },
  sendBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: ACCENT, alignItems: 'center', justifyContent: 'center' },
  sendBtnText: { color: WHITE, fontSize: 20, fontWeight: '700' },
});
