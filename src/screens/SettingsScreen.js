import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { usePreferences } from '../context/AppPreferencesContext';

const { width } = Dimensions.get('window');

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { 
    senderName, 
    senderAccountNumber, 
    defaultRecipientName, 
    updatePreferences, 
    resetPreferences 
  } = usePreferences();

  const [name, setName] = useState(senderName);
  const [acc, setAcc] = useState(senderAccountNumber);
  const [recipient, setRecipient] = useState(defaultRecipientName);

  const handleSave = () => {
    updatePreferences({
      senderName: name,
      senderAccountNumber: acc,
      defaultRecipientName: recipient
    });
    Alert.alert('Thành công', 'Đã lưu cài đặt của bạn.');
  };

  const handleReset = () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có muốn đặt lại cài đặt mặc định?',
      [
        { text: 'Huỷ', style: 'cancel' },
        { 
          text: 'Đặt lại', 
          style: 'destructive',
          onPress: async () => {
            await resetPreferences();
            setName('DUONG THAI TIEN');
            setAcc('0913263053');
            setRecipient('');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
            <Ionicons name="chevron-back" size={26} color="#1a3182" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cài đặt ứng dụng</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chủ sở hữu (Người chuyển)</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tên tài khoản</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="VD: DUONG THAI TIEN"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Số tài khoản</Text>
              <TextInput
                style={styles.input}
                value={acc}
                onChangeText={setAcc}
                keyboardType="numeric"
                placeholder="VD: 0913263053"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mặc định (Người nhận)</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tên người nhận mặc định</Text>
              <TextInput
                style={styles.input}
                value={recipient}
                onChangeText={setRecipient}
                placeholder="VD: NGUYEN VAN A"
              />
              <Text style={styles.helperText}>Để trống nếu muốn tự nhập trong quá trình chuyển tiền.</Text>
            </View>
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Lưu cài đặt</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Text style={styles.resetBtnText}>Đặt lại mặc định</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f8f4ff',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a3182',
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#1a3182',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#5e43aa',
    textTransform: 'uppercase',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#718096',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#eee8f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1a202c',
    backgroundColor: '#fdfbff',
  },
  helperText: {
    fontSize: 11,
    color: '#a0aec0',
    marginTop: 6,
    fontStyle: 'italic',
  },
  buttonGroup: {
    marginTop: 10,
    gap: 12,
  },
  saveBtn: {
    backgroundColor: '#1a3182',
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1a3182',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  resetBtn: {
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  resetBtnText: {
    color: '#718096',
    fontSize: 15,
    fontWeight: '600',
  },
});
