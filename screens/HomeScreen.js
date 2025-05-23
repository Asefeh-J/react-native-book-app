import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';


export default function HomeScreen({ navigation }) {

  useFocusEffect(
    useCallback(() => {
      console.log('🏠 HomeScreen focused');
      return () => {
        console.log('👋 HomeScreen unfocused');
      };
    }, [])
  );

  try {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>کتابخانه </Text>

        <View style={styles.gridContainer}>
          <TouchableOpacity
            style={styles.gridButton}
            onPress={() => navigation.navigate('AddBook')}
          >
            <Icon name="plus" size={25} color="#FFFFFF" /> 
            <Text style={styles.buttonText}> افزودن کتاب جدید</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridButton}
            onPress={() => navigation.navigate('BookList')}
          >
            <Icon name="book" size={25} color="#FFFFFF" /> 
            <Text style={styles.buttonText}> مشاهده همه کتاب‌ها</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridButton}
            onPress={() => navigation.navigate('SearchByText')}
          >
            <Icon name="search" size={25} color="#FFFFFF" /> 
            <Text style={styles.buttonText}> جستجو بر اساس عنوان، نویسنده یا مکان</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridButton}
            onPress={() => navigation.navigate('SearchByLetter')}
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
          />
        </View>
      </ScrollView>
    );
  } catch (err) {
    console.error("🔴 Error rendering HomeScreen:", err);
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
    backgroundColor: '#F4F1EA', // Hardcoded: background
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 150,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#5E548E', // Hardcoded: primary
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  gridButton: {
    backgroundColor: '#C1BBD9', // Hardcoded: primaryDark
    paddingHorizontal: 20,
    borderRadius: 15,
    marginVertical: 12,
    width: '48%',
    alignItems: 'center',
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#7D6B91', // Hardcoded: shadowColor
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#3E3C64', // Hardcoded: textPrimary
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginLeft: 10,
  },
  footerText: {
    color: '#5E548E', // Hardcoded: primary
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
    color: '#D4AF37', // Hardcoded: accent (from theme)
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