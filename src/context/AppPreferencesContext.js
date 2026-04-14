import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppPreferencesContext = createContext();

export const PREFERENCE_KEYS = {
  SENDER_NAME: '@sender_name',
  SENDER_ACC: '@sender_acc',
  DEFAULT_RECIPIENT: '@default_recipient',
};

export const AppPreferencesProvider = ({ children }) => {
  const [senderName, setSenderName] = useState('DUONG THAI TIEN');
  const [senderAccountNumber, setSenderAccountNumber] = useState('0913263053');
  const [defaultRecipientName, setDefaultRecipientName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const savedName = await AsyncStorage.getItem(PREFERENCE_KEYS.SENDER_NAME);
      const savedAcc = await AsyncStorage.getItem(PREFERENCE_KEYS.SENDER_ACC);
      const savedRecipient = await AsyncStorage.getItem(PREFERENCE_KEYS.DEFAULT_RECIPIENT);

      if (savedName) setSenderName(savedName);
      if (savedAcc) setSenderAccountNumber(savedAcc);
      if (savedRecipient) setDefaultRecipientName(savedRecipient);
    } catch (e) {
      console.error('Failed to load preferences', e);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (updates) => {
    try {
      if (updates.senderName !== undefined) {
        setSenderName(updates.senderName);
        await AsyncStorage.setItem(PREFERENCE_KEYS.SENDER_NAME, updates.senderName);
      }
      if (updates.senderAccountNumber !== undefined) {
        setSenderAccountNumber(updates.senderAccountNumber);
        await AsyncStorage.setItem(PREFERENCE_KEYS.SENDER_ACC, updates.senderAccountNumber);
      }
      if (updates.defaultRecipientName !== undefined) {
        setDefaultRecipientName(updates.defaultRecipientName);
        await AsyncStorage.setItem(PREFERENCE_KEYS.DEFAULT_RECIPIENT, updates.defaultRecipientName);
      }
    } catch (e) {
      console.error('Failed to save preferences', e);
    }
  };

  const resetPreferences = async () => {
    const defaultName = 'DUONG THAI TIEN';
    const defaultAcc = '0913263053';
    const defaultRec = '';
    
    setSenderName(defaultName);
    setSenderAccountNumber(defaultAcc);
    setDefaultRecipientName(defaultRec);
    
    await AsyncStorage.multiRemove([
      PREFERENCE_KEYS.SENDER_NAME, 
      PREFERENCE_KEYS.SENDER_ACC, 
      PREFERENCE_KEYS.DEFAULT_RECIPIENT
    ]);
  };

  return (
    <AppPreferencesContext.Provider value={{
      senderName,
      senderAccountNumber,
      defaultRecipientName,
      updatePreferences,
      resetPreferences,
      isLoading
    }}>
      {children}
    </AppPreferencesContext.Provider>
  );
};

export const usePreferences = () => useContext(AppPreferencesContext);
