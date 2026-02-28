import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Linking, ActivityIndicator, StyleSheet } from 'react-native';
import { CATEGORIES } from '../data/categories';
import { WEATHER as STATIC_WEATHER, DAYS } from '../data/weather';
import { getWeatherVerdict } from '../utils/weatherVerdict';
import { getSwapSuggestion } from '../utils/api';
import { CatBadge, PriceBadge } from './Badges';
import WeatherAdvice from './WeatherAdvice';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../theme';

// --- Sub-components ---

function ActivityCardHeader({ activity, cat, isDone, isSkipped, isStarred, hasBad, v, theme }) {
  return (
    <View style={styles.row}>
      <Text style={styles.emoji} accessibilityLabel={cat.label}>{cat.emoji}</Text>
      <View style={styles.info}>
        <View style={styles.nameRow}>
          {isStarred && <Text style={{ fontSize: 14, marginRight: 4 }} accessibilityLabel="Starred">⭐</Text>}
          <Text style={[styles.name, { color: theme.text }, isSkipped && styles.strikethrough]}>{activity.name}</Text>
          {isDone && <Text style={{ fontSize: 16 }} accessibilityLabel="Completed">✅</Text>}
          {isSkipped && <Text style={{ fontSize: 14, opacity: 0.5 }} accessibilityLabel="Skipped">⏭️</Text>}
        </View>
        <View style={styles.badges}>
          <CatBadge cat={activity.category} />
          <PriceBadge price={activity.price} />
          <Text style={[styles.duration, { color: theme.textTertiary }]}>⏱ {activity.duration}</Text>
          {activity.bookingUrl ? (
            <View style={styles.bookingBadge}>
              <Text style={styles.bookingBadgeText}>🎟 Bookable</Text>
            </View>
          ) : null}
          {hasBad && (
            <View style={[styles.weatherRisk, { backgroundColor: v.bg }]}>
              <Text style={[styles.weatherRiskText, { color: v.color }]}>{v.icon} Weather risk</Text>
            </View>
          )}
        </View>
        {activity.comment ? (
          <Text style={[styles.commentPreview, { color: theme.textTertiary }]} numberOfLines={1}>💬 {activity.comment}</Text>
        ) : null}
      </View>
      <View style={styles.timeWrap}>
        <Text style={[styles.time, { color: theme.accent }]}>{activity.time}</Text>
      </View>
    </View>
  );
}

function SwapSection({ activity, dayId, swapping, swapResult, onSwap, onAcceptSwap, onDismissSwap, theme }) {
  return (
    <>
      <TouchableOpacity
        style={styles.swapBtn}
        onPress={onSwap}
        disabled={swapping}
        accessibilityRole="button"
        accessibilityLabel="AI Swap: Find a better activity based on weather"
        accessibilityHint="Uses AI to suggest a weather-appropriate replacement"
      >
        {swapping ? (
          <View style={styles.swapLoading}>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.swapBtnText}>  Finding alternative...</Text>
          </View>
        ) : (
          <Text style={styles.swapBtnText}>🔄 AI Swap — Find better activity</Text>
        )}
      </TouchableOpacity>

      {swapResult && (
        <View style={styles.swapResult}>
          <Text style={styles.swapResultTitle}>🤖 AI Suggestion</Text>
          <Text style={[styles.swapResultName, { color: theme.text }]}>{swapResult.name}</Text>
          <Text style={[styles.swapResultDesc, { color: theme.textTertiary }]}>{swapResult.description}</Text>
          {swapResult.reason && (
            <Text style={styles.swapResultReason}>💡 {swapResult.reason}</Text>
          )}
          <View style={styles.swapResultMeta}>
            {swapResult.price && <PriceBadge price={swapResult.price} />}
            {swapResult.duration && <Text style={[styles.duration, { color: theme.textTertiary }]}>⏱ {swapResult.duration}</Text>}
          </View>
          <View style={styles.swapActions}>
            <TouchableOpacity
              style={styles.swapAccept}
              onPress={onAcceptSwap}
              accessibilityRole="button"
              accessibilityLabel="Accept swap suggestion"
            >
              <Text style={styles.swapAcceptText}>✓ Swap it in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.swapDismiss, { backgroundColor: theme.border }]}
              onPress={onDismissSwap}
              accessibilityRole="button"
              accessibilityLabel="Keep original activity"
            >
              <Text style={[styles.swapDismissText, { color: theme.text }]}>Keep original</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}

