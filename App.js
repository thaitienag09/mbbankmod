import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BackgroundProvider } from './src/context/BackgroundContext';
import { AppPreferencesProvider } from './src/context/AppPreferencesContext';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import QRScanScreen from './src/screens/QRScanScreen';
import ImageCropScreen from './src/screens/ImageCropScreen';
import TransferScreen from './src/screens/TransferScreen';
import AccountTransferScreen from './src/screens/AccountTransferScreen';
import TransferConfirmScreen from './src/screens/TransferConfirmScreen';
import TransferSuccessScreen from './src/screens/TransferSuccessScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <AppPreferencesProvider>
        <BackgroundProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="QRScan" component={QRScanScreen} options={{ presentation: 'fullScreenModal' }} />
              <Stack.Screen name="ImageCrop" component={ImageCropScreen} options={{ presentation: 'fullScreenModal' }} />
              <Stack.Screen name="Transfer" component={TransferScreen} />
              <Stack.Screen name="AccountTransfer" component={AccountTransferScreen} />
              <Stack.Screen name="TransferConfirm" component={TransferConfirmScreen} />
              <Stack.Screen name="TransferSuccess" component={TransferSuccessScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </BackgroundProvider>
      </AppPreferencesProvider>
    </SafeAreaProvider>
  );
}
