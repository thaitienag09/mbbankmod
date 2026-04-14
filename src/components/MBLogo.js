import React from 'react';
import { Image } from 'react-native';

/**
 * MB Bank logo - dùng ảnh thật từ assets (bao gồm cả icon + chữ MB)
 */
export default function MBLogo({ width = 150, height = 55 }) {
  return (
    <Image
      source={require('../../assets/logosanh.png')}
      style={{ width, height }}
      resizeMode="contain"
    />
  );
}
