import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const tabs = [
  { id: 'home',  label: 'Trang chủ', icon: 'home-sharp' },
  { id: 'cards', label: 'Thẻ',        icon: 'card-outline' },
  { id: 'qr',    label: '',           icon: null },      // Placeholder – real QR button is elevated
  { id: 'deals', label: 'Ưu đãi',    icon: 'gift-outline' },
  { id: 'more',  label: 'Thêm',       icon: 'apps-outline' },
];

export default function BottomNavBar() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const barHeight = 62 + insets.bottom;

  return (
    <View style={[styles.wrapper, { height: barHeight + 36 }]} pointerEvents="box-none">
      {/* The elevated QR button sits ABOVE the bar */}
      <View style={styles.qrFloatContainer} pointerEvents="box-none">
        <TouchableOpacity style={styles.qrOuter} activeOpacity={0.85} onPress={() => navigation.navigate('QRScan')}>
          {/* White ring */}
          <View style={styles.qrRing}>
            <LinearGradient
              colors={['#dbeafe', '#93c5fd', '#3b82f6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.qrInner}
            >
              <MaterialCommunityIcons name="qrcode-scan" size={30} color="#1e3a8a" />
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </View>

      {/* The blue navigation bar */}
      <LinearGradient
        colors={['#1e40af', '#1e3a8a']}
        style={[styles.bar, { height: barHeight, paddingBottom: insets.bottom }]}
      >
        {tabs.map((tab) => {
          // QR placeholder – empty invisible spacer
          if (tab.id === 'qr') {
            return <View key="qr-space" style={styles.qrSpacer} />;
          }

          return (
            <TouchableOpacity key={tab.id} style={styles.tabItem} activeOpacity={0.75}>
              <Ionicons name={tab.icon} size={22} color="#fff" />
              <Text style={styles.tabLabel}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width,
    // Must NOT clip the floating QR button
    overflow: 'visible',
    justifyContent: 'flex-end',
  },

  // ── QR floating button ──────────────────────────────────
  qrFloatContainer: {
    position: 'absolute',
    bottom: 48,           // sits above the bar
    alignSelf: 'center',
    zIndex: 10,
  },
  qrOuter: {
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 14,
  },
  qrRing: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#fff',
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrInner: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Nav bar ─────────────────────────────────────────────
  bar: {
    width,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    paddingTop: 10,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: 'hidden',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  tabLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  qrSpacer: {
    flex: 1,            // same weight as other tabs → keeps spacing symmetric
  },
});
