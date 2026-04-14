import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

const actions = [
  {
    id: 'qr',
    icon: 'qr-code-outline',
    label: 'Quét QR',
    badge: null,
  },
  {
    id: 'otp',
    icon: 'lock-closed-outline',
    label: 'Xác thực D-OTP',
    badge: null,
  },
  {
    id: 'theme',
    icon: 'image-outline',
    label: 'Thay ảnh nền',
    badge: 'NEW',
  },
];

export default function QuickActions() {
  return (
    <View style={styles.container}>
      {actions.map((action, idx) => (
        <TouchableOpacity key={action.id} style={styles.actionItem} activeOpacity={0.7}>
          <View style={styles.iconWrap}>
            <Ionicons name={action.icon} size={22} color={Colors.iconBlue} />
            {action.badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{action.badge}</Text>
              </View>
            )}
          </View>
          <Text style={styles.label}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
  actionItem: {
    alignItems: 'center',
    gap: 6,
  },
  iconWrap: {
    position: 'relative',
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#e8002d',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  badgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  label: {
    color: Colors.whiteAlpha70,
    fontSize: 11,
    textAlign: 'center',
  },
});
