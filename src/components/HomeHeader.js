import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useBackground } from '../context/BackgroundContext';
import MBLogo from './MBLogo';
import { Colors } from '../constants/colors';

export default function HomeHeader() {
  const navigation = useNavigation();
  const { clearBgImage } = useBackground();

  const handleMenuPress = () => {
    Alert.alert(
      'Tuỳ chỉnh',
      'Chọn thao tác',
      [
        {
          text: '🖼 Thay ảnh nền',
          onPress: pickImage,
        },
        {
          text: '🗑 Xoá ảnh nền',
          onPress: () => clearBgImage(),
          style: 'destructive',
        },
        {
          text: '⚙️ Cài đặt ứng dụng',
          onPress: () => navigation.navigate('Settings'),
        },
        { text: 'Đóng', style: 'cancel' },
      ]
    );
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Cần quyền', 'Vui lòng cấp quyền truy cập thư viện ảnh.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: false, // We handle crop ourselves
    });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      navigation.navigate('ImageCrop', {
        imageUri: asset.uri,
        imageWidth: asset.width,
        imageHeight: asset.height,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Left: Logo + Mascot */}
      <View style={styles.leftSection}>
        <MBLogo width={100} height={35} />
        <TouchableOpacity style={styles.mascotContainer} activeOpacity={0.8}>
          <View style={styles.mascotCircle}>
            <Text style={styles.mascotEmoji}>🐝</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Right: Search, Notification, Menu */}
      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="search-outline" size={22} color={Colors.white} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="notifications-outline" size={24} color={Colors.white} />
        </TouchableOpacity>

        {/* Menu → opens background change options */}
        <TouchableOpacity style={styles.iconBtn} onPress={handleMenuPress}>
          <Ionicons name="menu-outline" size={26} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mascotContainer: { marginLeft: 4 },
  mascotCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(20, 60, 160, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: 'rgba(100, 160, 255, 0.4)',
  },
  mascotEmoji: { fontSize: 20 },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
