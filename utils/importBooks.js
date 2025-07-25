// utils/importBooks.js
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as MediaLibrary from 'expo-media-library';
import { fetchAllBooks, insertBook } from '../database/Database';
import { Alert } from 'react-native';

export async function importBooksFromJSON() {
  try {
    // Let user pick the .json file
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    if (result.type === 'success') {
      const jsonString = await FileSystem.readAsStringAsync(result.uri);
      const books = JSON.parse(jsonString);

      let imported = 0;

      for (const book of books) {
        if (book.title) {
          await insertBook(book.title, book.author || '', book.location || '');
          imported++;
        }
      }

      Alert.alert('✅ موفقیت', `${imported} کتاب با موفقیت وارد شد.`);
    }
  } catch (error) {
    console.error('❌ Import Error:', error);
    Alert.alert('خطا', 'در وارد کردن فایل مشکلی پیش آمد.');
  }
}
