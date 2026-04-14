import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import DigitalOTPModal from '../components/DigitalOTPModal';

const { width } = Dimensions.get('window');

// --- Helper: Convert Number to Vietnamese Words ---
const numberToWords = (numStr) => {
  const num = parseInt(numStr.replace(/\D/g, ''), 10);
  if (isNaN(num)) return '';
  if (num === 0) return 'Không đồng';

  const units = ['', ' nghìn', ' triệu', ' tỷ', ' nghìn tỷ', ' triệu tỷ'];
  const digits = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

  const readGroup = (group) => {
    let s = '';
    const h = Math.floor(group / 100);
    const t = Math.floor((group % 100) / 10);
    const u = group % 10;

    if (h > 0) {
      s += digits[h] + ' trăm ';
      if (t === 0 && u > 0) s += 'lẻ ';
    } else if (t > 0 || u > 0) {
      // s += 'không trăm '; // In some contexts
    }

    if (t > 1) {
      s += digits[t] + ' mươi ';
    } else if (t === 1) {
      s += 'mười ';
    }

    if (u === 1 && t > 1) {
      s += 'mốt';
    } else if (u === 5 && t > 0) {
      s += 'lăm';
    } else if (u > 0 || (h === 0 && t === 0)) {
       if (u > 0) s += digits[u];
    }
    return s;
  };

  let res = '';
  let tempNum = num;
  let i = 0;

  while (tempNum > 0) {
    const group = tempNum % 1000;
    if (group > 0) {
      const groupStr = readGroup(group);
      res = groupStr + units[i] + (res ? ' ' + res : '');
    }
    tempNum = Math.floor(tempNum / 1000);
    i++;
  }

  // Capitalize first letter and add currency
  res = res.trim();
  res = res.charAt(0).toUpperCase() + res.slice(1) + ' Việt Nam Đồng';
  return res.replace(/\s+/g, ' ');
};

