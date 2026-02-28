import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  Modal, KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet, Keyboard,
} from 'react-native';
import { CHAT_RESPONSES } from '../data/chat';
import { sendChatMessage } from '../utils/api';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../theme';

export default function ChatOverlay({ visible, onClose }) {
  const { state } = useAppContext();
  const theme = useTheme();
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
    const aiResponse = await sendChatMessage(trimmed, allMessages.slice(-10), state.settings);

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
      <View style={[styles.bubble, m.from === 'user' ? [styles.bubbleUser, { backgroundColor: theme.accent }] : [styles.bubbleAi, { backgroundColor: theme.sectionBg }]]}>
        <Text style={[styles.bubbleText, m.from === 'user' ? { color: '#FFFFFF' } : { color: theme.text }]}>{m.text}</Text>
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
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close chat"
        />
        <View style={[styles.sheet, { backgroundColor: theme.surface }]}>
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.headerTitle, { color: theme.text }]} accessibilityRole="header">🤖 AI Travel Buddy</Text>
              <Text style={[styles.headerSub, { color: theme.textSecondary }]}>Powered by Claude · Ask me anything!</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: theme.sectionBg }]}
              accessibilityRole="button"
              accessibilityLabel="Close chat"
            >
              <Text style={[styles.closeBtnText, { color: theme.text }]}>✕</Text>
            </TouchableOpacity>
          </View>

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
                    <View style={[styles.bubble, styles.bubbleAi, styles.loadingBubble, { backgroundColor: theme.sectionBg }]}>
                      <ActivityIndicator size="small" color={theme.accent} />
                      <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Thinking...</Text>
                    </View>
                  </View>
                );
              }
              return renderMessage({ item });
            }}
          />

          <FlatList
            horizontal
            data={chips}
            keyExtractor={c => c}
            showsHorizontalScrollIndicator={false}
            style={[styles.chipScroll, { borderTopColor: theme.border }]}
            contentContainerStyle={styles.chipRow}
            renderItem={({ item: c }) => (
              <TouchableOpacity
                onPress={() => send(c)}
                style={[styles.chip, { borderColor: theme.border, backgroundColor: theme.surface }]}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel={`Quick action: ${c}`}
              >
                <Text style={[styles.chipText, { color: theme.text }]}>{c}</Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
          />

          <View style={[styles.inputRow, { borderTopColor: theme.border }]}>
            <TextInput
              ref={inputRef}
              value={input}
              onChangeText={setInput}
              onSubmitEditing={() => send(input)}
              placeholder="Ask anything about NYC..."
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.text, borderColor: theme.inputBorder, backgroundColor: theme.inputBg }]}
              returnKeyType="send"
              editable={!loading}
              autoCorrect={true}
              blurOnSubmit={false}
              accessibilityLabel="Chat message input"
            />
            <TouchableOpacity
              onPress={() => send(input)}
              style={[styles.sendBtn, { backgroundColor: theme.accent }, loading && { opacity: 0.5 }]}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel="Send message"
            >
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
  sheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, height: '88%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 16, fontWeight: '800' },
  headerSub: { fontSize: 12, marginTop: 2 },
  closeBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  closeBtnText: { fontSize: 18 },
  messagesContent: { padding: 16, paddingBottom: 8 },
  msgRow: { flexDirection: 'row', marginBottom: 10 },
  msgRowUser: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '82%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  bubbleAi: { borderBottomLeftRadius: 4 },
  bubbleUser: { borderBottomRightRadius: 4 },
  bubbleText: { fontSize: 14, lineHeight: 21 },
  loadingBubble: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  loadingText: { fontSize: 13, marginLeft: 8 },
  chipScroll: { borderTopWidth: 1, maxHeight: 44 },
  chipRow: { paddingHorizontal: 16, paddingVertical: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 12, fontWeight: '500' },
  inputRow: { flexDirection: 'row', padding: 12, paddingBottom: 24, paddingHorizontal: 16, borderTopWidth: 1 },
  input: { flex: 1, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 24, borderWidth: 1, fontSize: 15, marginRight: 8 },
  sendBtn: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  sendBtnText: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
});
