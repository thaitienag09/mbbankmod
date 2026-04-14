import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const services = [
  {
    id: 'transfer',
    title: 'Chuyển tiền',
    icon: 'exchange-alt',
    lib: FontAwesome5,
    color: '#3b82f6',
  },
  {
    id: 'topup',
    title: 'Nạp tiền điện thoại',
    icon: 'phone-plus',
    lib: MaterialCommunityIcons,
    color: '#3b82f6',
  },
  {
    id: 'savings',
    title: 'Tiền gửi',
    icon: 'piggy-bank',
    lib: FontAwesome5,
    color: '#3b82f6',
    badge: 'TÀI LỘC',
    badgeColor: '#ef4444',
  },
  {
    id: 'loan',
    title: 'Vay nhanh',
    icon: 'hand-holding-usd',
    lib: FontAwesome5,
    color: '#3b82f6',
    badge: 'NHƯ GIÓ',
    badgeColor: '#3b82f6',
  },
];

export default function ServiceGrid() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.gridCard}>
        <View style={styles.grid}>
          {services.map((item) => {
            const IconLib = item.lib;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.serviceItem}
                onPress={() => item.id === 'transfer' && navigation.navigate('Transfer')}
              >
                <View style={styles.iconContainer}>
                  {item.badge && (
                    <View style={[styles.badge, { backgroundColor: item.badgeColor }]}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                   <IconLib name={item.icon} size={24} color={item.color} />
                </View>
                <Text style={styles.serviceTitle}>{item.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Floating Expand Button */}
        <TouchableOpacity style={styles.expandButton}>
          <LinearGradient
            colors={['#ef4444', '#dc2626']}
            style={styles.redCircle}
          >
            <Ionicons name="chevron-down" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    alignItems: 'center',
    zIndex: 2,
  },
  gridCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
    position: 'relative',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  serviceItem: {
    width: '23%',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  badge: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 7,
    fontWeight: '800',
  },
  serviceTitle: {
    color: '#334155',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
  },
  expandButton: {
    position: 'absolute',
    bottom: -20,
    alignSelf: 'center',
  },
  redCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#f4f6f8',
  },
});
