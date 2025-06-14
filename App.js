import 'react-native-gesture-handler';
import React, { useEffect, useState, StrictMode } from 'react';
import { I18nManager, ActivityIndicator, View, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { initDatabase } from './database/Database';
import HomeScreen from './screens/HomeScreen';
import AddBookScreen from './screens/AddBookScreen';
import BookListScreen from './screens/BookListScreen';
import SearchByTextScreen from './screens/SearchByTextScreen';
import SearchByLetterScreen from './screens/SearchByLetterScreen';
import ErrorBoundary from './ErrorBoundary';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [restartNeeded, setRestartNeeded] = useState(false);

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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30, backgroundColor: '#F4F1EA' }}>
        <Text style={{ textAlign: 'center', fontSize: 18, color: '#3E3C64' }}>
          حالت راست به چپ فعال شد. لطفاً برنامه را ببندید و مجدداً باز کنید.
        </Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F1EA' }}>
        <ActivityIndicator size="large" color="#D4AF37" />
        <Text style={{ marginTop: 10, color: '#3E3C64' }}>در حال بارگذاری...</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <StrictMode>
        <NavigationContainer
          onStateChange={(state) => {
            const currentRoute = state.routes[state.index];
            console.log(`🧭 Navigation state changed: ${currentRoute.name}`);
          }}
        >
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#C1BBD9',
              },
              headerTintColor: '#3E3C64',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 20,
              },
              headerTitleAlign: 'center',
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'صفحه اصلی' }} />
            <Stack.Screen name="AddBook" component={AddBookScreen} options={{ title: 'افزودن کتاب' }} />
            <Stack.Screen name="BookList" component={BookListScreen} options={{ title: 'مشاهده لیست کتاب‌ها' }} />
            <Stack.Screen name="SearchByText" component={SearchByTextScreen} options={{ title: 'جستجو بر اساس متن' }} />
            <Stack.Screen name="SearchByLetter" component={SearchByLetterScreen} options={{ title: 'جستجو بر اساس حرف' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </StrictMode>
    </ErrorBoundary>
  );
}
