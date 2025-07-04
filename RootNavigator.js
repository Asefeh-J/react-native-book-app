import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import AddBookScreen from './screens/AddBookScreen';
import BookListScreen from './screens/BookListScreen';
import SearchByTextScreen from './screens/SearchByTextScreen';
import SearchByLetterScreen from './screens/SearchByLetterScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer
      onStateChange={(state) => {
        const currentRoute = state.routes[state.index];
        console.log(`🧭 Navigation state changed: ${currentRoute.name}`);
      }}
    >
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#C1BBD9' },
          headerTintColor: '#3E3C64',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
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
