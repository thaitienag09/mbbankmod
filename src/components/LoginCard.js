import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

const { width } = Dimensions.get('window');

/**
 * Glassmorphism login card - main UI element in the center of screen
 */
export default function LoginCard() {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Button press animation
  const btnScale = useRef(new Animated.Value(1)).current;
  const faceBtnScale = useRef(new Animated.Value(1)).current;

  const pressIn = (anim) =>
    Animated.spring(anim, { toValue: 0.94, useNativeDriver: true }).start();
  const pressOut = (anim) =>
    Animated.spring(anim, { toValue: 1, useNativeDriver: true }).start();

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.blurContainer}>
        <View style={styles.card}>
          {/* Security Shield Section */}
          <View style={styles.shieldRow}>
            <View style={styles.shieldIconWrap}>
              <View style={styles.shieldOuter}>
                <MaterialCommunityIcons
                  name="shield"
                  size={28}
                  color="rgba(180, 190, 210, 0.9)"
                />
                <Text style={styles.shieldDotsInside}>...</Text>
              </View>
            </View>
          </View>

          {/* Greeting & Name */}
          <Text style={styles.greeting}>Xin chào,</Text>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>Duong{'\n'}Thai Tien</Text>

            {/* Face ID button */}
            <Animated.View style={{ transform: [{ scale: faceBtnScale }] }}>
              <TouchableOpacity
                style={styles.faceIdBtn}
                onPressIn={() => pressIn(faceBtnScale)}
                onPressOut={() => pressOut(faceBtnScale)}
                activeOpacity={1}
              >
                <MaterialCommunityIcons
                  name="face-recognition"
                  size={26}
                  color={Colors.white}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mật khẩu</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
              placeholderTextColor={Colors.whiteAlpha50}
              cursorColor={Colors.cyanLight}
            />
            <View style={styles.inputUnderline} />
          </View>

          {/* Options row */}
          <View style={styles.optionsRow}>
            <TouchableOpacity>
              <Text style={styles.optionText}>Tài khoản khác</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.optionText}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>

          {/* Login button */}
          <Animated.View style={[styles.loginBtnWrap, { transform: [{ scale: btnScale }] }]}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Home')}
              onPressIn={() => pressIn(btnScale)}
              onPressOut={() => pressOut(btnScale)}
              style={styles.loginBtn}
              activeOpacity={1}
            >
              <Text style={styles.loginBtnText}>Đăng nhập</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    width: width - 32,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    // Outer shadow
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
    elevation: 20,
  },
  blurContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 22,
    paddingBottom: 18,
  },

  // Shield row
  shieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  shieldIconWrap: {
    marginBottom: 10,
  },
  shieldOuter: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  shieldDotsInside: {
    position: 'absolute',
    color: '#333',
    fontSize: 14,
    fontWeight: '900',
    top: 10, // Adjust to center vertically inside the shield shape
    letterSpacing: -1,
  },

  // Name section
  greeting: {
    fontSize: 15,
    color: Colors.whiteAlpha70,
    marginBottom: 4,
    fontWeight: '400',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 34,
    fontWeight: '700',
    color: Colors.white,
    lineHeight: 40,
    letterSpacing: 0.2,
  },

  // Face ID
  faceIdBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(40, 90, 200, 0.6)',
    borderWidth: 1.5,
    borderColor: 'rgba(100, 160, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Input
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: Colors.whiteAlpha70,
    fontSize: 13,
    marginBottom: 4,
  },
  input: {
    color: Colors.white,
    fontSize: 16,
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  inputUnderline: {
    height: 0.8,
    backgroundColor: Colors.inputBorder,
    marginTop: 2,
  },

  // Options
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    marginTop: 2,
  },
  optionText: {
    color: Colors.whiteAlpha70,
    fontSize: 13,
  },

  // Login button
  loginBtnWrap: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  loginBtn: {
    backgroundColor: Colors.cyanBtn,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  loginBtnText: {
    color: Colors.bgDeep,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
