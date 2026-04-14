import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/colors';

const { width } = Dimensions.get('window');

const gridRows = [
  [
    { id: 'acc', label: 'Số tài khoản', icon: 'university', lib: FontAwesome5 },
    { id: 'phone', label: 'Số điện thoại', icon: 'phone-alt', lib: FontAwesome5 },
    { id: 'card', label: 'Số thẻ', icon: 'credit-card', lib: FontAwesome5 },
  ],
  [
    { id: 'large', label: 'Truy vấn giao dịch giá trị lớn', icon: 'history', lib: FontAwesome5, large: true },
    { id: 'partner', label: 'Đối tác MB', icon: 'handshake', lib: FontAwesome5 },
  ],
];

export default function TransferScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* --- Custom Header --- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
            <Ionicons name="chevron-back" size={26} color={Colors.transferText} />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerBtn}>
              <Ionicons name="notifications-outline" size={24} color={Colors.transferText} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate('Home')}>
              <Ionicons name="home-outline" size={24} color={Colors.transferText} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* --- Hero Title + QR --- */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>Chuyển tiền</Text>
            <TouchableOpacity style={styles.qrBtn}>
              <MaterialCommunityIcons name="qrcode-scan" size={22} color={Colors.transferText} />
            </TouchableOpacity>
          </View>

          {/* --- Grid Cards --- */}
          <View style={styles.gridSection}>
            {gridRows.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.gridRow}>
                {row.map((item) => {
                  const IconLib = item.lib;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.gridCard,
                        item.large ? styles.largeCard : styles.smallCard,
                        rowIndex === 1 && item.large && { flex: 1.8 },
                        rowIndex === 1 && !item.large && { flex: 1 },
                      ]}
                      onPress={() => item.id === 'acc' && navigation.navigate('AccountTransfer')}
                    >
                      <View style={[styles.iconCircle, item.large && styles.largeCardIcon]}>
                        <IconLib name={item.icon} size={rowIndex === 1 ? 22 : 20} color={Colors.transferIconColor} />
                      </View>
                      <Text style={[styles.cardLabel, item.large && styles.largeCardLabel, item.large && { flex: 1 }]} numberOfLines={2}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          {/* --- Search & Tabs Placeholder --- */}
          <View style={styles.searchSection}>
            <View style={styles.tabBar}>
              <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                <Text style={styles.activeTabText}>Đã lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab}>
                <Text style={styles.tabText}>Mẫu chuyển tiền</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
              <Ionicons name="search" size={18} color="#a0aec0" style={styles.searchIcon} />
              <TextInput
                placeholder="Tìm theo tên, số tài khoản"
                placeholderTextColor="#a0aec0"
                style={styles.searchInput}
              />
            </View>
          </View>

          {/* Bottom padding */}
          <View style={{ height: 40 }} />
        </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  heroSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.transferText,
  },
  qrBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.transferCardBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.transferCardBorder,
  },

  // Grid
  gridSection: {
    gap: 12,
    marginBottom: 24,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridCard: {
    backgroundColor: Colors.transferCardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.transferCardBorder,
    shadowColor: '#a0aec0',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  smallCard: {
    aspectRatio: 1,
    justifyContent: 'center',
  },
  largeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.transferIconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeCardIcon: {
    marginBottom: 0, 
  },
  cardLabel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: Colors.transferText,
    lineHeight: 18,
    marginTop: 8,
  },
  largeCardLabel: {
    marginTop: 0,
  },

  // Search & Tabs
  searchSection: {
    marginTop: 10,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 22,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
  },
  activeTabText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.transferText,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.transferText,
  },
});
