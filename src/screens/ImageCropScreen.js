import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  PanResponder,
  StatusBar,
  Alert,
} from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useBackground } from '../context/BackgroundContext';

const { width: SW, height: SH } = Dimensions.get('window');

export default function ImageCropScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { imageUri, imageWidth, imageHeight } = route.params;
  const { setBgImage } = useBackground();

  // Scale the image to fit the screen initially
  const scale = Math.max(SW / imageWidth, SH / imageHeight);
  const displayW = imageWidth * scale;
  const displayH = imageHeight * scale;

  const offsetX = useRef(-(displayW - SW) / 2);
  const offsetY = useRef(-(displayH - SH) / 2);
  const [pos, setPos] = useState({ x: offsetX.current, y: offsetY.current });
  const [applying, setApplying] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        const newX = Math.min(0, Math.max(offsetX.current + g.dx, SW - displayW));
        const newY = Math.min(0, Math.max(offsetY.current + g.dy, SH - displayH));
        setPos({ x: newX, y: newY });
      },
      onPanResponderRelease: (_, g) => {
        offsetX.current = Math.min(0, Math.max(offsetX.current + g.dx, SW - displayW));
        offsetY.current = Math.min(0, Math.max(offsetY.current + g.dy, SH - displayH));
      },
    })
  ).current;

  const applyCrop = async () => {
    setApplying(true);
    try {
      // Calculate crop region in original image pixels
      const cropX = Math.max(0, (-pos.x / scale));
      const cropY = Math.max(0, (-pos.y / scale));
      const cropW = Math.min(SW / scale, imageWidth - cropX);
      const cropH = Math.min(SH / scale, imageHeight - cropY);

      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            crop: {
              originX: Math.round(cropX),
              originY: Math.round(cropY),
              width: Math.round(cropW),
              height: Math.round(cropH),
            },
          },
          { resize: { width: SW, height: SH } },
        ],
        { compress: 0.88, format: ImageManipulator.SaveFormat.JPEG }
      );

      await setBgImage(result.uri);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể cắt ảnh. Vui lòng thử lại.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar hidden />

      {/* Draggable image */}
      <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers}>
        <Image
          source={{ uri: imageUri }}
          style={[styles.img, { width: displayW, height: displayH, left: pos.x, top: pos.y }]}
          resizeMode="cover"
        />
      </View>

      {/* Dimmed border to show crop area */}
      <View pointerEvents="none" style={styles.overlay}>
        <View style={styles.cornerTL} />
        <View style={styles.cornerTR} />
        <View style={styles.cornerBL} />
        <View style={styles.cornerBR} />
        {/* Grid lines */}
        <View style={styles.gridH1} />
        <View style={styles.gridH2} />
        <View style={styles.gridV1} />
        <View style={styles.gridV2} />
      </View>

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="close" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Kéo để căn chỉnh</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Bottom buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>Huỷ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.applyBtn, applying && { opacity: 0.6 }]}
          onPress={applyCrop}
          disabled={applying}
        >
          <Ionicons name="checkmark" size={20} color="#fff" />
          <Text style={styles.applyText}>{applying ? 'Đang xử lý...' : 'Áp dụng'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const CORNER = 28;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  img: { position: 'absolute' },

  overlay: { ...StyleSheet.absoluteFillObject },
  cornerTL: {
    position: 'absolute', top: 0, left: 0,
    width: CORNER, height: CORNER,
    borderTopWidth: 3, borderLeftWidth: 3, borderColor: '#fff',
  },
  cornerTR: {
    position: 'absolute', top: 0, right: 0,
    width: CORNER, height: CORNER,
    borderTopWidth: 3, borderRightWidth: 3, borderColor: '#fff',
  },
  cornerBL: {
    position: 'absolute', bottom: 80, left: 0,
    width: CORNER, height: CORNER,
    borderBottomWidth: 3, borderLeftWidth: 3, borderColor: '#fff',
  },
  cornerBR: {
    position: 'absolute', bottom: 80, right: 0,
    width: CORNER, height: CORNER,
    borderBottomWidth: 3, borderRightWidth: 3, borderColor: '#fff',
  },
  gridH1: { position: 'absolute', top: '33.3%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  gridH2: { position: 'absolute', top: '66.6%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  gridV1: { position: 'absolute', left: '33.3%', top: 0, bottom: 80, width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  gridV2: { position: 'absolute', left: '66.6%', top: 0, bottom: 80, width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },

  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 52, paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  topTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, backgroundColor: 'rgba(0,0,0,0.6)',
  },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 20 },
  cancelText: { color: '#fff', fontSize: 15, fontWeight: '600', opacity: 0.8 },
  applyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#3b82f6', paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: 14,
  },
  applyText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
