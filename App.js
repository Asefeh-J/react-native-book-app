import 'react-native-gesture-handler';
import React, { useEffect, useState, useRef } from 'react';
import {
  I18nManager,
  ActivityIndicator,
  View,
  Text,
  Alert,
  AppState,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { initDatabase } from './database/Database';
import ErrorBoundary from './ErrorBoundary';
import RootNavigator from './RootNavigator';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(false); // enable full logs temporarily

ErrorUtils.setGlobalHandler((error, isFatal) => {
  console.log('🌋 Global Error:', error.message);
});


export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [restartNeeded, setRestartNeeded] = useState(false);
  const appState = useRef(AppState.currentState);

  // ✅ AppState listener
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      console.log(`📱 AppState changed: ${nextAppState}`);
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // RTL & Database setup
  useEffect(() => {
    const setupRTLAndDatabase = async () => {
      try {
        console.log('App: Starting RTL and Database setup...');
        const rtlSet = await AsyncStorage.getItem('rtlSet');
        if (rtlSet !== 'true') {
          console.log('App: Setting RTL for the first time. Forcing restart.');
          I18nManager.allowRTL(true);
          I18nManager.forceRTL(true);
          await AsyncStorage.setItem('rtlSet', 'true');
          setRestartNeeded(true);
          return;
        }

        console.log('App: RTL already set. Initializing database...');
        await initDatabase();
        console.log('App: Database initialized successfully.');
        setIsReady(true);
        console.log('App: Application is ready.');
      } catch (err) {
        console.error('App: Error during app initialization (RTL or Database):', err);
        if (__DEV__) {
          Alert.alert(
            'Fatal Error',
            `Application failed to initialize database or RTL. Please restart.\nDetails: ${err.message}`,
            [{ text: 'OK' }]
          );
        }
      }
    };

    setupRTLAndDatabase();
  }, []);

  if (restartNeeded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 30,
          backgroundColor: '#F4F1EA',
        }}
      >
        <Text style={{ textAlign: 'center', fontSize: 18, color: '#3E3C64' }}>
          حالت راست به چپ فعال شد. لطفاً برنامه را ببندید و مجدداً باز کنید.
        </Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F4F1EA',
        }}
      >
        <ActivityIndicator size="large" color="#D4AF37" />
        <Text style={{ marginTop: 10, color: '#3E3C64' }}>در حال بارگذاری...</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <RootNavigator />
    </ErrorBoundary>
  );
}
