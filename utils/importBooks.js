// utils/importBooks.js
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { insertBook } from '../database/Database';
import { Alert } from 'react-native';

export async function importBooksFromJSON() {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    if (result.type !== 'success') {
      console.log('❌ No file selected');
      return;
    }

    console.log('📂 Selected file URI:', result.uri);

    // Always copy the picked file into app sandbox
    const destUri = FileSystem.cacheDirectory + 'import_books.json';
    await FileSystem.copyAsync({
      from: result.uri,
      to: destUri,
    });

    // Now read from sandbox
    const jsonString = await FileSystem.readAsStringAsync(destUri);
    console.log('📖 Raw JSON string:', jsonString.substring(0, 200)); // debug first 200 chars

    const books = JSON.parse(jsonString);
    console.log(`📚 Found ${books.length} books in file`);

    if (!Array.isArray(books) || books.length === 0) {
      Alert.alert('⚠️ هشدار', 'فایل انتخاب‌شده هیچ کتابی ندارد.');
      return;
    }

    let imported = 0;
    for (const book of books) {
      if (book.title) {
        await insertBook(book.title, book.author || '', book.location || '');
        imported++;
      }
    }

    Alert.alert('✅ موفقیت', `${imported} کتاب با موفقیت وارد شد.`);
  } catch (error) {
    console.error('❌ Import Error:', error);
    Alert.alert('خطا', 'در وارد کردن فایل مشکلی پیش آمد.');
  }
}
