import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function BalanceCard() {
  const [showBalance, setShowBalance] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.userInfoRow}>

        {/* ── Avatar + badges ── */}
        <View style={styles.avatarWrapper}>
          {/* Main circle */}
          <LinearGradient
            colors={['#1e40af', '#1e3a8a', '#0f2460']}
            style={styles.avatarCircle}
          >
            <Ionicons name="person" size={36} color="#93c5fd" />
          </LinearGradient>

          {/* Shield badge – center-top, dots layered inside */}
          <View style={styles.shieldBadge}>
            <MaterialCommunityIcons name="shield" size={28} color="rgba(180,190,220,0.9)" />
            <Text style={styles.shieldDots}>...</Text>
          </View>

          {/* NÂNG HẠNG badge – bottom center */}
          <View style={styles.rankBadge}>
            <LinearGradient
              colors={['#f59e0b', '#d97706']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.rankGradient}
            >
              <MaterialCommunityIcons name="crown" size={10} color="#fff" />
              <Text style={styles.rankText}>NÂNG HẠNG</Text>
            </LinearGradient>
          </View>
        </View>

        {/* ── Balance card ── */}
        <LinearGradient
          colors={['rgba(30,58,138,0.95)', 'rgba(59,130,246,0.85)', 'rgba(30,58,138,0.95)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          {/* Header row */}
          <View style={styles.cardHeader}>
            <Text style={styles.label}>Tổng số dư VND</Text>
            <Ionicons name="chevron-forward" size={14} color="rgba(255,255,255,0.7)" />
            <View style={{ flex: 1 }} />
            <TouchableOpacity onPress={() => setShowBalance(!showBalance)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons
                name={showBalance ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="rgba(255,255,255,0.85)"
              />
            </TouchableOpacity>
          </View>

          {/* Balance */}
          <Text style={styles.balanceText}>
            {showBalance ? '1.100.000.000' : '*** *** ***'}
            <Text style={styles.currency}> VND</Text>
          </Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Profit row */}
          <TouchableOpacity style={styles.profitRow}>
            <Text style={styles.profitText}>SINH LỜI MỖI NGÀY</Text>
            <Ionicons name="chevron-forward" size={13} color="#60a5fa" />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 4,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  // ── Avatar ──────────────────────────────────────────────
  avatarWrapper: {
    width: 70,
    alignItems: 'center',
    paddingBottom: 12, // Room for badge overflow below
  },
  avatarCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(148,197,253,0.4)',
  },
  shieldBadge: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldDots: {
    position: 'absolute',
    color: '#334155',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: -1,
    top: 7, // vertically center inside the shield shape
  },
  rankBadge: {
    position: 'absolute',
    bottom: 0,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#92400e',
  },
  rankGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 3,
  },
  rankText: {
    color: '#fff',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.3,
  },

  // ── Balance card ─────────────────────────────────────────
  balanceCard: {
    flex: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(148,197,253,0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 6,
  },
  label: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '500',
  },
  balanceText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  currency: {
    fontSize: 13,
    fontWeight: '400',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginBottom: 8,
  },
  profitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  profitText: {
    color: '#60a5fa',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
