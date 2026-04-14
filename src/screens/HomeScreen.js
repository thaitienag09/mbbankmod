import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { useBackground } from '../context/BackgroundContext';

// Internal Components
import HomeHeader from '../components/HomeHeader';
import DecorativePills from '../components/DecorativePills';
import BalanceCard from '../components/BalanceCard';
import ServiceGrid from '../components/ServiceGrid';
import PromoCarousel from '../components/PromoCarousel';
import ShoppingSection from '../components/ShoppingSection';
import BottomNavBar from '../components/BottomNavBar';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { bgImage } = useBackground();
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background: custom image or gradient fallback */}
      {bgImage ? (
        <Image
          source={{ uri: bgImage }}
          style={StyleSheet.absoluteFill}
          blurRadius={0}
        />
      ) : (
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientMid, Colors.gradientEnd]}
          style={StyleSheet.absoluteFill}
        />
      )}
      
      {/* Decorative floating shapes */}
      <DecorativePills />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Sticky Header */}
        <HomeHeader />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Top Section: User Info & Balance */}
          <BalanceCard />

          {/* Main Content Area (White Card start) */}
          <View style={styles.mainContent}>
            {/* Service Icons Grid */}
            <ServiceGrid />

            {/* Promo Carousel */}
            <PromoCarousel />

            {/* Mua sắm - Giải trí - Đầu tư */}
            <ShoppingSection />

            {/* Bottom padding so content clears the nav bar */}
            <View style={{ height: 120 }} />
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Sticky Bottom Tab Bar */}
      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.gradientStart,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  mainContent: {
    backgroundColor: '#f4f6f8',
    marginTop: 20,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    minHeight: Dimensions.get('window').height * 0.7,
  },
});

