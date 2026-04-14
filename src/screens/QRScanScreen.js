import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const FRAME_SIZE = width * 0.7;

export default function QRScanScreen() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const scanLine = useRef(new Animated.Value(0)).current;

  // Animate the scanning line
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, {
          toValue: FRAME_SIZE - 4,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLine, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const handleBarcodeScanned = ({ type, data }) => {
    if (scanned) return;
    setScanned(true);
    setScannedData(data);
  };

  if (!permission) {
    return <View style={styles.center}><Text>Đang tải...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Ionicons name="camera-off-outline" size={60} color="#94a3b8" />
        <Text style={styles.permissionText}>Cần quyền truy cập camera để quét QR</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Cấp quyền</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <CameraView
        style={StyleSheet.absoluteFill}
        barcodeScannerSettings={{ barcodeTypes: ['qr', 'pdf417'] }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />

      {/* Dark overlay */}
      <View style={styles.overlay}>
        {/* Top section */}
        <SafeAreaView style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Quét mã QR</Text>
          <TouchableOpacity style={styles.backBtn}>
            <Ionicons name="flash-off-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </SafeAreaView>

        {/* Scanning frame cutout */}
        <View style={styles.frameRow}>
          <View style={styles.sideOverlay} />
          <View style={styles.frame}>
            {/* Corner brackets */}
            {[
              { top: 0, left: 0 },
              { top: 0, right: 0 },
              { bottom: 0, left: 0 },
              { bottom: 0, right: 0 },
            ].map((pos, i) => (
              <View
                key={i}
                style={[
                  styles.corner,
                  pos,
                  pos.right !== undefined ? styles.cornerRight : null,
                  pos.bottom !== undefined ? styles.cornerBottom : null,
                ]}
              />
            ))}

            {/* Animated scan line */}
            {!scanned && (
              <Animated.View
                style={[
                  styles.scanLine,
                  { transform: [{ translateY: scanLine }] },
                ]}
              />
            )}
          </View>
          <View style={styles.sideOverlay} />
        </View>

        {/* Bottom section */}
        <View style={styles.bottomSection}>
          {scanned ? (
            <View style={styles.resultBox}>
              <Ionicons name="checkmark-circle" size={32} color="#10b981" />
              <Text style={styles.resultTitle}>Quét thành công!</Text>
              <Text style={styles.resultData} numberOfLines={3}>{scannedData}</Text>
              <TouchableOpacity
                style={styles.scanAgainBtn}
                onPress={() => { setScanned(false); setScannedData(''); }}
              >
                <Text style={styles.scanAgainText}>Quét lại</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.hint}>Đưa mã QR vào khung để quét</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    gap: 16,
    padding: 24,
  },
  permissionText: { color: '#fff', textAlign: 'center', fontSize: 16 },
  permissionBtn: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
  permissionBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  // Overlay UI
  overlay: { flex: 1, backgroundColor: 'transparent' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  topTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },

  // Frame
  frameRow: {
    flexDirection: 'row',
    height: FRAME_SIZE,
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    position: 'relative',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#3b82f6',
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRadius: 2,
  },
  cornerRight: {
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderRadius: 2,
  },
  cornerBottom: {
    borderTopWidth: 0,
    borderBottomWidth: 3,
    borderRadius: 2,
  },
  scanLine: {
    position: 'absolute',
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 5,
  },

  // Bottom
  bottomSection: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 30,
    paddingHorizontal: 24,
  },
  hint: { color: 'rgba(255,255,255,0.7)', fontSize: 14, textAlign: 'center' },
  resultBox: {
    backgroundColor: 'rgba(15,23,42,0.9)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.4)',
    width: '100%',
  },
  resultTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  resultData: { color: '#94a3b8', fontSize: 13, textAlign: 'center' },
  scanAgainBtn: {
    marginTop: 8,
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  scanAgainText: { color: '#fff', fontWeight: '700' },
});
