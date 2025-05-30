import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import { InteractionManager } from 'react-native';
import { searchByLetter } from '../database/Database';

const alphabet = [
  'ا', 'ب', 'پ', 'ت', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'ژ', 'س',
  'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و',
  'ه', 'ی',
];

export default function SearchByLetterScreen() {
  const [selectedLetter, setSelectedLetter] = useState('');
  const [books, setBooks] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useFocusEffect(
    useCallback(() => {
      console.log('🔠 SearchByLetterScreen focused');

      const interactionTask = InteractionManager.runAfterInteractions(() => {
        setIsReady(true);
      });

      return () => {
        console.log('↩️ Leaving SearchByLetterScreen, clearing state');
        setBooks([]);
        setSelectedLetter('');
        setIsReady(false);
        interactionTask.cancel();
      };
    }, [])
  );

  const searchByLetterFunc = async (letter) => {
    setSelectedLetter(letter);
    setBooks([]);
    try {
      const booksResult = await searchByLetter(letter);
      if (Array.isArray(booksResult)) {
        setBooks(booksResult);
      } else {
        console.warn('⚠️ searchByLetter did not return an array:', booksResult);
        setBooks([]);
      }
    } catch (error) {
      console.error('❌ Error searching by letter:', error);
      Alert.alert('خطا', 'مشکلی در جستجو بر اساس حرف پیش آمد.');
      setBooks([]);
    }
  };

  const renderBookItem = ({ item }) => {
    if (!item?.id || !item?.title) {
      console.warn('⚠️ Invalid book item:', item);
      return null;
    }

    return (
      <View style={styles.bookItem}>
        <View style={styles.row}>
          <Icon name="book" size={16} style={styles.icon} />
          <Text style={styles.bookText}>{item.title}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="user" size={14} style={styles.icon} />
          <Text style={styles.bookSubText}>{item.author}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="map-marker" size={14} style={styles.icon} />
          <Text style={styles.bookSubText}>{item.location}</Text>
        </View>
      </View>
    );
  };

  if (!isReady) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#5E548E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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

      {books.length === 0 && selectedLetter !== '' ? (
        <Text style={styles.noResultsText}>
          نتیجه‌ای برای "{selectedLetter}" یافت نشد.
        </Text>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item, index) =>
            item?.id ? item.id.toString() : index.toString()
          }
          renderItem={renderBookItem}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.flatListContentContainer}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#F4F1EA',
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
    color: '#7D6B91',
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
    backgroundColor: '#5E548E',
    paddingVertical: 10,
    paddingHorizontal: 14,
    margin: 5,
    borderRadius: 12,
    minWidth: 40,
    alignItems: 'center',
    shadowColor: '#7D6B91',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedLetter: {
    backgroundColor: '#C1BBD9',
  },
  letterText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    writingDirection: 'rtl',
  },
  selectedLetterText: {
    color: '#F4F1EA',
  },
  flatListContentContainer: {
    paddingBottom: 20,
  },
  bookItem: {
    backgroundColor: '#C1BBD9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#7D6B91',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bookText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3E3C64',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 5,
    flexShrink: 1,
  },
  bookSubText: {
    fontSize: 16,
    color: '#6C5B7B',
    textAlign: 'right',
    writingDirection: 'rtl',
    flexShrink: 1,
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#A89BAE',
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
    color: '#5E548E',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  starIcon: {
    marginHorizontal: 2,
    color: '#D4AF37',
  },
});