export default function TransferConfirmScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [showOTPModal, setShowOTPModal] = useState(false);

  const { 
    senderName, 
    senderAcc, 
    recipientName, 
    accountNumber, 
    selectedBank, 
    amount, 
    content 
  } = route.params || {};

  const amountInWords = numberToWords(amount || '0');

  const handleOTPVerify = () => {
    setShowOTPModal(false);
    // Success flow - navigate to success screen with data
    navigation.navigate('TransferSuccess', {
      amount: amount,
      recipientName: recipientName,
      selectedBank: selectedBank,
      accountNumber: accountNumber,
      content: content
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* --- Header --- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
            <Ionicons name="chevron-back" size={26} color={Colors.transferText} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Xác nhận thông tin</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* --- Sender & Recipient Box --- */}
          <View style={styles.infoBox}>
            {/* Sender */}
            <View style={styles.infoRow}>
              <View style={styles.bankLogoCircle}>
                <Image source={require('../../assets/logosanh.png')} style={styles.senderLogo} resizeMode="contain" />
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.infoLabel}>Người chuyển tiền</Text>
                <Text style={styles.personName}>{senderName}</Text>
                <Text style={styles.accNumber}>{senderAcc}</Text>
                <Text style={styles.bankName}>Ngân hàng TMCP Quân đội</Text>
              </View>
            </View>

            {/* Separator / Arrow */}
            <View style={styles.separatorContainer}>
              <View style={styles.dashLine} />
              <View style={styles.arrowCircle}>
                <Ionicons name="arrow-down" size={16} color="#4732a8" />
              </View>
              <View style={styles.dashLine} />
            </View>

            {/* Recipient */}
            <View style={styles.infoRow}>
              <View style={styles.bankLogoCircle}>
                {selectedBank && (
                  <Image source={{ uri: selectedBank.logo }} style={styles.recipientLogo} resizeMode="contain" />
                )}
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.infoLabel}>Người nhận tiền</Text>
                <Text style={styles.personName}>{recipientName}</Text>
                <Text style={styles.accNumber}>{accountNumber}</Text>
                <Text style={styles.bankName}>{selectedBank?.name}</Text>
              </View>
            </View>
          </View>

          {/* --- Transaction Details --- */}
          <View style={styles.detailsBox}>
            <View style={styles.detailRow}>
              <View>
                <Text style={styles.detailLabel}>Số tiền giao dịch</Text>
                <Text style={styles.amountText}>{amount} VND</Text>
                <Text style={styles.amountWords}>{amountInWords}</Text>
              </View>
            </View>

            <View style={styles.detailDivider} />

            {/* Content Row */}
            <View style={styles.detailTextRow}>
              <Text style={styles.detailTextLabel}>Nội dung chuyển tiền</Text>
              <Text style={[styles.detailTextValue, { textAlign: 'right', flex: 1, marginLeft: 20 }]}>{content}</Text>
            </View>

            {/* Fee Row */}
            <View style={styles.detailTextRow}>
              <Text style={styles.detailTextLabel}>Phí giao dịch</Text>
              <Text style={styles.detailTextValue}>Miễn phí</Text>
            </View>

            {/* Method Row */}
            <View style={styles.detailTextRow}>
              <Text style={styles.detailTextLabel}>Hình thức chuyển tiền</Text>
              <Text style={styles.detailTextValue}>Chuyển nhanh</Text>
            </View>
          </View>

          {/* --- Warning Box --- */}
          <View style={styles.warningBox}>
            <Ionicons name="warning" size={20} color="#f59e0b" style={{ marginRight: 10 }} />
            <Text style={styles.warningText}>
              Vui lòng kiểm tra chính xác thông tin trước khi xác nhận giao dịch.
            </Text>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* --- Footer Buttons --- */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>Quay lại</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.confirmBtn}
            onPress={() => setShowOTPModal(true)}
          >
            <Text style={styles.confirmBtnText}>Xác nhận</Text>
          </TouchableOpacity>
        </View>

        {/* Digital OTP Modal */}
        <DigitalOTPModal 
          visible={showOTPModal}
          onClose={() => setShowOTPModal(false)}
          onVerify={handleOTPVerify}
        />

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.transferBg,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  headerBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a3182',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  
  // Info Box
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#eee8f5',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bankLogoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8f4ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee8f5',
  },
  senderLogo: {
    width: 28,
    height: 28,
  },
  recipientLogo: {
    width: 32,
    height: 32,
  },
  detailsContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5e43aa',
    marginBottom: 4,
  },
  personName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1a202c',
    marginBottom: 2,
  },
  accNumber: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '500',
    marginBottom: 2,
  },
  bankName: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '500',
  },

  // Separator
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  dashLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  arrowCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee8f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },

  // Details Box
  detailsBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee8f5',
    marginBottom: 20,
  },
  detailRow: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '600',
    marginBottom: 8,
  },
  amountText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a41a4',
    marginBottom: 4,
  },
  amountWords: {
    fontSize: 12,
    fontWeight: '600',
    color: '#718096',
    fontStyle: 'italic',
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginBottom: 16,
  },
  detailTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  detailTextLabel: {
    fontSize: 13,
    color: '#718096',
    fontWeight: '600',
  },
  detailTextValue: {
    fontSize: 13,
    color: '#1a202c',
    fontWeight: '700',
  },

  // Warning Box
  warningBox: {
    backgroundColor: '#fff7ed',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffedd5',
  },
  warningText: {
    flex: 1,
    fontSize: 12.5,
    color: '#9a3412',
    fontWeight: '600',
    lineHeight: 18,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 16,
  },
  backBtn: {
    flex: 1,
    backgroundColor: '#fdfbff',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e9e1f5',
  },
  backBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1a3182',
  },
  confirmBtn: {
    flex: 2,
    backgroundColor: '#0000cd', // Royal blue as in image
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
});
