import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Linking, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
          {isStarred && <Ionicons name="star" size={13} color={theme.accentWarm} style={{ marginRight: 4 }} />}
          <Text style={[styles.name, { color: theme.text }, isSkipped && styles.strikethrough]}>{activity.name}</Text>
          {isDone && <Ionicons name="checkmark-circle" size={15} color={theme.green} style={{ marginLeft: 4 }} />}
        </View>
        <View style={styles.badges}>
          <CatBadge cat={activity.category} />
          <PriceBadge price={activity.price} />
          <Text style={[styles.duration, { color: theme.textSecondary }]}>{activity.duration}</Text>
          {activity.bookingUrl ? (
            <View style={[styles.bookingBadge, { backgroundColor: theme.accentLight }]}>
              <Text style={[styles.bookingBadgeText, { color: theme.accent }]}>Bookable</Text>
            </View>
          ) : null}
          {hasBad && (
            <View style={[styles.weatherRisk, { backgroundColor: v.bg }]}>
              <Text style={[styles.weatherRiskText, { color: v.color }]}>{v.icon} Weather</Text>
            </View>
          )}
        </View>
        {activity.comment ? (
          <Text style={[styles.commentPreview, { color: theme.textSecondary }]} numberOfLines={1}>{activity.comment}</Text>
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
        style={[styles.swapBtn, { backgroundColor: theme.accent }]}
        onPress={onSwap}
        disabled={swapping}
        accessibilityRole="button"
        accessibilityLabel="Swap: Find an alternative activity"
      >
        {swapping ? (
          <View style={styles.swapLoading}>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.swapBtnText}>  Finding alternative...</Text>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="swap-horizontal" size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.swapBtnText}>Swap — Find alternative</Text>
          </View>
        )}
      </TouchableOpacity>

      {swapResult && (
        <View style={[styles.swapResult, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Text style={[styles.swapResultTitle, { color: theme.accent }]}>AI Suggestion</Text>
          <Text style={[styles.swapResultName, { color: theme.text }]}>{swapResult.name}</Text>
          <Text style={[styles.swapResultDesc, { color: theme.textTertiary }]}>{swapResult.description}</Text>
          {swapResult.reason && (
            <Text style={[styles.swapResultReason, { color: theme.textSecondary }]}>{swapResult.reason}</Text>
          )}
          <View style={styles.swapResultMeta}>
            {swapResult.price && <PriceBadge price={swapResult.price} />}
            {swapResult.duration && <Text style={[styles.duration, { color: theme.textSecondary }]}>{swapResult.duration}</Text>}
          </View>
          <View style={styles.swapActions}>
            <TouchableOpacity
              style={[styles.swapAccept, { backgroundColor: theme.accent }]}
              onPress={onAcceptSwap}
              accessibilityRole="button"
              accessibilityLabel="Accept swap suggestion"
            >
              <Text style={styles.swapAcceptText}>Swap it in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.swapDismiss, { backgroundColor: theme.sectionBg }]}
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
      <Text style={[styles.commentLabel, { color: theme.textTertiary }]}>Notes</Text>
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
              style={[styles.commentCancel, { backgroundColor: theme.sectionBg, borderWidth: 1, borderColor: theme.border }]}
              onPress={() => { setEditingComment(false); setCommentDraft(activity.comment || ''); }}
              accessibilityRole="button"
              accessibilityLabel="Cancel editing note"
            >
              <Text style={[styles.commentCancelText, { color: theme.textTertiary }]}>Cancel</Text>
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
            {activity.comment || 'Tap to add a note...'}
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
        style={[styles.starBtn, { backgroundColor: isStarred ? '#FFF7ED' : theme.sectionBg }]}
        onPress={onToggleStar}
        accessibilityRole="button"
        accessibilityLabel={isStarred ? 'Remove star from activity' : 'Star this activity'}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name={isStarred ? 'star' : 'star-outline'} size={13} color={isStarred ? theme.accentWarm : theme.textSecondary} style={{ marginRight: 3 }} />
          <Text style={[styles.starBtnText, { color: isStarred ? theme.accentWarm : theme.textSecondary }]}>{isStarred ? 'Starred' : 'Star'}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: isDone ? '#F0FDF4' : theme.green }]}
        onPress={() => onUpdate(activity.id, isDone ? 'upcoming' : 'done')}
        accessibilityRole="button"
        accessibilityLabel={isDone ? 'Mark as not done' : 'Mark as done'}
      >
        <Text style={[styles.btnText, { color: isDone ? theme.green : '#FFFFFF' }]}>
          {isDone ? 'Undo' : 'Done'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: theme.sectionBg }]}
        onPress={() => onUpdate(activity.id, isSkipped ? 'upcoming' : 'skipped')}
        accessibilityRole="button"
        accessibilityLabel={isSkipped ? 'Unskip activity' : 'Skip this activity'}
      >
        <Text style={[styles.btnText, { color: theme.textSecondary }]}>
          {isSkipped ? 'Undo' : 'Skip'}
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
        {
          backgroundColor: theme.cardBg,
          borderLeftColor: isDone ? theme.green : isSkipped ? theme.textSecondary : (isStarred ? theme.accentWarm : cat.color),
        },
        isStarred && !isDone && !isSkipped && { backgroundColor: '#FFFBF5' },
        isSkipped && { opacity: 0.5 },
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

            {!isDone && !isSkipped && (
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
                style={[styles.bookingBtn, { backgroundColor: theme.accent }]}
                onPress={() => Linking.openURL(activity.bookingUrl)}
                accessibilityRole="link"
                accessibilityLabel="Book or reserve this activity"
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="open-outline" size={13} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.bookingBtnText}>Book / Reserve</Text>
                </View>
              </TouchableOpacity>
            ) : null}

            {activity.address && (
              <TouchableOpacity
                onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(activity.address)}`)}
                accessibilityRole="link"
                accessibilityLabel={`Open ${activity.address} in maps`}
              >
                <Text style={[styles.address, { color: theme.accent }]}>{activity.address}</Text>
              </TouchableOpacity>
            )}
            {activity.notes && (
              <View style={[styles.notesBox, { backgroundColor: theme.accentLight }]}>
                <Text style={[styles.notesText, { color: theme.accent }]}>{activity.notes}</Text>
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
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderLeftWidth: 3,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  emoji: { fontSize: 22, marginRight: 10 },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  name: { fontWeight: '600', fontSize: 14 },
  strikethrough: { textDecorationLine: 'line-through' },
  badges: { flexDirection: 'row', alignItems: 'center', marginTop: 4, flexWrap: 'wrap', gap: 4 },
  duration: { fontSize: 11, marginLeft: 2 },
  bookingBadge: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  bookingBadgeText: { fontSize: 10, fontWeight: '600' },
  weatherRisk: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  weatherRiskText: { fontSize: 10, fontWeight: '600' },
  commentPreview: { fontSize: 11, marginTop: 3, fontStyle: 'italic' },
  timeWrap: { alignItems: 'flex-end' },
  time: { fontSize: 13, fontWeight: '700' },
  expandedSection: { marginTop: 12, paddingTop: 12, borderTopWidth: 1 },
  description: { fontSize: 13, lineHeight: 20 },
  address: { marginTop: 8, fontSize: 12 },
  notesBox: { marginTop: 8, padding: 8, borderRadius: 8 },
  notesText: { fontSize: 12 },
  bookingBtn: { marginTop: 10, borderRadius: 8, padding: 10, alignItems: 'center' },
  bookingBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },
  commentSection: { marginTop: 10, borderRadius: 8, padding: 10 },
  commentLabel: { fontSize: 11, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  commentDisplay: { paddingVertical: 4 },
  commentText: { fontSize: 13, lineHeight: 19 },
  commentPlaceholder: { fontSize: 13, fontStyle: 'italic' },
  commentInput: { fontSize: 13, borderWidth: 1, borderRadius: 8, padding: 10, minHeight: 60, textAlignVertical: 'top' },
  commentBtns: { flexDirection: 'row', marginTop: 8, gap: 8 },
  commentSave: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  commentSaveText: { color: '#FFFFFF', fontWeight: '600', fontSize: 12 },
  commentCancel: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  commentCancelText: { fontWeight: '500', fontSize: 12 },
  buttons: { flexDirection: 'row', marginTop: 12, gap: 6 },
  starBtn: { paddingVertical: 9, paddingHorizontal: 12, borderRadius: 8, alignItems: 'center' },
  starBtnText: { fontWeight: '600', fontSize: 12 },
  btn: { flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  btnText: { fontWeight: '600', fontSize: 13 },
  swapBtn: { marginTop: 10, borderRadius: 8, padding: 10, alignItems: 'center' },
  swapLoading: { flexDirection: 'row', alignItems: 'center' },
  swapBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },
  swapResult: { marginTop: 10, borderRadius: 10, padding: 12, borderWidth: 1 },
  swapResultTitle: { fontSize: 11, fontWeight: '700', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  swapResultName: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  swapResultDesc: { fontSize: 13, lineHeight: 19, marginBottom: 4 },
  swapResultReason: { fontSize: 12, marginBottom: 8, fontStyle: 'italic' },
  swapResultMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  swapActions: { flexDirection: 'row', gap: 6 },
  swapAccept: { flex: 1, borderRadius: 8, padding: 10, alignItems: 'center' },
  swapAcceptText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },
  swapDismiss: { flex: 1, borderRadius: 8, padding: 10, alignItems: 'center' },
  swapDismissText: { fontWeight: '500', fontSize: 13 },
});
