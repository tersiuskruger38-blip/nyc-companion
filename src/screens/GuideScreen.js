import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DARK, GRAY, LIGHT_BG } from '../theme';

export default function GuideScreen() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 48, marginBottom: 12 }}>🗽</Text>
      <Text style={styles.title}>NYC Survival Guide</Text>
      <Text style={styles.sub}>Coming soon — 25+ tips</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LIGHT_BG, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: '800', color: DARK },
  sub: { fontSize: 14, color: GRAY, marginTop: 4 },
});
