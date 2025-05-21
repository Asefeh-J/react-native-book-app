import React, { useEffect, useState } from 'react';
import { I18nManager, ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { initDatabase } from './database/Database';
import HomeScreen from './screens/HomeScreen';
import AddBookScreen from './screens/AddBookScreen';
import BookListScreen from './screens/BookListScreen';
import SearchByTextScreen from './screens/SearchByTextScreen';
import SearchByLetterScreen from './screens/SearchByLetterScreen';
import { themes } from './constants/theme';
import ErrorBoundary from './ErrorBoundary';

const Stack = createNativeStackNavigator();
const currentTheme = themes.spiritualTheme;

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const setupRTLAndDatabase = async () => {
      try {
        const rtlSet = await AsyncStorage.getItem('rtlSet');

        if (rtlSet !== 'true') {
          I18nManager.allowRTL(true);
          I18nManager.forceRTL(true);
          await AsyncStorage.setItem('rtlSet', 'true');
          // Skip restarting — allow user to manually restart or handle it with a message
          console.warn('RTL mode set. Please restart the app manually.');
        }

        await initDatabase();
        setIsReady(true);
      } catch (err) {
        console.error('Error initializing app:', err);
      }
    };

    setupRTLAndDatabase();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: currentTheme.primaryDark,
            },
            headerTintColor: currentTheme.textPrimary,
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
    </ErrorBoundary>
  );
}
