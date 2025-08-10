// utils/importBooks.js
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { insertBook } from '../database/Database';
import { Alert } from 'react-native';

export async function importBooksFromJSON() {
  try {
    // Let user pick the .json file
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    if (result.type === 'success') {
      console.log('📂 Selected file URI:', result.uri);

      // Always copy file to app's safe directory
      const destUri = FileSystem.documentDirectory + 'books_export.json';
      await FileSystem.copyAsync({ from: result.uri, to: destUri });

      // Read from the copied file
      const jsonString = await FileSystem.readAsStringAsync(destUri);
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
