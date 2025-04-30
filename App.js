// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initDatabase } from './database/Database';
import HomeScreen from './screens/HomeScreen';
import AddBookScreen from './screens/AddBookScreen';
import BookListScreen from './screens/BookListScreen';
import SearchByTextScreen from './screens/SearchByTextScreen';
import SearchByLetterScreen from './screens/SearchByLetterScreen';
import { themes } from './constants/theme'; // Import your theme

const Stack = createNativeStackNavigator();
const currentTheme = themes.spiritualTheme;

export default function App() {
  useEffect(() => {
    const initializeDatabase = async () => {
      await initDatabase();
    };
    initializeDatabase();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: currentTheme.primaryDark, // Top bar background
          },
          headerTintColor: currentTheme.textPrimary, // Back button & title text
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
  );
}
