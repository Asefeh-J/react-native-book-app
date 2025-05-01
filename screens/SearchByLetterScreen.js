import React, { useState } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { searchByLetter } from '../database/Database';
import { themes } from '../constants/theme';


I18nManager.forceRTL(true); 

const alphabet = [
  'ا', 'ب', 'پ', 'ت', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'ژ', 'س',
  'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و',
  'ه', 'ی',
];

export default function SearchByLetterScreen() {
  const [selectedLetter, setSelectedLetter] = useState('');
  const [books, setBooks] = useState([]);

  const searchByLetterFunc = async (letter) => {
    setSelectedLetter(letter);
    setBooks([]);
    try {
      const booksResult = await searchByLetter(letter);
      setBooks(booksResult);
    } catch (error) {
      console.log('Error searching by letter:', error);
      setBooks([]);
    }
  };

  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <View style={styles.row}>
        <Icon name="book" size={16} color="#3B4D7C" style={styles.icon} />
        <Text style={styles.bookText}>{item.title}</Text>
      </View>
      <View style={styles.row}>
        <Icon name="user" size={14} color="#3B4D7C" style={styles.icon} />
        <Text style={styles.bookSubText}>{item.author}</Text>
      </View>
      <View style={styles.row}>
        <Icon name="map-marker" size={14} color="#3B4D7C" style={styles.icon} />
        <Text style={styles.bookSubText}>{item.location}</Text>
      </View>
    </View>
  );
  
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>جستجو بر اساس حروف الفبا</Text>
      </View>

      <View style={styles.lettersContainer}>
        {alphabet.map((letter, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.letterButton,
              selectedLetter === letter && styles.selectedLetter,
            ]}
            onPress={() => searchByLetterFunc(letter)}
          >
            <Text
              style={[
                styles.letterText,
                selectedLetter === letter && styles.selectedLetterText,
              ]}
            >
              {letter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.resultsContainer}>
        {books.length === 0 && selectedLetter !== '' ? (
          <Text style={styles.noResultsText}>نتیجه‌ای برای "{selectedLetter}" یافت نشد.</Text>
        ) : (
          <FlatList
            data={books}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderBookItem}
            scrollEnabled={false}
            ItemSeparatorComponent={() => (
              <View style={styles.starsRow}>
                {[...Array(5)].map((_, index) => (
                  <Icon key={index} name="star" size={12} style={styles.starIcon} />
                ))}
              </View>
            )}
            
          />
        )}
      </View>
    </ScrollView>
  );
}
const currentTheme = themes.spiritualTheme; 
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: currentTheme.background, 
  },
  headerRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: currentTheme.shadowColor, 
    marginRight: 10,
    textAlign: 'center',
  },
  lettersContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  letterButton: {
    backgroundColor: currentTheme.primary, 
    paddingVertical: 10,
    paddingHorizontal: 14,
    margin: 5,
    borderRadius: 12,
    minWidth: 40,
    alignItems: 'center',
  },
  selectedLetter: {
    backgroundColor: currentTheme.primaryDark, 
  },
  letterText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    writingDirection: 'rtl',
  },
  selectedLetterText: {
    color: currentTheme.background, 
  },
  resultsContainer: {
    marginTop: 10,
  },
  bookItem: {
    backgroundColor: currentTheme.primaryDark, 
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  bookText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: currentTheme.primary, 
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 5,
  },
  bookSubText: {
    fontSize: 16,
    color: currentTheme.primaryDarktextSecondary, 
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 18,
    color: currentTheme.muted,
    marginTop: 30,
    writingDirection: 'rtl',
  },
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 5,
  },
  icon: {
    marginLeft: 8,
    color: currentTheme.primary, 
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  starIcon: {
    marginHorizontal: 2,
    color: currentTheme.accent,
  },
  
});
