import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import { BlurView } from 'expo-blur';
import { usePreferences } from '../context/AppPreferencesContext';

const { width, height } = Dimensions.get('window');

export default function TransferSuccessScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { senderAccountNumber } = usePreferences();
  const { 
    amount, 
    recipientName, 
    selectedBank, 
    accountNumber, 
    content 
  } = route.params || {};

  // Animations
  const slideAnim = React.useRef(new Animated.Value(-200)).current;
  const tickScale = React.useRef(new Animated.Value(0)).current;
  const tickOpacity = React.useRef(new Animated.Value(0)).current;
  const receiptScale = React.useRef(new Animated.Value(0.95)).current;
  const receiptOpacity = React.useRef(new Animated.Value(0)).current;

  // Formatted date and time
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
  const timestamp = `${timeStr} - ${dateStr}`;

  // Calculate remaining balance
  const initialBalance = 1100000000;
  const transferAmt = parseInt((amount || '0').replace(/\D/g, ''), 10);
  const remainingBalance = initialBalance - transferAmt;
  
  const formatBalance = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  React.useEffect(() => {
    // Sequence: Receipt pop -> Tick pop -> Notification slide
    Animated.parallel([
      Animated.timing(receiptOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(receiptScale, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();

    // Success icon animation delayed
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(tickScale, {
          toValue: 1,
          tension: 100,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(tickOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    }, 200);

    // Notification animation after a slightly longer delay
    setTimeout(() => {
      Animated.spring(slideAnim, {
        toValue: 50,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }, 800);

    // Auto-hide notification after 6 seconds
    const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
            toValue: -200,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, 6800);

    return () => clearTimeout(timer);
  }, []);

  const maskAccount = (acc) => {
    if (!acc) return '';
    const cleanAcc = acc.replace(/\s/g, '');
    if (cleanAcc.length < 7) return cleanAcc;
    return `${cleanAcc.slice(0, 3)}...${cleanAcc.slice(-4)}`;
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      {/* --- Floating Push Notification (iOS Style) --- */}
      <Animated.View style={[styles.notificationWrapper, { transform: [{ translateY: slideAnim }] }]}>
        <BlurView intensity={95} tint="light" style={styles.notificationBlur}>
            <View style={styles.notificationTop}>
                <View style={styles.notificationLeft}>
                    <View style={styles.mbNotifIconContainer}>
                      <Image source={require('../../assets/mbbank_icon.png')} style={styles.notifIcon} resizeMode="contain" />
                    </View>
                    <Text style={styles.notifTitle}>MB BANK</Text>
                </View>
                <Text style={styles.notifTime}>bây giờ</Text>
            </View>
            <Text style={styles.notifContent} numberOfLines={2}>
                {`TK ${maskAccount(senderAccountNumber)}|GD: -${amount}VND ${dateStr} ${timeStr} |SD: ${formatBalance(remainingBalance)}VND|DEN: ${recipientName.toUpperCase()}...`}
            </Text>
        </BlurView>
      </Animated.View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* --- Header --- */}
        <View style={styles.header}>
          <TouchableOpacity style={{ opacity: 0 }} disabled>
            <Ionicons name="chevron-back" size={26} color="transparent" />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity 
            style={styles.homeBtn} 
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="home-outline" size={20} color="#1a3182" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <Animated.View style={[
            styles.mainContent,
            { opacity: receiptOpacity, transform: [{ scale: receiptScale }] }
          ]}>
            {/* --- Success Icon --- */}
            {/* --- Success Icon & Info --- */}
            <View style={styles.topSection}>
              <Animated.View style={[
                styles.successIconWrapper,
                { opacity: tickOpacity, transform: [{ scale: tickScale }] }
              ]}>
                <Image source={require('../../assets/dautick.png')} style={styles.successIcon} resizeMode="contain" />
              </Animated.View>

              <Text style={styles.successText}>Giao dịch thành công</Text>
              <Text style={styles.amountText}>{amount} <Text style={styles.currencyText}>VND</Text></Text>
              <Text style={styles.timestampText}>{timestamp}</Text>

              <View style={styles.dividerWrapper}>
                <View style={styles.divider} />
                <View style={styles.dividerDotLeft} />
                <View style={styles.dividerDotRight} />
              </View>
            </View>

            {/* --- Recipient Details Box --- */}
            <View style={styles.receiptBody}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tên người nhận</Text>
                <Text style={styles.recipientNameText}>{recipientName}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tài khoản thụ hưởng</Text>
                <Text style={styles.detailValue}>{maskAccount(accountNumber)}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Ngân hàng thụ hưởng</Text>
                <View style={styles.bankNameRow}>
                  {selectedBank && (
                    <Image source={{ uri: selectedBank.logo }} style={styles.bankLogoInline} resizeMode="contain" />
                  )}
                  <Text style={styles.detailValue}>{selectedBank?.shortName}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Nội dung</Text>
                <Text style={styles.detailValue}>{content}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Mã giao dịch</Text>
                <Text style={styles.detailValue}>{Math.random().toString(36).substring(2, 12).toUpperCase()}</Text>
              </View>
            </View>

            <View style={styles.receiptFooter}>
              <Text style={styles.thankYouText}>Cảm ơn bạn đã tin dùng dịch vụ của MB</Text>
              <Image source={require('../../assets/logochuyentien.jpg')} style={styles.mbLogo} resizeMode="contain" />
            </View>
          </Animated.View>

          {/* --- Quick Actions --- */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionBtn}>
              <View style={styles.actionCircle}>
                <Feather name="share-2" size={24} color="#1a3182" />
              </View>
              <Text style={styles.actionLabel}>Chia sẻ</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn}>
              <View style={styles.actionCircle}>
                <Feather name="download" size={24} color="#1a3182" />
              </View>
              <Text style={styles.actionLabel}>Lưu ảnh</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn}>
              <View style={styles.actionCircle}>
                <Feather name="file-text" size={24} color="#1a3182" />
              </View>
              <Text style={styles.actionLabel}>Lưu mẫu</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* --- Footer Button --- */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.doneBtn}
            onPress={() => navigation.navigate('AccountTransfer')}
          >
            <Text style={styles.doneBtnText}>Thực hiện giao dịch khác</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#eff6ff', 
  },
  notificationWrapper: {
    position: 'absolute',
    top: 0,
    left: 10,
    right: 10,
    zIndex: 9999,
  },
  notificationBlur: {
    padding: 12,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  notificationTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mbNotifIconContainer: {
    width: 24,
    height: 24,
    backgroundColor: '#fff',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#eee',
  },
  notifIcon: {
    width: 18,
    height: 18,
  },
  notifTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.5,
  },
  notifTime: {
    fontSize: 11,
    color: '#666',
  },
  notifContent: {
    fontSize: 12,
    color: '#000',
    lineHeight: 16,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  homeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  
  // Main Receipt Card
  mainContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    shadowColor: '#1a3182',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
  },
  topSection: {
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },
  successIconWrapper: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  successIcon: {
    width: 100,
    height: 100,
  },
  successText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 10,
  },
  amountText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a3182',
    marginBottom: 6,
  },
  currencyText: {
    fontSize: 18,
    fontWeight: '600',
  },
  timestampText: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 30,
  },
  
  // Divider with dots
  dividerWrapper: {
    width: '100%',
    height: 20,
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    width: '100%',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dividerDotLeft: {
    position: 'absolute',
    left: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#eff6ff', 
  },
  dividerDotRight: {
    position: 'absolute',
    right: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
  },

  // Receipt Body
  receiptBody: {
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f1f5f9',
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '700',
    textAlign: 'right',
    flex: 1.5,
  },
  recipientNameText: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '800',
    textAlign: 'right',
    flex: 1.5,
    textTransform: 'uppercase',
  },
  bankNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1.5,
  },
  bankLogoInline: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
  },

  receiptFooter: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  thankYouText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 10,
  },
  mbLogo: {
    width: 80,
    height: 32,
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 30,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 10,
  },
  actionCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1a3182',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },

  // Footer Button
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  doneBtn: {
    backgroundColor: '#0000cd', // Premium blue
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0000cd',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  doneBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
});
