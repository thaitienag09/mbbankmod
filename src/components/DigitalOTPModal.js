import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function DigitalOTPModal({ visible, onClose, onVerify }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const shakeAnim = useState(new Animated.Value(0))[0];

  const handleKeyPress = (num) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      
      if (newPin.length === 6) {
        verifyPin(newPin);
      }
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      setError(false);
    }
  };

  const verifyPin = (currentPin) => {
    if (currentPin === '232003') {
      setTimeout(() => {
        onVerify();
        setPin('');
      }, 500);
    } else {
      // Shake animation for error
      setError(true);
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start(() => {
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 800);
      });
    }
  };

  const renderDots = () => {
    const dots = [];
    for (let i = 0; i < 6; i++) {
      dots.push(
        <View 
          key={i} 
          style={[
            styles.dot, 
            i < pin.length && styles.dotFilled,
            error && styles.dotError
          ]} 
        />
      );
    }
    return (
      <Animated.View style={[styles.dotsContainer, { transform: [{ translateX: shakeAnim }] }]}>
        {dots}
      </Animated.View>
    );
  };

  const KeypadButton = ({ val, icon }) => (
    <TouchableOpacity 
      style={styles.keypadBtn} 
      onPress={() => icon ? handleBackspace() : handleKeyPress(val)}
      activeOpacity={0.7}
    >
      {icon ? (
        <Ionicons name={icon} size={28} color="#fff" />
      ) : (
        <Text style={styles.keypadText}>{val}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.content}>
          <View style={styles.handle} />
          
          <Text style={styles.title}>Xác thực Digital OTP</Text>
          <Text style={styles.subtitle}>
            Vui lòng nhập mã PIN Digital OTP để nhận mã xác thực giao dịch
          </Text>

          {renderDots()}

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Đặt lại mã PIN</Text>
          </TouchableOpacity>

          {/* Custom Keypad */}
          <View style={styles.keypad}>
            <View style={styles.keypadRow}>
              <KeypadButton val="1" />
              <KeypadButton val="2" />
              <KeypadButton val="3" />
            </View>
            <View style={styles.keypadRow}>
              <KeypadButton val="4" />
              <KeypadButton val="5" />
              <KeypadButton val="6" />
            </View>
            <View style={styles.keypadRow}>
              <KeypadButton val="7" />
              <KeypadButton val="8" />
              <KeypadButton val="9" />
            </View>
            <View style={styles.keypadRow}>
              <View style={[styles.keypadBtn, { backgroundColor: 'transparent' }]} />
              <KeypadButton val="0" />
              <KeypadButton icon="backspace-outline" />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  content: {
    backgroundColor: '#f8f4ff', // Light lavender
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    alignItems: 'center',
    width: '100%',
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#cbd5e1',
    borderRadius: 2,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4732a8',
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 14,
    color: '#4a5568',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
    marginBottom: 30,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: '#4732a8',
    borderColor: '#4732a8',
  },
  dotError: {
    borderColor: '#ef4444',
  },
  forgotBtn: {
    marginBottom: 30,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4732a8',
  },
  keypad: {
    width: '100%',
    backgroundColor: '#333333', // Dark keypad background as in image
    paddingTop: 10,
    paddingBottom: 40,
    paddingHorizontal: 10,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  keypadBtn: {
    width: (width - 40) / 3,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  keypadText: {
    fontSize: 24,
    fontWeight: '400',
    color: '#fff',
  },
});
