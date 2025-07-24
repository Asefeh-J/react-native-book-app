import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import AddBookScreen from './screens/AddBookScreen';
import BookListScreen from './screens/BookListScreen';
import SearchByTextScreen from './screens/SearchByTextScreen';
import SearchByLetterScreen from './screens/SearchByLetterScreen';
import EditBookScreen from './screens/EditBookScreen'; // Import the new screen

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  console.log('🔄 RootNavigator rendering'); // <-- ✅ Add this
  useEffect(() => {
    console.log('🔄 RootNavigator mounted');
    return () => {
      console.log('❌ RootNavigator unmounted');
    };
  }, []);

  return (
    <NavigationContainer
      onStateChange={(state) => {
        try {
          const currentRoute = state.routes[state.index];
          const stackNames = state.routes.map(r => r.name);
          console.log(`🧭 Navigation state changed: ${currentRoute.name}`);
          console.log('📦 Stack routes:', stackNames);
          console.log('📦 Stack length:', state.routes.length);
        } catch (error) {
          console.error('❌ Navigation state error:', error);
        }
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
        <Stack.Screen name="Home" options={{ title: 'صفحه اصلی' }}>
          {(props) => <HomeScreen {...props} key={props.route.key} />}
        </Stack.Screen>
        <Stack.Screen name="AddBook" component={AddBookScreen} options={{ title: 'افزودن کتاب' }} />
        <Stack.Screen name="BookList" component={BookListScreen} options={{ title: 'مشاهده لیست کتاب‌ها' }} />
        <Stack.Screen name="SearchByText" component={SearchByTextScreen} options={{ title: 'جستجو بر اساس متن' }} />
        <Stack.Screen name="SearchByLetter" component={SearchByLetterScreen} options={{ title: 'جستجو بر اساس حرف' }} />
        <Stack.Screen name="EditBook" component={EditBookScreen} options={{ title: 'ویرایش کتاب' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
