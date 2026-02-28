import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Linking, ActivityIndicator, StyleSheet } from 'react-native';
import { CATEGORIES } from '../data/categories';
import { WEATHER, DAYS } from '../data/weather';
import { getWeatherVerdict } from '../utils/weatherVerdict';
import { getSwapSuggestion } from '../utils/api';
import { CatBadge, PriceBadge } from './Badges';
import WeatherAdvice from './WeatherAdvice';
import { ACCENT, DARK, GRAY, GREEN, WHITE, ACCENT_LIGHT } from '../theme';

export default function ActivityCard({ activity, onUpdate, onSwap, onFieldUpdate, dayId, settings }) {
  const [expanded, setExpanded] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [swapResult, setSwapResult] = useState(null);
  const [commentDraft, setCommentDraft] = useState(activity.comment || '');
  const [editingComment, setEditingComment] = useState(false);
  const isDone = activity.status === 'done';
  const isSkipped = activity.status === 'skipped';
  const isStarred = activity.starred;
  const cat = CATEGORIES[activity.category] || CATEGORIES.sightseeing;
  const v = getWeatherVerdict(activity, WEATHER[dayId]);
  const hasBad = v && (v.severity === 'bad' || v.severity === 'warning');

  const handleSwap = async () => {
    setSwapping(true);
    setSwapResult(null);
    const weather = WEATHER[dayId];
    const dayLabel = DAYS[dayId]?.title || '';
    const suggestion = await getSwapSuggestion(activity, weather, dayLabel, settings);
    if (suggestion) {
      setSwapResult(suggestion);
    }
    setSwapping(false);
  };

  const acceptSwap = () => {
    if (swapResult && onSwap) {
      onSwap(activity.id, {
        ...activity,
        name: swapResult.name,
        category: swapResult.category || activity.category,
        time: swapResult.time || activity.time,
        duration: swapResult.duration || activity.duration,
        price: swapResult.price || activity.price,
        description: swapResult.description || '',
        address: swapResult.address || '',
        notes: swapResult.notes || '',
        status: 'upcoming',
      });
      setSwapResult(null);
      setExpanded(false);
    }
  };

  const toggleStar = () => {
    if (onFieldUpdate) {
      onFieldUpdate(activity.id, 'starred', !isStarred);
    }
  };

  const saveComment = () => {
    if (onFieldUpdate) {
      onFieldUpdate(activity.id, 'comment', commentDraft.trim());
    }
    setEditingComment(false);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => setExpanded(!expanded)}
      style={[
        styles.card,
        { borderLeftColor: isDone ? GREEN : isSkipped ? GRAY : cat.color },
        isStarred && styles.cardStarred,
        isSkipped && { opacity: 0.55 },
      ]}
    >
      <View style={styles.row}>
        <Text style={styles.emoji}>{cat.emoji}</Text>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            {isStarred && <Text style={{ fontSize: 14, marginRight: 4 }}>⭐</Text>}
            <Text style={[styles.name, isSkipped && styles.strikethrough]}>{activity.name}</Text>
            {isDone && <Text style={{ fontSize: 16 }}>✅</Text>}
            {isSkipped && <Text style={{ fontSize: 14, opacity: 0.5 }}>⏭️</Text>}
          </View>
          <View style={styles.badges}>
            <CatBadge cat={activity.category} />
            <PriceBadge price={activity.price} />
            <Text style={styles.duration}>⏱ {activity.duration}</Text>
            {activity.bookingUrl ? (
              <View style={styles.bookingBadge}>
                <Text style={styles.bookingBadgeText}>🎟 Bookable</Text>
              </View>
            ) : null}
            {hasBad && !expanded && (
              <View style={[styles.weatherRisk, { backgroundColor: v.bg }]}>
                <Text style={[styles.weatherRiskText, { color: v.color }]}>{v.icon} Weather risk</Text>
              </View>
            )}
          </View>
          {/* Show comment preview when collapsed */}
          {!expanded && activity.comment ? (
            <Text style={styles.commentPreview} numberOfLines={1}>💬 {activity.comment}</Text>
          ) : null}
        </View>
        <View style={styles.timeWrap}>
          <Text style={styles.time}>{activity.time}</Text>
        </View>
      </View>

      {expanded && (
        <View style={styles.expandedSection}>
          <Text style={styles.description}>{activity.description}</Text>
          <WeatherAdvice activity={activity} dayId={dayId} />

          {/* AI Swap button — shows when weather is bad */}
          {hasBad && !isDone && !isSkipped && (
            <TouchableOpacity
              style={styles.swapBtn}
              onPress={handleSwap}
              disabled={swapping}
            >
              {swapping ? (
                <View style={styles.swapLoading}>
                  <ActivityIndicator size="small" color={WHITE} />
                  <Text style={styles.swapBtnText}>  Finding alternative...</Text>
                </View>
              ) : (
                <Text style={styles.swapBtnText}>🔄 AI Swap — Find better activity</Text>
              )}
            </TouchableOpacity>
          )}

          {/* Swap result */}
          {swapResult && (
            <View style={styles.swapResult}>
              <Text style={styles.swapResultTitle}>🤖 AI Suggestion</Text>
              <Text style={styles.swapResultName}>{swapResult.name}</Text>
              <Text style={styles.swapResultDesc}>{swapResult.description}</Text>
              {swapResult.reason && (
                <Text style={styles.swapResultReason}>💡 {swapResult.reason}</Text>
              )}
              <View style={styles.swapResultMeta}>
                {swapResult.price && <PriceBadge price={swapResult.price} />}
                {swapResult.duration && <Text style={styles.duration}>⏱ {swapResult.duration}</Text>}
              </View>
              <View style={styles.swapActions}>
                <TouchableOpacity style={styles.swapAccept} onPress={acceptSwap}>
                  <Text style={styles.swapAcceptText}>✓ Swap it in</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.swapDismiss} onPress={() => setSwapResult(null)}>
                  <Text style={styles.swapDismissText}>Keep original</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Booking link */}
          {activity.bookingUrl ? (
            <TouchableOpacity
              style={styles.bookingBtn}
              onPress={() => Linking.openURL(activity.bookingUrl)}
            >
              <Text style={styles.bookingBtnText}>🎟 Book / Reserve</Text>
            </TouchableOpacity>
          ) : null}

          {activity.address && (
            <TouchableOpacity
              onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(activity.address)}`)}
            >
              <Text style={styles.address}>📍 {activity.address}</Text>
            </TouchableOpacity>
          )}
          {activity.notes && (
            <View style={styles.notesBox}>
              <Text style={styles.notesText}>💡 {activity.notes}</Text>
            </View>
          )}

          {/* Comment section */}
          <View style={styles.commentSection}>
            <Text style={styles.commentLabel}>💬 Your Notes</Text>
            {editingComment ? (
              <View>
                <TextInput
                  style={styles.commentInput}
                  value={commentDraft}
                  onChangeText={setCommentDraft}
                  placeholder="e.g. Booked for 21:00, confirmation #1234"
                  placeholderTextColor={GRAY}
                  multiline
                  autoFocus
                />
                <View style={styles.commentBtns}>
                  <TouchableOpacity style={styles.commentSave} onPress={saveComment}>
                    <Text style={styles.commentSaveText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.commentCancel} onPress={() => { setEditingComment(false); setCommentDraft(activity.comment || ''); }}>
                    <Text style={styles.commentCancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setEditingComment(true)} style={styles.commentDisplay}>
                <Text style={activity.comment ? styles.commentText : styles.commentPlaceholder}>
                  {activity.comment || 'Tap to add a note (booked, need to book, tips...)'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.starBtn} onPress={toggleStar}>
              <Text style={styles.starBtnText}>{isStarred ? '⭐ Starred' : '☆ Star'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: isDone ? '#DCFCE7' : GREEN }]}
              onPress={() => onUpdate(activity.id, isDone ? 'upcoming' : 'done')}
            >
              <Text style={[styles.btnText, { color: isDone ? GREEN : WHITE }]}>
                {isDone ? '↩ Undo' : '✓ Done'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: '#F3F4F6' }]}
              onPress={() => onUpdate(activity.id, isSkipped ? 'upcoming' : 'skipped')}
            >
              <Text style={[styles.btnText, { color: '#6B7280' }]}>
                {isSkipped ? '↩ Undo' : '⏭ Skip'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: WHITE,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  cardStarred: {
    backgroundColor: '#FFFBEB',
    borderLeftWidth: 4,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  emoji: { fontSize: 24, marginRight: 10 },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  name: { fontWeight: '700', fontSize: 15, color: DARK, marginRight: 6 },
  strikethrough: { textDecorationLine: 'line-through' },
  badges: { flexDirection: 'row', alignItems: 'center', marginTop: 4, flexWrap: 'wrap' },
  duration: { fontSize: 12, color: '#6B7280', marginLeft: 6 },
  bookingBadge: { marginLeft: 6, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8, backgroundColor: '#DBEAFE' },
  bookingBadgeText: { fontSize: 10, fontWeight: '600', color: '#1D4ED8' },
  weatherRisk: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8, marginLeft: 6 },
  weatherRiskText: { fontSize: 11, fontWeight: '600' },
  commentPreview: { fontSize: 11, color: '#6B7280', marginTop: 3, fontStyle: 'italic' },
  timeWrap: { alignItems: 'flex-end' },
  time: { fontSize: 14, fontWeight: '700', color: ACCENT },
  expandedSection: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  description: { fontSize: 14, color: '#374151', lineHeight: 21 },
  address: { marginTop: 8, fontSize: 13, color: '#3B82F6' },
  notesBox: { marginTop: 8, padding: 8, backgroundColor: ACCENT_LIGHT, borderRadius: 8 },
  notesText: { fontSize: 13, color: '#92400E' },

  bookingBtn: { marginTop: 10, backgroundColor: '#1D4ED8', borderRadius: 10, padding: 12, alignItems: 'center' },
  bookingBtnText: { color: WHITE, fontWeight: '700', fontSize: 13 },

  commentSection: { marginTop: 10, backgroundColor: '#F9FAFB', borderRadius: 10, padding: 10 },
  commentLabel: { fontSize: 12, fontWeight: '700', color: DARK, marginBottom: 6 },
  commentDisplay: { paddingVertical: 4 },
  commentText: { fontSize: 13, color: '#374151', lineHeight: 19 },
  commentPlaceholder: { fontSize: 13, color: GRAY, fontStyle: 'italic' },
  commentInput: { fontSize: 13, color: DARK, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 10, backgroundColor: WHITE, minHeight: 60, textAlignVertical: 'top' },
  commentBtns: { flexDirection: 'row', marginTop: 8, gap: 8 },
  commentSave: { backgroundColor: ACCENT, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  commentSaveText: { color: WHITE, fontWeight: '700', fontSize: 12 },
  commentCancel: { backgroundColor: '#E5E7EB', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  commentCancelText: { color: DARK, fontWeight: '600', fontSize: 12 },

  buttons: { flexDirection: 'row', marginTop: 12 },
  starBtn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#FEF3C7', alignItems: 'center', marginRight: 4 },
  starBtnText: { fontWeight: '600', fontSize: 12, color: '#92400E' },
  btn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', marginHorizontal: 4 },
  btnText: { fontWeight: '600', fontSize: 13 },

  swapBtn: { marginTop: 10, backgroundColor: '#7C3AED', borderRadius: 10, padding: 12, alignItems: 'center' },
  swapLoading: { flexDirection: 'row', alignItems: 'center' },
  swapBtnText: { color: WHITE, fontWeight: '700', fontSize: 13 },

  swapResult: { marginTop: 10, backgroundColor: '#F5F3FF', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#DDD6FE' },
  swapResultTitle: { fontSize: 12, fontWeight: '700', color: '#7C3AED', marginBottom: 4 },
  swapResultName: { fontSize: 15, fontWeight: '800', color: DARK, marginBottom: 4 },
  swapResultDesc: { fontSize: 13, color: '#374151', lineHeight: 19, marginBottom: 4 },
  swapResultReason: { fontSize: 12, color: '#7C3AED', marginBottom: 8, fontStyle: 'italic' },
  swapResultMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  swapActions: { flexDirection: 'row' },
  swapAccept: { flex: 1, backgroundColor: '#7C3AED', borderRadius: 8, padding: 10, alignItems: 'center', marginRight: 6 },
  swapAcceptText: { color: WHITE, fontWeight: '700', fontSize: 13 },
  swapDismiss: { flex: 1, backgroundColor: '#E5E7EB', borderRadius: 8, padding: 10, alignItems: 'center', marginLeft: 6 },
  swapDismissText: { color: DARK, fontWeight: '600', fontSize: 13 },
});
