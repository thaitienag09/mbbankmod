import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import MBLogo from '../components/MBLogo';
import DecorativePills from '../components/DecorativePills';
import LoginCard from '../components/LoginCard';
import QuickActions from '../components/QuickActions';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  // Bounce animation for chevron arrows
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -6,
          duration: 600,
          easing: Easing.out(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.in(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.delay(400),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background gradient */}
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientMid, Colors.gradientEnd]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Radial-like glow overlay */}
      <LinearGradient
        colors={['rgba(30,90,220,0.6)', 'transparent']}
        start={{ x: 0.5, y: 0.2 }}
        end={{ x: 0.5, y: 0.9 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative 3D pills */}
      <DecorativePills />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* ── Top bar ── */}
        <View style={styles.topBar}>
          <View style={styles.logoWrap}>
            <MBLogo />
          </View>

          {/* Right column: Flag → Bell → Support stacked vertically */}
          <View style={styles.topRight}>
            {/* Vietnam flag circular button */}
            <TouchableOpacity style={styles.flagBtn} activeOpacity={0.8}>
              <Text style={styles.flagEmoji}>🇻🇳</Text>
            </TouchableOpacity>

            {/* Notification bell – glass circle */}
            <TouchableOpacity style={styles.bellBtn} activeOpacity={0.8}>
              <Ionicons name="notifications-outline" size={19} color={Colors.white} />
            </TouchableOpacity>

            {/* Support mascot circle */}
            <TouchableOpacity style={styles.supportBtn} activeOpacity={0.8}>
              <View style={styles.supportIconCircle}>
                <Text style={styles.supportEmoji}>🐝</Text>
              </View>
              <View style={styles.supportLabel}>
                <Text style={styles.supportText}>HỖ TRỢ</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Center scrollable content ── */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Login card centered */}
          <View style={styles.cardSection}>
            <LoginCard />
          </View>
        </ScrollView>

        {/* ── Bottom section ── */}
        <View style={styles.bottomSection}>
          <QuickActions />

          {/* Double chevron up – bouncing */}
          <Animated.View
            style={[styles.chevronWrap, { transform: [{ translateY: bounceAnim }] }]}
          >
            <Ionicons name="chevron-up" size={18} color={Colors.whiteAlpha70} />
            <Ionicons
              name="chevron-up"
              size={18}
              color={Colors.whiteAlpha30}
              style={{ marginTop: -10 }}
            />
          </Animated.View>

        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.gradientStart,
  },
  safeArea: {
    flex: 1,
  },
  logoWrap: {
    marginTop: 6,
    marginLeft: -8,
  },

  // ─── Top bar ───────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    zIndex: 10,
  },
  topRight: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  },
  flagBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  flagEmoji: {
    fontSize: 22,
  },
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  supportBtn: {
    alignItems: 'center',
    marginTop: 4,
  },
  supportIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(20, 60, 160, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(100, 160, 255, 0.4)',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  supportLabel: {
    backgroundColor: '#00d4ff',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginTop: -8, // Overlap slightly
    zIndex: 1,
  },
  supportEmoji: {
    fontSize: 24,
  },
  supportText: {
    color: '#0a1a5c',
    fontSize: 8,
    fontWeight: '800',
  },

  // ─── Scroll ────────────────────────────────────────────
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  cardSection: {
    alignItems: 'center',
  },

  // ─── Bottom ────────────────────────────────────────────
  bottomSection: {
    paddingBottom: 4,
  },
  chevronWrap: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 2,
  },

});
