// utils/importBooks.js
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { insertBook } from '../database/Database';
import { Alert, Platform } from 'react-native';

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
    let fileUri = result.uri;

    // 📦 Fix: handle Gmail/Drive/Downloads "content://" URIs on Android
    if (Platform.OS === 'android' && fileUri.startsWith('content://')) {
      try {
        const base64 = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const destUri = FileSystem.cacheDirectory + 'import_books.json';
        await FileSystem.writeAsStringAsync(destUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
        fileUri = destUri;
        console.log('✅ Copied content:// file into sandbox:', destUri);
      } catch (err) {
        console.error('❌ Failed to read content:// URI:', err);
        Alert.alert('خطا', 'خواندن فایل انتخابی ممکن نیست.');
        return;
      }
    }

    // 🧠 Now read JSON content
    const jsonString = await FileSystem.readAsStringAsync(fileUri);
    console.log('📖 Raw JSON string (first 200 chars):', jsonString.substring(0, 200));

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
