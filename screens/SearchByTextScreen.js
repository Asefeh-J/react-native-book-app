import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  I18nManager,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  searchByTitle,
  searchByAuthor,
  searchByLocation,
  deleteBook,
} from '../database/Database';
import Icon from 'react-native-vector-icons/FontAwesome';
import { themes } from '../constants/theme';

I18nManager.forceRTL(true); // Force RTL layout

export default function SearchByTextScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);

  const searchHandler = async () => {
    if (searchQuery) {
      const byTitle = await searchByTitle(searchQuery);
      const byAuthor = await searchByAuthor(searchQuery);
      const byLocation = await searchByLocation(searchQuery);
      const all = [...byTitle, ...byAuthor, ...byLocation];
      const unique = Array.from(new Map(all.map((item) => [item.id, item])).values());
      setResults(unique);
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
            await deleteBook(id);
            setResults((prev) => prev.filter((book) => book.id !== id));
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
          <Icon name="book" size={16} color="#3B4D7C" style={styles.icon} />
          <Text style={styles.bookText}>{item.title}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id, item.title)}
        >
          <Icon name="trash" size={16} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.iconTextRow}>
        <Icon name="user" size={14} color="#3B4D7C" style={styles.icon} />
        <Text style={styles.bookSubText}>{item.author}</Text>
      </View>

      <View style={styles.iconTextRow}>
        <Icon name="map-marker" size={14} color="#3B4D7C" style={styles.icon} />
        <Text style={styles.bookSubText}>{item.location}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}> جستجو بین کتاب‌ها</Text>

      <TextInput
        style={styles.input}
        placeholder="عنوان، نویسنده یا محل را وارد کنید"
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.searchButton} onPress={searchHandler}>
        <Text style={styles.searchButtonText}>جستجو</Text>
      </TouchableOpacity>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          results.length === 0 && searchQuery !== '' ? (
            <Text style={styles.noResults}> نتیجه‌ای یافت نشد.</Text>
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

const currentTheme = themes.spiritualTheme;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: currentTheme.background,
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: currentTheme.shadowColor,
  },
  input: {
    height: 50,
    backgroundColor: currentTheme.background,
    borderRadius: 10,
    borderColor: currentTheme.primary,
    borderWidth: 1,
    paddingHorizontal: 15,
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'right',
    color: currentTheme.primaryDark,
  },
  searchButton: {
    backgroundColor: currentTheme.primary,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  bookItem: {
    backgroundColor: currentTheme.primaryDark,
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  titleRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  iconTextRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 5,
    gap: 8,
  },
  icon: {
    marginLeft: 8,
    color: currentTheme.primary,
  },
  bookText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: currentTheme.primary,
    textAlign: 'right',
    flexShrink: 1,
  },
  bookSubText: {
    fontSize: 18,
    color: currentTheme.textSecondary,
    textAlign: 'right',
    flexShrink: 1,
  },
  deleteButton: {
    backgroundColor: currentTheme.textSecondary,
    padding: 8,
    borderRadius: 8,
    marginLeft: 5,
  },
  noResults: {
    fontSize: 18,
    color: currentTheme.muted,
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
    color: currentTheme.accent,
  },
});
