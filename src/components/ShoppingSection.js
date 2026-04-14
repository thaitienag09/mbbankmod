import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

const items = [
  {
    id: 'lottery',
    label: 'Vua xổ số',
    icon: 'ticket-percent',
    lib: 'MCI',
    bg: '#ef4444',
    color: '#fff',
  },
  {
    id: 'flight',
    label: 'Vé Máy Bay\nSố',
    icon: 'airplane-takeoff',
    lib: 'MCI',
    bg: '#06b6d4',
    color: '#fff',
  },
  {
    id: 'vietlott',
    label: 'Vé số\nVietlott',
    icon: 'ticket',
    lib: 'MCI',
    bg: '#ef4444',
    color: '#fff',
  },
  {
    id: 'data',
    label: 'Data 4G/Thẻ\nGame',
    icon: 'gamepad-variant',
    lib: 'MCI',
    bg: '#7c3aed',
    color: '#fff',
  },
  {
    id: 'topup',
    label: 'Data 4G/\nNạp tiền',
    icon: 'sim',
    lib: 'MCI',
    bg: '#0ea5e9',
    color: '#fff',
  },
  {
    id: 'energy',
    label: 'MB Energy',
    icon: 'lightning-bolt',
    lib: 'MCI',
    bg: '#1e3a8a',
    color: '#fbbf24',
  },
  {
    id: 'ticket',
    label: 'Vé máy bay',
    icon: 'airplane',
    lib: 'MCI',
    bg: '#10b981',
    color: '#fff',
  },
  {
    id: 'more',
    label: 'Xem thêm\ndịch vụ',
    icon: 'view-grid-plus',
    lib: 'MCI',
    bg: '#f1f5f9',
    color: '#3b82f6',
    border: true,
  },
];

export default function ShoppingSection() {
  const rows = [items.slice(0, 4), items.slice(4, 8)];

  return (
    <View style={styles.container}>
      {/* Section header */}
      <Text style={styles.title}>Mua sắm - Giải trí - Đầu tư</Text>

      {/* Grid rows */}
      {rows.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {row.map((item) => (
            <TouchableOpacity key={item.id} style={styles.item} activeOpacity={0.75}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: item.bg },
                  item.border && styles.iconCircleBorder,
                ]}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={26}
                  color={item.color}
                />
              </View>
              <Text style={styles.label}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 14,
  },
  item: {
    width: '23%',
    alignItems: 'center',
    gap: 6,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleBorder: {
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  label: {
    fontSize: 10,
    color: '#334155',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 13,
  },
});
