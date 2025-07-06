import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  InteractionManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchAllBooks, deleteBook } from '../database/Database';
import { useFocusEffect } from '@react-navigation/native';

export default function BookListScreen() {
  const [books, setBooks] = useState([]);
  const [locationCounts, setLocationCounts] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const isActiveRef = useRef(false);
  const interactionRef = useRef(null);

  const loadBooks = useCallback(() => {
    console.log('🔄 BookListScreen: Starting to load books...');
    setRefreshing(true);
    setLoading(true);

    fetchAllBooks()
      .then((allBooks) => {
        if (!isActiveRef.current) return;

        console.log('📦 BookListScreen: Raw book data:', JSON.stringify(allBooks));

        if (Array.isArray(allBooks)) {
          console.log(`📚 BookListScreen: Fetched ${allBooks.length} books`);
          setBooks(allBooks);

          const counts = {};
          allBooks.forEach((book, i) => {
            const loc = String(book.location || 'نامشخص');
            counts[loc] = (counts[loc] || 0) + 1;

            if (!book.id || !book.title) {
              console.warn(`⚠️ BookListScreen: Book at index ${i} is missing id or title`, book);
            }
          });

          setLocationCounts(counts);
        } else {
          console.warn('⚠️ BookListScreen: fetchAllBooks did not return an array');
          setBooks([]);
          setLocationCounts({});
        }
      })
      .catch((error) => {
        if (!isActiveRef.current) return;
        console.error('❌ BookListScreen: Error loading books:', error);
        Alert.alert('خطا', 'در بارگذاری کتاب‌ها مشکلی پیش آمده است.');
        setBooks([]);
        setLocationCounts({});
      })
      .finally(() => {
        if (!isActiveRef.current) return;
        setRefreshing(false);
        setLoading(false);
        console.log('✅ BookListScreen: Finished loading books');
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log('📚 BookListScreen: focused');
      isActiveRef.current = true;

      console.log('⏳ BookListScreen: Waiting for interaction to finish...');
      interactionRef.current = InteractionManager.runAfterInteractions(() => {
        if (isActiveRef.current) {
          requestAnimationFrame(() => {
            console.log('✅ BookListScreen: Interaction complete');
            setIsReady(true);
            loadBooks();
          });
        }
      });

      return () => {
        console.log('👋 BookListScreen: unfocused, cleaning up...');
        isActiveRef.current = false;
        interactionRef.current?.cancel?.();
        setIsReady(false);
        setBooks([]);
        setLocationCounts({});
      };
    }, [loadBooks])
  );

  const handleDelete = (id, title) => {
    console.log(`🗑 BookListScreen: Attempting to delete book: ${title} (ID: ${id})`);
    Alert.alert(
      'حذف کتاب',
      `آیا از حذف "${title}" مطمئن هستید؟`,
      [
        { text: 'انصراف', style: 'cancel' },
        {
          text: 'حذف',
          onPress: () => {
            deleteBook(id)
              .then(() => {
                if (!isActiveRef.current) return;
                console.log(`✅ BookListScreen: Book deleted: ${title}`);
                loadBooks();
              })
              .catch((error) => {
                console.error('❌ BookListScreen: Error deleting book:', error);
                Alert.alert('خطا', 'مشکلی در حذف کتاب پیش آمد.');
              });
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderBookItem = ({ item }) => {
    if (!item?.id) {
      console.warn('⚠️ BookListScreen: Skipping book without valid ID:', item);
      return null;
    }

    try {
      return (
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
            <Icon name="user" size={16} style={styles.icon} />
            <Text style={styles.bookSubText}>{item.author}</Text>
          </View>
          <View style={styles.iconRow}>
            <Icon name="map-marker" size={16} style={styles.icon} />
            <Text style={styles.bookSubText}>{item.location}</Text>
          </View>
        </View>
      );
    } catch (err) {
      console.error('❌ Error rendering book item:', err);
      return null;
    }
  };

  if (!isReady) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#D4AF37" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>لیست کتاب‌ها</Text>
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
            keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
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
    backgroundColor: '#F4F1EA',
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F1EA',
  },
  headerRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#7D6B91',
  },
  listContainer: {
    paddingBottom: 20,
  },
  bookItem: {
    backgroundColor: '#C1BBD9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#7D6B91',
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
    color: '#5E548E',
  },
  bookText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3E3C64',
    textAlign: 'right',
  },
  bookSubText: {
    fontSize: 16,
    color: '#6C5B7B',
    textAlign: 'right',
  },
  deleteButton: {
    backgroundColor: '#6C5B7B',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  emptyText: {
    fontSize: 18,
    color: '#A89BAE',
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
    color: '#D4AF37',
  },
  locationCountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3E3C64',
    textAlign: 'right',
    marginBottom: 4,
  },
});
