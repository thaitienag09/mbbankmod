import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Dimensions,
  Modal,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import { usePreferences } from '../context/AppPreferencesContext';

const { width, height } = Dimensions.get('window');

export default function AccountTransferScreen() {
  const navigation = useNavigation();
  const { senderName, senderAccountNumber, defaultRecipientName } = usePreferences();
  
  const [amount, setAmount] = useState('0');
  const [content, setContent] = useState(`${senderName} chuyen tien`);
  
  // Bank Modal State
  const [showBankModal, setShowBankModal] = useState(false);
  const [banks, setBanks] = useState([]);
  const [filteredBanks, setFilteredBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Recipient Lookup State
  const [accountNumber, setAccountNumber] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [isLookupLoading, setIsLookupLoading] = useState(false);
  const [saveInfo, setSaveInfo] = useState(false);

  // Fetch banks from API
  useEffect(() => {
    fetchBanks();
  }, []);

  // Update content if sender changes
  useEffect(() => {
    setContent(`${senderName} chuyen tien`);
  }, [senderName]);

  // Simulated Lookup Effect
  useEffect(() => {
    if (accountNumber.length >= 10) {
      triggerLookup();
    } else {
      setRecipientName('');
    }
  }, [accountNumber]);

  const triggerLookup = () => {
    setIsLookupLoading(true);
    // Simulate network delay
    setTimeout(() => {
      // Use default recipient name if set in settings, otherwise use fallback
      setRecipientName(defaultRecipientName || 'DUONG THAI TIEN');
      setIsLookupLoading(false);
    }, 1000);
  };

  const fetchBanks = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.vietqr.io/v2/banks');
      const result = await response.json();
      if (result.code === '00') {
        setBanks(result.data);
        setFilteredBanks(result.data);
      }
    } catch (error) {
      console.error('Error fetching banks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (!text) {
      setFilteredBanks(banks);
      return;
    }
    const filtered = banks.filter(bank => 
      bank.name.toLowerCase().includes(text.toLowerCase()) || 
      bank.shortName.toLowerCase().includes(text.toLowerCase()) ||
      bank.custom_name?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredBanks(filtered);
  };

  const selectBank = (bank) => {
    setSelectedBank(bank);
    setShowBankModal(false);
    setSearchQuery('');
    setFilteredBanks(banks);
  };

  // Format number with commas
  const formatNumber = (val) => {
    if (!val) return '0';
    const cleanNum = val.replace(/\D/g, '');
    return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAmountChange = (val) => {
    setAmount(formatNumber(val));
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
          <Text style={styles.headerTitle}>Chuyển tiền tới số tài khoản</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* --- Source Section --- */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Nguồn chuyển tiền</Text>
            <TouchableOpacity style={styles.sourceCard} activeOpacity={0.9}>
              <View style={styles.sourceContent}>
                <Text style={styles.sourceType}>TÀI KHOẢN THANH TOÁN</Text>
                <Text style={styles.sourceNumber}>{senderAccountNumber}</Text>
                <Text style={styles.sourceBalance}>1,100,000,000 VND</Text>
              </View>
              <Ionicons name="chevron-down" size={18} color="#718096" />
            </TouchableOpacity>
          </View>

          {/* --- Destination Section --- */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Chuyển đến</Text>
            
            {/* Bank Select */}
            <TouchableOpacity 
              style={styles.inputBox} 
              activeOpacity={0.7}
              onPress={() => setShowBankModal(true)}
            >
              <View style={styles.selectedBankContainer}>
                {selectedBank && (
                  <Image source={{ uri: selectedBank.logo }} style={styles.selectedBankLogo} resizeMode="contain" />
                )}
                <Text style={[styles.inputPlaceholder, selectedBank && { color: '#1a202c', fontWeight: '700' }]}>
                  {selectedBank ? selectedBank.shortName : 'Ngân hàng'}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={18} color="#718096" />
            </TouchableOpacity>

            {/* Account Number Input */}
            <View style={styles.inputBox}>
              <TextInput
                placeholder="Số tài khoản"
                placeholderTextColor="#a0aec0"
                style={styles.textInput}
                keyboardType="numeric"
                value={accountNumber}
                onChangeText={setAccountNumber}
              />
              <View style={styles.inputRightIcons}>
                {accountNumber?.length > 0 && (
                  <TouchableOpacity onPress={() => setAccountNumber('')}>
                    <Ionicons name="close-circle" size={18} color="#cbd5e1" style={{ marginRight: 8 }} />
                  </TouchableOpacity>
                )}
                <MaterialCommunityIcons name="account-details-outline" size={22} color={Colors.transferIconColor} />
              </View>
            </View>

            {/* Recipient Name Box */}
            {(recipientName !== '' || isLookupLoading) && (
              <View style={styles.recipientBox}>
                <View style={styles.recipientHeader}>
                  <Text style={styles.recipientLabel}>Tên người nhận</Text>
                  {isLookupLoading && <ActivityIndicator size="small" color="#1a3182" />}
                </View>
                {!isLookupLoading && <Text style={styles.recipientNameText}>{recipientName}</Text>}
              </View>
            )}

            {/* Save Info Toggle */}
            {recipientName !== '' && (
              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>Lưu thông tin người nhận</Text>
                <TouchableOpacity 
                  activeOpacity={0.8}
                  onPress={() => setSaveInfo(!saveInfo)}
                  style={[styles.switchTrack, saveInfo && styles.switchTrackActive]}
                >
                  <View style={[styles.switchThumb, saveInfo && styles.switchThumbActive]} />
                </TouchableOpacity>
              </View>
            )}

          </View>

          {/* --- Amount Section --- */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Số tiền</Text>
            
            {/* Large Amount Display */}
            <View style={styles.amountInputBox}>
              <View style={styles.amountRow}>
                <TextInput
                  value={amount}
                  onChangeText={handleAmountChange}
                  style={styles.largeAmountText}
                  keyboardType="numeric"
                  textAlign="center"
                  placeholder="0"
                />
                <Text style={styles.vndLabel}>VND</Text>
              </View>
            </View>

            {/* Content Input */}
            <View style={styles.contentBox}>
              <View style={styles.contentHeader}>
                <Text style={styles.contentLabel}>Nội dung chuyển tiền</Text>
                <TouchableOpacity onPress={() => setContent('')}>
                  <Ionicons name="close-circle" size={18} color="#cbd5e1" />
                </TouchableOpacity>
              </View>
              <TextInput
                value={content}
                onChangeText={setContent}
                style={styles.contentText}
                multiline
              />
            </View>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* --- Footer Buttons --- */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>Quay lại</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.continueBtn, (!selectedBank || !accountNumber || amount === '0' || !recipientName) && { opacity: 0.6 }]}
            disabled={!selectedBank || !accountNumber || amount === '0' || !recipientName}
            onPress={() => navigation.navigate('TransferConfirm', {
              senderName: senderName,
              senderAcc: senderAccountNumber,
              recipientName: recipientName,
              accountNumber: accountNumber,
              selectedBank: selectedBank,
              amount: amount,
              content: content
            })}
          >
            <Text style={styles.continueBtnText}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>

        {/* --- Bank Selection Modal --- */}
        <Modal
          visible={showBankModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowBankModal(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity 
              style={styles.modalBackdrop} 
              activeOpacity={1} 
              onPress={() => setShowBankModal(false)} 
            />
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />
              
              <Text style={styles.modalTitle}>Chọn ngân hàng</Text>

              <View style={styles.modalSearchContainer}>
                <TextInput
                  placeholder="Tìm theo tên ngân hàng"
                  placeholderTextColor="#a0aec0"
                  style={styles.modalSearchInput}
                  value={searchQuery}
                  onChangeText={handleSearch}
                />
                <Ionicons name="search" size={20} color="#a0aec0" />
              </View>

              {loading ? (
                <ActivityIndicator size="large" color="#1a3182" style={{ marginTop: 40 }} />
              ) : (
                <FlatList
                  data={filteredBanks}
                  keyExtractor={(item) => item.id.toString()}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.bankListContent}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={styles.bankItem} 
                      activeOpacity={0.6}
                      onPress={() => selectBank(item)}
                    >
                      <Image source={{ uri: item.logo }} style={styles.bankLogo} resizeMode="contain" />
                      <View style={styles.bankInfo}>
                        <Text style={styles.bankShortName}>{item.shortName}</Text>
                        <Text style={styles.bankFullName} numberOfLines={1}>{item.name}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => <View style={styles.modalSeparator} />}
                />
              )}
            </View>
          </View>
        </Modal>

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
    paddingTop: 4,
  },
  section: {
    marginBottom: 26,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 10,
    marginLeft: 2,
  },
  
  // Source Card
  sourceCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee8f5',
    shadowColor: '#a0aec0',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 1,
  },
  sourceContent: {
    flex: 1,
  },
  sourceType: {
    fontSize: 11,
    fontWeight: '800',
    color: '#5e43aa',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  sourceNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4a5568',
    marginBottom: 6,
  },
  sourceBalance: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1a202c',
  },

  // Inputs
  inputBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#eee8f5',
  },
  inputPlaceholder: {
    fontSize: 15,
    color: '#4a5568',
    fontWeight: '500',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#1a202c',
    fontWeight: '600',
  },
  inputRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedBankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedBankLogo: {
    width: 28,
    height: 28,
    borderRadius: 6,
    marginRight: 10,
  },
  recipientBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee8f5',
    marginBottom: 14,
  },
  recipientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recipientLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5e43aa',
  },
  recipientNameText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1a202c',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#eee8f5',
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2d3748',
  },
  switchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#cbd5e1',
    padding: 2,
    justifyContent: 'center',
  },
  switchTrackActive: {
    backgroundColor: '#6b7aff',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },

  // Amount
  amountInputBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#eee8f5',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  largeAmountText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a41a4', 
    minWidth: 50,
  },
  vndLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1a202c',
  },

  // Content
  contentBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee8f5',
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  contentLabel: {
    fontSize: 11,
    color: '#5e43aa',
    fontWeight: '800',
  },
  contentText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1a202c',
    lineHeight: 22,
    padding: 0,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 16,
    backgroundColor: 'transparent',
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
  continueBtn: {
    flex: 2,
    backgroundColor: '#6b7aff', 
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#6b7aff',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fdfbff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: height * 0.8,
    paddingTop: 12,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a3182',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#e9e1f5',
    marginBottom: 16,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 15,
    color: '#2d3748',
  },
  bankListContent: {
    paddingBottom: 40,
  },
  bankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  bankLogo: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginRight: 16,
  },
  bankInfo: {
    flex: 1,
  },
  bankShortName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a3182',
    marginBottom: 2,
  },
  bankFullName: {
    fontSize: 13,
    color: '#718096',
  },
  modalSeparator: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginHorizontal: 0,
  },
});
