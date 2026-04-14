import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';

const { width } = Dimensions.get('window');
const SLIDE_WIDTH = width - 32;
const SLIDE_HEIGHT = Math.round(SLIDE_WIDTH * 0.45);
const INTERVAL = 3500; // Auto-scroll every 3.5 seconds

const banners = [
  { id: '1', source: require('../../assets/banner1.jpg') },
  { id: '2', source: require('../../assets/banner2.jpg') },
  { id: '3', source: require('../../assets/banner3.jpg') },
];

export default function PromoCarousel() {
  const scrollRef = useRef(null);
  const currentIndex = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const isUserScrolling = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isUserScrolling.current) return;
      currentIndex.current = (currentIndex.current + 1) % banners.length;
      scrollRef.current?.scrollTo({
        x: currentIndex.current * (SLIDE_WIDTH + 12),
        animated: true,
      });
      setActiveIndex(currentIndex.current);
    }, INTERVAL);

    return () => clearInterval(timer);
  }, []);

  const handleScrollEnd = (e) => {
    const offset = e.nativeEvent.contentOffset.x;
    const idx = Math.round(offset / (SLIDE_WIDTH + 12));
    currentIndex.current = idx;
    setActiveIndex(idx);
    isUserScrolling.current = false;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SLIDE_WIDTH + 12}
        snapToAlignment="center"
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
        onScrollBeginDrag={() => { isUserScrolling.current = true; }}
        onMomentumScrollEnd={handleScrollEnd}
      >
        {banners.map((banner) => (
          <TouchableOpacity
            key={banner.id}
            activeOpacity={0.95}
            style={styles.slide}
          >
            <Image
              source={banner.source}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Dot indicators */}
      <View style={styles.dotsRow}>
        {banners.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  slide: {
    width: SLIDE_WIDTH,
    height: SLIDE_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#cbd5e1',
  },
  dotActive: {
    width: 18,
    backgroundColor: '#3b82f6',
    borderRadius: 3,
  },
});
