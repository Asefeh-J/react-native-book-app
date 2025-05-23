import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { I18nManager, ActivityIndicator, View, Text } from 'react-native';
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
        const rtlSet = await AsyncStorage.getItem('rtlSet');
        if (rtlSet !== 'true') {
          I18nManager.allowRTL(true);
          I18nManager.forceRTL(true);
          await AsyncStorage.setItem('rtlSet', 'true');
          setRestartNeeded(true);
          return;
        }

        await initDatabase();
        setIsReady(true);
      } catch (err) {
        console.error('Error initializing app:', err);
      }
    };

    setupRTLAndDatabase();
  }, []);

  if (restartNeeded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 }}>
        <Text style={{ textAlign: 'center', fontSize: 18 }}>
          حالت راست به چپ فعال شد. لطفاً برنامه را ببندید و مجدداً باز کنید.
        </Text>
      </View>
    );
  }

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
    </ErrorBoundary>
  );
}