function CommentSection({ activity, commentDraft, setCommentDraft, editingComment, setEditingComment, onSave, theme }) {
  return (
    <View style={[styles.commentSection, { backgroundColor: theme.sectionBg }]}>
      <Text style={[styles.commentLabel, { color: theme.text }]}>💬 Your Notes</Text>
      {editingComment ? (
        <View>
          <TextInput
            style={[styles.commentInput, { color: theme.text, borderColor: theme.inputBorder, backgroundColor: theme.inputBg }]}
            value={commentDraft}
            onChangeText={setCommentDraft}
            placeholder="e.g. Booked for 21:00, confirmation #1234"
            placeholderTextColor={theme.textSecondary}
            multiline
            autoFocus
            accessibilityLabel="Activity note"
          />
          <View style={styles.commentBtns}>
            <TouchableOpacity
              style={[styles.commentSave, { backgroundColor: theme.accent }]}
              onPress={onSave}
              accessibilityRole="button"
              accessibilityLabel="Save note"
            >
              <Text style={styles.commentSaveText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.commentCancel, { backgroundColor: theme.border }]}
              onPress={() => { setEditingComment(false); setCommentDraft(activity.comment || ''); }}
              accessibilityRole="button"
              accessibilityLabel="Cancel editing note"
            >
              <Text style={[styles.commentCancelText, { color: theme.text }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => setEditingComment(true)}
          style={styles.commentDisplay}
          accessibilityRole="button"
          accessibilityLabel={activity.comment ? `Note: ${activity.comment}. Tap to edit` : 'Tap to add a note'}
        >
          <Text style={activity.comment ? [styles.commentText, { color: theme.textTertiary }] : [styles.commentPlaceholder, { color: theme.textSecondary }]}>
            {activity.comment || 'Tap to add a note (booked, need to book, tips...)'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function ActivityCardActions({ activity, isDone, isSkipped, isStarred, onUpdate, onToggleStar, theme }) {
  return (
    <View style={styles.buttons}>
      <TouchableOpacity
        style={[styles.starBtn, { backgroundColor: theme.isDark ? '#78350F' : '#FEF3C7' }]}
        onPress={onToggleStar}
        accessibilityRole="button"
        accessibilityLabel={isStarred ? 'Remove star from activity' : 'Star this activity'}
      >
        <Text style={[styles.starBtnText, { color: theme.isDark ? '#FCD34D' : '#92400E' }]}>{isStarred ? '⭐ Starred' : '☆ Star'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: isDone ? '#DCFCE7' : '#22C55E' }]}
        onPress={() => onUpdate(activity.id, isDone ? 'upcoming' : 'done')}
        accessibilityRole="button"
        accessibilityLabel={isDone ? 'Mark as not done' : 'Mark as done'}
      >
        <Text style={[styles.btnText, { color: isDone ? '#22C55E' : '#FFFFFF' }]}>
          {isDone ? '↩ Undo' : '✓ Done'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: theme.sectionBg }]}
        onPress={() => onUpdate(activity.id, isSkipped ? 'upcoming' : 'skipped')}
        accessibilityRole="button"
        accessibilityLabel={isSkipped ? 'Unskip activity' : 'Skip this activity'}
      >
        <Text style={[styles.btnText, { color: theme.textTertiary }]}>
          {isSkipped ? '↩ Undo' : '⏭ Skip'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// --- Main Component ---

export default function ActivityCard({ activity, onUpdate, onSwap, onFieldUpdate, dayId }) {
  const { state } = useAppContext();
  const theme = useTheme();
  const weather = state.weather || STATIC_WEATHER;

  const [expanded, setExpanded] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [swapResult, setSwapResult] = useState(null);
  const [commentDraft, setCommentDraft] = useState(activity.comment || '');
  const [editingComment, setEditingComment] = useState(false);
  const isDone = activity.status === 'done';
  const isSkipped = activity.status === 'skipped';
  const isStarred = activity.starred;
  const cat = CATEGORIES[activity.category] || CATEGORIES.sightseeing;
  const v = getWeatherVerdict(activity, weather[dayId]);
  const hasBad = v && (v.severity === 'bad' || v.severity === 'warning');

  const handleSwap = async () => {
    setSwapping(true);
    setSwapResult(null);
    const w = weather[dayId];
    const dayLabel = DAYS[dayId]?.title || '';
    const suggestion = await getSwapSuggestion(activity, w, dayLabel, state.settings);
    if (suggestion) setSwapResult(suggestion);
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
    if (onFieldUpdate) onFieldUpdate(activity.id, 'starred', !isStarred);
  };

  const saveComment = () => {
    if (onFieldUpdate) onFieldUpdate(activity.id, 'comment', commentDraft.trim());
    setEditingComment(false);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => setExpanded(!expanded)}
      style={[
        styles.card,
        { backgroundColor: theme.cardBg, borderLeftColor: isDone ? '#22C55E' : isSkipped ? theme.textSecondary : cat.color },
        isStarred && { backgroundColor: theme.isDark ? '#78350F' : '#FFFBEB' },
        isSkipped && { opacity: 0.55 },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${activity.name}, ${cat.label}, ${activity.time}, ${isDone ? 'completed' : isSkipped ? 'skipped' : 'upcoming'}`}
      accessibilityHint={expanded ? 'Tap to collapse' : 'Tap to expand details'}
    >
      {expanded ? (
        <>
          <ActivityCardHeader activity={activity} cat={cat} isDone={isDone} isSkipped={isSkipped} isStarred={isStarred} hasBad={false} v={v} theme={theme} />
          <View style={[styles.expandedSection, { borderTopColor: theme.border }]}>
            <Text style={[styles.description, { color: theme.textTertiary }]}>{activity.description}</Text>
            <WeatherAdvice activity={activity} dayId={dayId} />

            {hasBad && !isDone && !isSkipped && (
              <SwapSection
                activity={activity}
                dayId={dayId}
                swapping={swapping}
                swapResult={swapResult}
                onSwap={handleSwap}
                onAcceptSwap={acceptSwap}
                onDismissSwap={() => setSwapResult(null)}
                theme={theme}
              />
            )}

            {activity.bookingUrl ? (
              <TouchableOpacity
                style={styles.bookingBtn}
                onPress={() => Linking.openURL(activity.bookingUrl)}
                accessibilityRole="link"
                accessibilityLabel="Book or reserve this activity"
              >
                <Text style={styles.bookingBtnText}>🎟 Book / Reserve</Text>
              </TouchableOpacity>
            ) : null}

            {activity.address && (
              <TouchableOpacity
                onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(activity.address)}`)}
                accessibilityRole="link"
                accessibilityLabel={`Open ${activity.address} in maps`}
              >
                <Text style={styles.address}>📍 {activity.address}</Text>
              </TouchableOpacity>
            )}
            {activity.notes && (
              <View style={[styles.notesBox, { backgroundColor: theme.isDark ? '#78350F' : '#FEF3C7' }]}>
                <Text style={[styles.notesText, { color: theme.isDark ? '#FCD34D' : '#92400E' }]}>💡 {activity.notes}</Text>
              </View>
            )}

            <CommentSection
              activity={activity}
              commentDraft={commentDraft}
              setCommentDraft={setCommentDraft}
              editingComment={editingComment}
              setEditingComment={setEditingComment}
              onSave={saveComment}
              theme={theme}
            />

            <ActivityCardActions
              activity={activity}
              isDone={isDone}
              isSkipped={isSkipped}
              isStarred={isStarred}
              onUpdate={onUpdate}
              onToggleStar={toggleStar}
              theme={theme}
            />
          </View>
        </>
      ) : (
        <ActivityCardHeader activity={activity} cat={cat} isDone={isDone} isSkipped={isSkipped} isStarred={isStarred} hasBad={hasBad} v={v} theme={theme} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
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
  row: { flexDirection: 'row', alignItems: 'center' },
  emoji: { fontSize: 24, marginRight: 10 },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  name: { fontWeight: '700', fontSize: 15, marginRight: 6 },
  strikethrough: { textDecorationLine: 'line-through' },
  badges: { flexDirection: 'row', alignItems: 'center', marginTop: 4, flexWrap: 'wrap' },
  duration: { fontSize: 12, marginLeft: 6 },
  bookingBadge: { marginLeft: 6, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8, backgroundColor: '#DBEAFE' },
  bookingBadgeText: { fontSize: 10, fontWeight: '600', color: '#1D4ED8' },
  weatherRisk: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8, marginLeft: 6 },
  weatherRiskText: { fontSize: 11, fontWeight: '600' },
  commentPreview: { fontSize: 11, marginTop: 3, fontStyle: 'italic' },
  timeWrap: { alignItems: 'flex-end' },
  time: { fontSize: 14, fontWeight: '700' },
  expandedSection: { marginTop: 12, paddingTop: 12, borderTopWidth: 1 },
  description: { fontSize: 14, lineHeight: 21 },
  address: { marginTop: 8, fontSize: 13, color: '#3B82F6' },
  notesBox: { marginTop: 8, padding: 8, borderRadius: 8 },
  notesText: { fontSize: 13 },
  bookingBtn: { marginTop: 10, backgroundColor: '#1D4ED8', borderRadius: 10, padding: 12, alignItems: 'center' },
  bookingBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  commentSection: { marginTop: 10, borderRadius: 10, padding: 10 },
  commentLabel: { fontSize: 12, fontWeight: '700', marginBottom: 6 },
  commentDisplay: { paddingVertical: 4 },
  commentText: { fontSize: 13, lineHeight: 19 },
  commentPlaceholder: { fontSize: 13, fontStyle: 'italic' },
  commentInput: { fontSize: 13, borderWidth: 1, borderRadius: 8, padding: 10, minHeight: 60, textAlignVertical: 'top' },
  commentBtns: { flexDirection: 'row', marginTop: 8, gap: 8 },
  commentSave: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  commentSaveText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
  commentCancel: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  commentCancelText: { fontWeight: '600', fontSize: 12 },
  buttons: { flexDirection: 'row', marginTop: 12 },
  starBtn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, alignItems: 'center', marginRight: 4 },
  starBtnText: { fontWeight: '600', fontSize: 12 },
  btn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', marginHorizontal: 4 },
  btnText: { fontWeight: '600', fontSize: 13 },
  swapBtn: { marginTop: 10, backgroundColor: '#7C3AED', borderRadius: 10, padding: 12, alignItems: 'center' },
  swapLoading: { flexDirection: 'row', alignItems: 'center' },
  swapBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  swapResult: { marginTop: 10, backgroundColor: '#F5F3FF', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#DDD6FE' },
  swapResultTitle: { fontSize: 12, fontWeight: '700', color: '#7C3AED', marginBottom: 4 },
  swapResultName: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
  swapResultDesc: { fontSize: 13, lineHeight: 19, marginBottom: 4 },
  swapResultReason: { fontSize: 12, color: '#7C3AED', marginBottom: 8, fontStyle: 'italic' },
  swapResultMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  swapActions: { flexDirection: 'row' },
  swapAccept: { flex: 1, backgroundColor: '#7C3AED', borderRadius: 8, padding: 10, alignItems: 'center', marginRight: 6 },
  swapAcceptText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  swapDismiss: { flex: 1, borderRadius: 8, padding: 10, alignItems: 'center', marginLeft: 6 },
  swapDismissText: { fontWeight: '600', fontSize: 13 },
});
