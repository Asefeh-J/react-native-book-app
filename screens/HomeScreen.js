import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, I18nManager, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Image } from 'react-native';
import { themes } from '../constants/theme';

I18nManager.forceRTL(true);

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>کتابخانه من</Text>

      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.gridButton} onPress={() => navigation.navigate('AddBook')}>
          <Icon name="plus" size={25} color="white" />
          <Text style={styles.buttonText}> افزودن کتاب جدید</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridButton} onPress={() => navigation.navigate('BookList')}>
          <Icon name="book" size={25} color="white" />
          <Text style={styles.buttonText}> مشاهده همه کتاب‌ها</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridButton} onPress={() => navigation.navigate('SearchByText')}>
          <Icon name="search" size={25} color="white" />
          <Text style={styles.buttonText}> جستجو بر اساس عنوان، نویسنده یا مکان</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridButton} onPress={() => navigation.navigate('SearchByLetter')}>
          <Icon name="search" size={25} color="white" />
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

      {/* Image at the bottom of the page */}
      <View style={styles.footerImageWrapper}>
        <ImageBackground
          source={require('../assets/images/texture9.webp')}
          style={styles.footerImage}
          resizeMode="cover"
        />
      </View>

    </ScrollView>
  );
}
const currentTheme = themes.spiritualTheme; // Switch between themes as needed
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: currentTheme.background, 
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 150, // Add space for the image at the bottom
  },
  title: {
    fontSize: 32,
    fontFamily: 'Playfair Display',
    fontWeight: 'bold',
    marginBottom: 30,
    color: currentTheme.primary, 
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  gridButton: {
    backgroundColor: currentTheme.primaryDark, 
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
    color: currentTheme.textPrimary, 
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: currentTheme.textMuted, 
    marginVertical: 10,
    width: '80%',
  },
  footerText: {
    color: currentTheme.primary, 
    fontSize: 16,
    marginTop: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 200, 
    marginTop: 20, 
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
