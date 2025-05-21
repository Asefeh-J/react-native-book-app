import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  I18nManager,
  ImageBackground,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import { themes } from '../constants/theme';

// I18nManager.forceRTL(true); // Use only at startup if needed

export default function HomeScreen({ navigation }) {
  const currentTheme = themes?.spiritualTheme || {
    background: '#fff',
    primary: '#333',
    primaryDark: '#555',
    textPrimary: '#fff',
    textMuted: '#999',
  };

  console.log('🟢 HomeScreen rendered');

  useFocusEffect(
    useCallback(() => {
      console.log('🏠 HomeScreen focused');
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles(currentTheme).container}>
      <Text style={styles(currentTheme).title}>کتابخانه من</Text>

      <View style={styles(currentTheme).gridContainer}>
        <TouchableOpacity
          style={styles(currentTheme).gridButton}
          onPress={() => {
            console.log('➡️ Navigating to AddBook');
            navigation.navigate('AddBook');
          }}
        >
          <Icon name="plus" size={25} color="white" />
          <Text style={styles(currentTheme).buttonText}> افزودن کتاب جدید</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles(currentTheme).gridButton}
          onPress={() => {
            console.log('➡️ Navigating to BookList');
            navigation.navigate('BookList');
          }}
        >
          <Icon name="book" size={25} color="white" />
          <Text style={styles(currentTheme).buttonText}> مشاهده همه کتاب‌ها</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles(currentTheme).gridButton}
          onPress={() => {
            console.log('➡️ Navigating to SearchByText');
            navigation.navigate('SearchByText');
          }}
        >
          <Icon name="search" size={25} color="white" />
          <Text style={styles(currentTheme).buttonText}> جستجو بر اساس عنوان، نویسنده یا مکان</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles(currentTheme).gridButton}
          onPress={() => {
            console.log('➡️ Navigating to SearchByLetter');
            navigation.navigate('SearchByLetter');
          }}
        >
          <Icon name="search" size={25} color="white" />
          <Text style={styles(currentTheme).buttonText}> جستجو بر اساس حروف الفبا</Text>
        </TouchableOpacity>
      </View>

      <View style={styles(currentTheme).iconWithText}>
        <View style={styles(currentTheme).starsRow}>
          {[...Array(5)].map((_, index) => (
            <Icon key={index} name="star" size={12} style={styles(currentTheme).starIcon} />
          ))}
        </View>
        <Text style={styles(currentTheme).footerText}>یادم از کِشتهٔ خویش آمد و هنگامِ درو</Text>
      </View>

      {/* Footer Image */}
      <View style={styles(currentTheme).footerImageWrapper}>
        <ImageBackground
          source={require('../assets/images/texture9.webp')}
          style={styles(currentTheme).footerImage}
          resizeMode="cover"
        />
      </View>
    </ScrollView>
  );
}

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: theme.background,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingBottom: 150,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 30,
      color: theme.primary,
      textAlign: 'center',
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      width: '100%',
    },
    gridButton: {
      backgroundColor: theme.primaryDark,
      paddingHorizontal: 20,
      borderRadius: 15,
      marginVertical: 12,
      width: '48%',
      alignItems: 'center',
      elevation: 5,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    buttonText: {
      color: theme.textPrimary,
      fontSize: 20,
      fontWeight: '600',
      textAlign: 'center',
      marginLeft: 10,
    },
    footerText: {
      color: theme.primary,
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
