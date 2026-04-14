import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';

const { width, height } = Dimensions.get('window');

/**
 * Decorative 3D glossy pill/capsule shapes that float in the MB Bank background
 */
export default function DecorativePills() {
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createFloat = (anim, delay, duration) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          }),
        ])
      );

    createFloat(floatAnim1, 0, 3000).start();
    createFloat(floatAnim2, 500, 3600).start();
  }, []);

  const translateY1 = floatAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });
  const translateY2 = floatAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Large center pill - horizontal */}
      <Animated.View
        style={[
          styles.pillWrapLarge,
          { transform: [{ translateY: translateY1 }] },
        ]}
      >
        <LinearGradient
          colors={['#2a7aee', '#0d3bb5', '#092d99']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.pill, styles.pillLarge]}
        >
          {/* Gloss highlight */}
          <LinearGradient
            colors={['rgba(255,255,255,0.35)', 'rgba(255,255,255,0.0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.pillGloss}
          />
        </LinearGradient>
      </Animated.View>

      {/* Smaller pill - slightly angled */}
      <Animated.View
        style={[
          styles.pillWrapSmall,
          { transform: [{ translateY: translateY2 }, { rotate: '-8deg' }] },
        ]}
      >
        <LinearGradient
          colors={['#3a8af5', '#1050cc', '#0a3aaa']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.pill, styles.pillSmall]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.pillGloss}
          />
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    top: -height * 0.05,
  },
  pillWrapLarge: {
    position: 'absolute',
    top: height * 0.12,
    left: -width * 0.1,
  },
  pillWrapSmall: {
    position: 'absolute',
    top: height * 0.18,
    right: -width * 0.15,
  },
  pill: {
    borderRadius: 80,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  pillLarge: {
    width: width * 0.9,
    height: 100,
    transform: [{ rotate: '-15deg' }],
  },
  pillSmall: {
    width: width * 0.6,
    height: 70,
  },
  pillGloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
    borderRadius: 80,
  },
});
