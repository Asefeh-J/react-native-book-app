import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Keyboard, // Added Keyboard import for dismissing keyboard
} from 'react-native';
import {
  searchByTitle,
  searchByAuthor,
  searchByLocation,
  deleteBook,
} from '../database/Database';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function SearchByTextScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);

  const searchHandler = async () => {
    Keyboard.dismiss(); // Dismiss keyboard when search button is pressed

    if (!searchQuery.trim()) { // Use .trim() to handle empty spaces
      setResults([]); // Clear results if search query is empty
      Alert.alert('توجه', 'لطفاً متن جستجو را وارد کنید.');
      return;
    }

    try {
      const byTitle = await searchByTitle(searchQuery);
      const byAuthor = await searchByAuthor(searchQuery);
      const byLocation = await searchByLocation(searchQuery);

      // Combine and get unique results
      const all = [...byTitle, ...byAuthor, ...byLocation];
      const unique = Array.from(new Map(all.map((item) => [item.id, item])).values());
      setResults(unique);
    } catch (error) {
      console.error('Error during search:', error);
      Alert.alert('خطا', 'مشکلی در جستجو پیش آمد.');
      setResults([]);
    }
  };

  const handleDelete = (id, title) => {
    Alert.alert(
      'حذف کتاب',
      `آیا از حذف "${title}" مطمئن هستید؟`,
      [
        { text: 'انصراف', style: 'cancel' },
        {
          text: 'حذف',
          onPress: async () => {
            try {
              await deleteBook(id);
              // Update results immediately after deletion
              setResults((prev) => prev.filter((book) => book.id !== id));
            } catch (error) {
              console.error('Error deleting book:', error);
              Alert.alert('خطا', 'مشکلی در حذف کتاب پیش آمد.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.bookItem}>
      <View style={styles.titleRow}>
        <View style={styles.titleContent}>
          <Icon name="book" size={16} color="#5E548E" style={styles.icon} />
          <Text style={styles.bookText}>{item.title}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id, item.title)}
        >
          <Icon name="trash" size={16} color="#FFFFFF" /> 
        </TouchableOpacity>
      </View>

      <View style={styles.iconTextRow}>
        <Icon name="user" size={14} color="#5E548E" style={styles.icon} /> 
        <Text style={styles.bookSubText}>{item.author}</Text>
      </View>

      <View style={styles.iconTextRow}>
        <Icon name="map-marker" size={14} color="#5E548E" style={styles.icon} /> 
        <Text style={styles.bookSubText}>{item.location}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>جستجو بین کتاب‌ها</Text>

      <TextInput
        style={styles.input}
        placeholder="عنوان، نویسنده یا محل را وارد کنید"
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#A89BAE" // Hardcoded: textMuted (good for placeholders)
        onSubmitEditing={searchHandler} // Allows searching by pressing "Enter" on keyboard
        returnKeyType="search" // Changes keyboard return key to "Search"
      />

      <TouchableOpacity style={styles.searchButton} onPress={searchHandler}>
        <Text style={styles.searchButtonText}>جستجو </Text>
      </TouchableOpacity>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          results.length === 0 && searchQuery !== '' ? ( // Only show "no results" if query exists and no results
            <Text style={styles.noResults}>نتیجه‌ای یافت نشد.</Text>
          ) : null
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View style={styles.starsRow}>
            {[...Array(5)].map((_, index) => (
              <Icon key={index} name="star" size={12} style={styles.starIcon} />
            ))}
          </View>
        )}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F1EA', // Hardcoded: background
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#7D6B91', // Hardcoded: shadowColor (used for header text)
  },
  input: {
    height: 50,
    backgroundColor: '#FFFFFF', // Hardcoded: cardBackground (or white)
    borderRadius: 10,
    borderColor: '#5E548E', // Hardcoded: primary
    borderWidth: 1,
    paddingHorizontal: 15,
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'right',
    color: '#3E3C64', // Hardcoded: textPrimary (for input text)
  },
  searchButton: {
    backgroundColor: '#5E548E', // Hardcoded: primary
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#7D6B91', // Hardcoded: shadowColor
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchButtonText: {
    color: '#FFFFFF', // Hardcoded: white
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  bookItem: {
    backgroundColor: '#C1BBD9', // Hardcoded: primaryDark
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#7D6B91', // Hardcoded: shadowColor
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  titleRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8, // Using gap for spacing
  },
  iconTextRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 5,
    gap: 8, // Using gap for spacing
  },
  icon: {
    marginLeft: 8, // Adjusted to match 'gap' where appropriate
    color: '#5E548E', // Hardcoded: primary
  },
  bookText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3E3C64', // Hardcoded: textPrimary
    textAlign: 'right',
    flexShrink: 1,
  },
  bookSubText: {
    fontSize: 18,
    color: '#6C5B7B', // Hardcoded: textSecondary
    textAlign: 'right',
    flexShrink: 1,
  },
  deleteButton: {
    backgroundColor: '#6C5B7B', // Hardcoded: textSecondary
    padding: 8,
    borderRadius: 8,
    marginLeft: 5,
  },
  noResults: {
    fontSize: 18,
    color: '#A89BAE', // Hardcoded: textMuted
    textAlign: 'center',
    marginTop: 20,
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