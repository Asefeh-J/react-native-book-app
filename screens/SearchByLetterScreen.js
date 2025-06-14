import React, { useState, useCallback, useRef } from 'react';
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
  const [searching, setSearching] = useState(false);
  const isMountedRef = useRef(false); // ✅ Start as false

  useFocusEffect(
    useCallback(() => {
      console.log('🔠 SearchByLetterScreen focused');
      isMountedRef.current = true;

      const interactionTask = InteractionManager.runAfterInteractions(() => {
        if (isMountedRef.current) {
          setIsReady(true);
          console.log('✅ Interaction complete, ready to render');
        }
      });

      return () => {
        console.log('↩️ Leaving SearchByLetterScreen, clearing state');
        isMountedRef.current = false;
        setBooks([]);
        setSelectedLetter('');
        setIsReady(false);
        interactionTask.cancel();
      };
    }, [])
  );

  const handleSearch = useCallback(async (letter) => {
    if (selectedLetter === letter || searching || !isMountedRef.current) return;

    setSelectedLetter(letter);
    setBooks([]);
    setSearching(true);
    console.log(`🔍 Searching books by letter: "${letter}"`);

    try {
      const result = await searchByLetter(letter);
      if (!isMountedRef.current) {
        console.log('⚠️ Skipped setting state - screen is not mounted');
        return;
      }

      if (Array.isArray(result)) {
        console.log(`✅ Found ${result.length} books`);
        setBooks(result);
      } else {
        console.warn('⚠️ Unexpected result from searchByLetter:', result);
        setBooks([]);
      }
    } catch (err) {
      if (!isMountedRef.current) {
        console.log('⚠️ Skipped error alert - screen is not mounted');
        return;
      }
      console.error('❌ Search error:', err);
      Alert.alert('خطا', 'در جستجو مشکلی پیش آمد.');
      setBooks([]);
    } finally {
      if (isMountedRef.current) {
        setSearching(false);
        console.log('🔁 Search complete');
      }
    }
  }, [selectedLetter, searching]);

  const renderItem = useCallback(({ item }) => {
    if (!item?.id || !item?.title) return null;

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
  }, []);

  const renderSeparator = useCallback(() => (
    <View style={styles.starsRow}>
      {[...Array(5)].map((_, index) => (
        <Icon key={index} name="star" size={12} style={styles.starIcon} />
      ))}
    </View>
  ), []);

  if (!isReady) {
    console.log('⏳ Waiting for interaction to complete...');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5E548E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>جستجو بر اساس حروف الفبا</Text>

      <View style={styles.lettersContainer}>
        {alphabet.map((letter, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.letterButton,
              selectedLetter === letter && styles.selectedLetter,
            ]}
            onPress={() => handleSearch(letter)}
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

      {searching ? (
        <ActivityIndicator size="small" color="#5E548E" style={{ marginTop: 20 }} />
      ) : books.length === 0 && selectedLetter !== '' ? (
        <Text style={styles.noResultsText}>نتیجه‌ای یافت نشد.</Text>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item, index) => {
          const key = item?.id ? item.id.toString() : index.toString();
          console.log(`🔑 Rendering book item with key: ${key}`);
          return key;
             }}
          renderItem={renderItem}
          ItemSeparatorComponent={renderSeparator}
          contentContainerStyle={styles.flatListContentContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F1EA',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F4F1EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#7D6B91',
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
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 5,
  },
  icon: {
    marginLeft: 8,
    color: '#5E548E',
  },
  noResultsText: {
    fontSize: 18,
    color: '#A89BAE',
    textAlign: 'center',
    marginTop: 30,
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
