import React, { useState } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert, // Added Alert for better error handling
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { searchByLetter } from '../database/Database';



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
    setBooks([]); // Clear previous results immediately
    try {
      const booksResult = await searchByLetter(letter);
      // Ensure booksResult is an array to prevent FlatList errors
      if (Array.isArray(booksResult)) {
        setBooks(booksResult);
      } else {
        console.warn('searchByLetter did not return an array, got:', booksResult);
        setBooks([]); // Set to empty array if unexpected data
      }
    } catch (error) {
      console.error('Error searching by letter:', error);
      Alert.alert('خطا', 'مشکلی در جستجو بر اساس حرف پیش آمد.');
      setBooks([]);
    }
  };

  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <View style={styles.row}>
        <Icon name="book" size={16} color="#5E548E" style={styles.icon} />
        <Text style={styles.bookText}>{item.title}</Text>
      </View>
      <View style={styles.row}>
        <Icon name="user" size={14} color="#5E548E" style={styles.icon} /> 
        <Text style={styles.bookSubText}>{item.author}</Text>
      </View>
      <View style={styles.row}>
        <Icon name="map-marker" size={14} color="#5E548E" style={styles.icon} /> 
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
            scrollEnabled={false} // Prevents FlatList from having its own scroll
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
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F4F1EA', // Hardcoded: background
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
    color: '#7D6B91', // Hardcoded: shadowColor (used for title text)
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
    backgroundColor: '#5E548E', // Hardcoded: primary
    paddingVertical: 10,
    paddingHorizontal: 14,
    margin: 5,
    borderRadius: 12,
    minWidth: 40,
    alignItems: 'center',
    shadowColor: '#7D6B91', // Hardcoded: shadowColor
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedLetter: {
    backgroundColor: '#C1BBD9', // Hardcoded: primaryDark
  },
  letterText: {
    fontSize: 18,
    color: '#FFFFFF', // Hardcoded: white
    fontWeight: 'bold',
    writingDirection: 'rtl',
  },
  selectedLetterText: {
    color: '#F4F1EA', // Hardcoded: background
  },
  resultsContainer: {
    marginTop: 10,
  },
  bookItem: {
    backgroundColor: '#C1BBD9', // Hardcoded: primaryDark
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#7D6B91', // Hardcoded: shadowColor
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bookText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3E3C64', // Hardcoded: textPrimary
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 5,
    flexShrink: 1, // Added flexShrink to prevent overflow
  },
  bookSubText: {
    fontSize: 16,
    color: '#6C5B7B', // Hardcoded: textSecondary (corrected as spiritualTheme does not have primaryDarktextSecondary)
    textAlign: 'right',
    writingDirection: 'rtl',
    flexShrink: 1, // Added flexShrink to prevent overflow
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#A89BAE', // Hardcoded: textMuted
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
    color: '#5E548E', // Hardcoded: primary
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  starIcon: {
    marginHorizontal: 2,
    color: '#D4AF37', // Hardcoded: accent
  },
});