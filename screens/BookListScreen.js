import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchAllBooks, deleteBook } from '../database/Database';
import { useFocusEffect } from '@react-navigation/native';

export default function BookListScreen() {
  const [books, setBooks] = useState([]);
  const [locationCounts, setLocationCounts] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);


  const loadBooks = async () => {
    try {
      setRefreshing(true);
      const allBooks = await fetchAllBooks();

      if (!Array.isArray(allBooks)) {
        console.warn('fetchAllBooks did not return an array, got:', allBooks);
        setBooks([]);
        setLocationCounts({});
        return;
      }

      setBooks(allBooks);

      // Count books by location
      const counts = {};
      allBooks.forEach(book => {
        const loc = String(book.location || 'نامشخص');
        counts[loc] = (counts[loc] || 0) + 1;
      });
      setLocationCounts(counts);
    } catch (error) {
      console.error('Error loading books:', error);
      Alert.alert('خطا', 'در بارگذاری کتاب‌ها مشکلی پیش آمده است.');
      setBooks([]);
      setLocationCounts({});
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBooks();
      return () => {
      };
    }, [])
  );

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
              loadBooks(); // Reload books after deletion
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

  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <View style={styles.titleRow}>
        <View style={styles.iconRowTitle}>
          <Icon name="book" size={18} color="#5E548E" style={styles.icon} />
          <Text style={styles.bookText}>{item.title}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id, item.title)}
        >
          <Icon name="trash" size={16} color="#FFFFFF" /> 
        </TouchableOpacity>
      </View>

      <View style={styles.iconRow}>
        <Icon name="user" size={16} color="#5E548E" style={styles.icon} />
        <Text style={styles.bookSubText}>{item.author}</Text>
      </View>

      <View style={styles.iconRow}>
        <Icon name="map-marker" size={16} color="#5E548E" style={styles.icon} />
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
        <ActivityIndicator size="large" color="#D4AF37" style={{ marginTop: 50 }} />
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F1EA', // Hardcoded: background
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
    color: '#7D6B91', // Hardcoded: shadowColor (used for header text)
    marginRight: 10,
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
    color: '#5E548E', // Hardcoded: primary (used for icons)
  },
  bookText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3E3C64', // Hardcoded: textPrimary
    textAlign: 'right',
  },
  deleteButton: {
    backgroundColor: '#6C5B7B', // Hardcoded: textSecondary
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  bookSubText: {
    fontSize: 16,
    color: '#6C5B7B', // Hardcoded: textSecondary
    textAlign: 'right',
  },
  emptyText: {
    fontSize: 18,
    color: '#A89BAE', // Hardcoded: textMuted
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
    color: '#D4AF37', // Hardcoded: accent
  },
  locationCountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3E3C64', // Hardcoded: textPrimary
    textAlign: 'right',
    marginBottom: 4,
  },
});