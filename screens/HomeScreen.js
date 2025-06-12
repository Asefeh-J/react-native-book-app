import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import { InteractionManager } from 'react-native';

export default function HomeScreen({ navigation }) {
  const [isReady, setIsReady] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      console.log('🏠 HomeScreen focused');
  
      const interactionTask = InteractionManager.runAfterInteractions(() => {
        if (isActive) {
          console.log('✅ Interaction complete, safe to render');
          setIsReady(true);
        }
      });
  
      return () => {
        console.log('👋 HomeScreen unfocused');
        isActive = false;
        interactionTask.cancel();
        setIsReady(false);
      };
    }, [])
  );
  

  useEffect(() => {
    console.log('HomeScreen: useEffect - Mounted');
    return () => {
      console.log('HomeScreen: useEffect - Unmounted');
    };
  }, []);

  if (!isReady) {
    console.log('⌛ HomeScreen waiting for interaction...');
    return null; // Avoid rendering too early
  }

  try {
    console.log('HomeScreen: Attempting to return JSX');
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>کتابخانه </Text>

        <View style={styles.gridContainer}>
          <TouchableOpacity
            style={styles.gridButton}
            onPress={() => {
              console.log('HomeScreen: Navigating to AddBook');
              navigation.navigate('AddBook');
            }}
          >
            <Icon name="plus" size={25} color="#FFFFFF" />
            <Text style={styles.buttonText}> افزودن کتاب جدید</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridButton}
            onPress={() => {
              console.log('HomeScreen: Navigating to BookList');
              navigation.navigate('BookList');
            }}
          >
            <Icon name="book" size={25} color="#FFFFFF" />
            <Text style={styles.buttonText}> مشاهده همه کتاب‌ها</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridButton}
            onPress={() => {
              console.log('HomeScreen: Navigating to SearchByText');
              navigation.navigate('SearchByText');
            }}
          >
            <Icon name="search" size={25} color="#FFFFFF" />
            <Text style={styles.buttonText}> جستجو بر اساس عنوان، نویسنده یا مکان</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridButton}
            onPress={() => {
              console.log('HomeScreen: Navigating to SearchByLetter');
              navigation.navigate('SearchByLetter');
            }}
          >
            <Icon name="search" size={25} color="#FFFFFF" />
            <Text style={styles.buttonText}> جستجو بر اساس حروف الفبا</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.iconWithText}>
          <View style={styles.starsRow}>
            {[...Array(5)].map((_, index) => (
              <Icon key={index} name="star" size={12} style={styles.starIcon} />
            ))}
          </View>
          <Text style={styles.footerText}>یادم از کِشتهٔ خویش آمد و هنگامِ درو</Text>
        </View>

        <View style={styles.footerImageWrapper}>
          <ImageBackground
            source={require('../assets/images/texture9.png')}
            style={styles.footerImage}
            resizeMode="cover"
            onError={(e) => {
              console.error('🔴 ImageBackground loading error:', e.nativeEvent.error);
              if (__DEV__) {
                Alert.alert('Image Error', 'Failed to load texture9.png');
              }
            }}
          />
        </View>
      </ScrollView>
    );
  } catch (err) {
    console.error("🔴 Error rendering HomeScreen (caught by try-catch):", err);
    if (__DEV__) {
      Alert.alert(
        'Rendering Error',
        'خطا در بارگذاری صفحه خانه. لطفاً برنامه را مجدداً راه‌اندازی کنید.' + '\nDetails: ' + err.message
      );
    }
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>خطا در بارگذاری صفحه خانه. لطفاً برنامه را مجدداً راه‌اندازی کنید.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F4F1EA',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 150,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#5E548E',
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  gridButton: {
    backgroundColor: '#C1BBD9',
    paddingHorizontal: 20,
    borderRadius: 15,
    marginVertical: 12,
    width: '48%',
    alignItems: 'center',
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#7D6B91',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#3E3C64',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginLeft: 10,
  },
  footerText: {
    color: '#5E548E',
    fontSize: 16,
    marginTop: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  iconWithText: {
    alignItems: 'center',
    marginTop: 30,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  starIcon: {
    marginHorizontal: 2,
    color: '#D4AF37',
  },
  footerImageWrapper: {
    width: '100%',
    height: 200,
    overflow: 'hidden',
    marginTop: 30,
    position: 'relative',
  },
  footerImage: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
  },
});
