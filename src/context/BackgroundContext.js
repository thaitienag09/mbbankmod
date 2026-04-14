import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BG_KEY = '@mbbank_bg_image';

const BackgroundContext = createContext({
  bgImage: null,
  setBgImage: () => {},
  clearBgImage: () => {},
});

export function BackgroundProvider({ children }) {
  const [bgImage, setBgImageState] = useState(null);

  // Load saved background on startup
  useEffect(() => {
    AsyncStorage.getItem(BG_KEY).then((uri) => {
      if (uri) setBgImageState(uri);
    });
  }, []);

  const setBgImage = async (uri) => {
    setBgImageState(uri);
    await AsyncStorage.setItem(BG_KEY, uri);
  };

  const clearBgImage = async () => {
    setBgImageState(null);
    await AsyncStorage.removeItem(BG_KEY);
  };

  return (
    <BackgroundContext.Provider value={{ bgImage, setBgImage, clearBgImage }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export const useBackground = () => useContext(BackgroundContext);
