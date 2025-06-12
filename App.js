import 'react-native-gesture-handler';
import React, { useEffect, useState, StrictMode } from 'react'; // Import StrictMode
import { I18nManager, ActivityIndicator, View, Text, Alert } from 'react-native'; // Import Alert
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { initDatabase } from './database/Database';
import HomeScreen from './screens/HomeScreen';
import AddBookScreen from './screens/AddBookScreen';
import BookListScreen from './screens/BookListScreen';
import SearchByTextScreen from './screens/SearchByTextScreen';
import SearchByLetterScreen from './screens/SearchByLetterScreen';
import ErrorBoundary from './ErrorBoundary'; // Assuming you have this component

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
          return; // Stop execution here if restart is needed
        }

        console.log('App: RTL already set. Initializing database...');
        await initDatabase();
        console.log('App: Database initialized successfully.');
        setIsReady(true);
        console.log('App: Application is ready.');
      } catch (err) {
        console.error('App: Error during app initialization (RTL or Database):', err);
        // Show a prominent alert if database initialization fails
        if (__DEV__) {
          Alert.alert(
            'Fatal Error',
            `Application failed to initialize database or RTL. Please restart. \nDetails: ${err.message}`,
            [{ text: 'OK' }]
          );
        }
        // You might want to handle this more gracefully for production,
        // perhaps showing a permanent error screen.
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
      {/* StrictMode applied here */}
      <StrictMode> 
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#C1BBD9', // Hardcoded: primaryDark
              },
              headerTintColor: '#3E3C64', // Hardcoded: textPrimary
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