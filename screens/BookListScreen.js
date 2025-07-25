import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  InteractionManager,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchAllBooks } from '../database/Database';
import { useFocusEffect } from '@react-navigation/native';
import { importBooksFromJSON } from '../utils/importBooks';
import {exportBooksToDownloads} from '../utils/exportBooks';

export default function BookListScreen() {
  const [books, setBooks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const isActiveRef = useRef(false);
  const interactionRef = useRef(null);

  const loadBooks = useCallback(() => {
    setRefreshing(true);
    setLoading(true);

    fetchAllBooks()
      .then((allBooks) => {
        if (!isActiveRef.current) return;

        if (Array.isArray(allBooks)) {
          setBooks(allBooks);
        } else {
          setBooks([]);
        }
      })
      .catch((error) => {
        if (!isActiveRef.current) return;
        console.error('❌ Error loading books:', error);
        Alert.alert('خطا', 'در بارگذاری کتاب‌ها مشکلی پیش آمده است.');
        setBooks([]);
      })
      .finally(() => {
        if (!isActiveRef.current) return;
        setRefreshing(false);
        setLoading(false);
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      isActiveRef.current = true;

      interactionRef.current = InteractionManager.runAfterInteractions(() => {
        if (isActiveRef.current) {
          requestAnimationFrame(() => {
            setIsReady(true);
            loadBooks();
          });
        }
      });

      return () => {
        isActiveRef.current = false;
        interactionRef.current?.cancel?.();
        setIsReady(false);
        setBooks([]);
      };
    }, [loadBooks])
  );

  const renderBookItem = ({ item }) => {
    if (!item?.id) return null;

    return (
      <View style={styles.bookItem}>
        <View style={styles.titleRow}>
          <View style={styles.iconRowTitle}>
            <Icon name="book" size={18} color="#5E548E" style={styles.icon} />
            <Text style={styles.bookText}>{item.title || 'بدون عنوان'}</Text>
          </View>
        </View>
        <View style={styles.iconRow}>
          <Icon name="user" size={16} style={styles.icon} />
          <Text style={styles.bookSubText}>{item.author || 'ناشناخته'}</Text>
        </View>
        <View style={styles.iconRow}>
          <Icon name="map-marker" size={16} style={styles.icon} />
          <Text style={styles.bookSubText}>{item.location || 'نامشخص'}</Text>
        </View>
      </View>
    );
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

      <View style={{ marginBottom: 20 }}>
        <Text style={styles.totalCountText}>مجموع کتاب‌ها: {books.length}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.exportButton} onPress={exportBooksToDownloads}>
          <Text style={styles.buttonText}>ذخیره کتاب ها</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.importButton} onPress={importBooksFromJSON}>
          <Text style={styles.buttonText}>بازیابی کتاب ها</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#D4AF37" style={{ marginTop: 50 }} />
      ) : books.length === 0 ? (
        <Text style={styles.emptyText}>هیچ کتابی ثبت نشده است.</Text>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
          renderItem={renderBookItem}
          onRefresh={loadBooks}
          refreshing={refreshing}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
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
    justifyContent: 'flex-start',
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
  emptyText: {
    fontSize: 18,
    color: '#A89BAE',
    textAlign: 'center',
    marginTop: 50,
  },
  totalCountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3E3C64',
    textAlign: 'right',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  exportButton: {
    backgroundColor: '#5E548E',
    padding: 10,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  importButton: {
    backgroundColor: '#5E548E',
    padding: 10,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
