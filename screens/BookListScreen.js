import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  I18nManager,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchAllBooks, deleteBook } from '../database/Database';
import { themes } from '../constants/theme';

I18nManager.forceRTL(true); 

export default function BookListScreen() {
  const [books, setBooks] = useState([]);
  const [locationCounts, setLocationCounts] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadBooks = async () => {
    setRefreshing(true);
    const allBooks = await fetchAllBooks();
    setBooks(allBooks);
    setRefreshing(false);
    setLoading(false);

    // Count books by location
    const counts = {};
    allBooks.forEach(book => {
      const loc = book.location || 'نامشخص';
      counts[loc] = (counts[loc] || 0) + 1;
    });
    setLocationCounts(counts);
  };

  useEffect(() => {
    loadBooks();
  }, []);

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
            loadBooks();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <View style={styles.titleRow}>
        <View style={styles.iconRowTitle}>
          <Icon name="book" size={18} color="#3B4D7C" style={styles.icon} />
          <Text style={styles.bookText}>{item.title}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id, item.title)}
        >
          <Icon name="trash" size={16} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.iconRow}>
        <Icon name="user" size={16} color="#666" style={styles.icon} />
        <Text style={styles.bookSubText}>{item.author}</Text>
      </View>

      <View style={styles.iconRow}>
        <Icon name="map-marker" size={16} color="#666" style={styles.icon} />
        <Text style={styles.bookSubText}>{item.location}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}> لیست کتاب‌ها</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#9C7C48" style={{ marginTop: 50 }} />
      ) : books.length === 0 ? (
        <Text style={styles.emptyText}>هیچ کتابی ثبت نشده است.</Text>
      ) : (
        <>
          <View style={{ marginBottom: 20 }}>
            {Object.entries(locationCounts).map(([location, count]) => (
              <Text key={location} style={styles.locationCountText}>
                {location}: {count} کتاب
              </Text>
            ))}
          </View>
          <FlatList
            data={books}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderBookItem}
            onRefresh={loadBooks}
            refreshing={refreshing}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.listContainer}
            ItemSeparatorComponent={() => (
              <View style={styles.starsRow}>
                {[...Array(5)].map((_, index) => (
                  <Icon key={index} name="star" size={12} style={styles.starIcon} />
                ))}
              </View>
            )}
          />
        </>
      )}
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
  headerRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: currentTheme.shadowColor,
    marginRight: 10,
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
  iconRowTitle: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flexShrink: 1,
    marginEnd: 10,
  },
  iconRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 5,
  },
  icon: {
    marginLeft: 6,
    color: currentTheme.primary,
  },
  bookText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: currentTheme.textPrimary,
    textAlign: 'right',
  },
  deleteButton: {
    backgroundColor: currentTheme.textSecondary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  bookSubText: {
    fontSize: 16,
    color: currentTheme.textSecondary,
    textAlign: 'right',
  },
  emptyText: {
    fontSize: 18,
    color: currentTheme.muted,
    textAlign: 'center',
    marginTop: 50,
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
  locationCountText: {
    fontSize: 16,
    fontWeight: '600',
    color: currentTheme.textPrimary,
    textAlign: 'right',
    marginBottom: 4,
  },
});
