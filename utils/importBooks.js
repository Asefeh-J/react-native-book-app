// utils/importBooks.js
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as MediaLibrary from 'expo-media-library';
import { insertBook } from '../database/Database';
import { Alert, Platform } from 'react-native';

export async function importBooksFromJSON() {
  try {
    // ✅ Ask for storage permission on Android 13+
    if (Platform.OS === 'android') {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('اجازه داده نشد', 'برای انتخاب فایل نیاز به دسترسی دارید.');
        return;
      }
    }

    // ✅ Open file picker
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
    let jsonString = '';

    try {
      // 🧠 Try to read JSON directly
      jsonString = await FileSystem.readAsStringAsync(fileUri);
      console.log('✅ Direct read successful');
    } catch (err) {
      console.warn('⚠️ Direct read failed, trying content:// fallback:', err);

      // ⚙️ For Android "content://" URIs (e.g., Gmail/Downloads)
      if (Platform.OS === 'android' && fileUri.startsWith('content://')) {
        try {
          const base64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          const destUri = FileSystem.cacheDirectory + 'import_books.json';
          await FileSystem.writeAsStringAsync(destUri, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });
          jsonString = await FileSystem.readAsStringAsync(destUri);
          console.log('✅ Successfully copied and read content:// file');
        } catch (innerErr) {
          console.error('❌ Failed to handle content:// URI:', innerErr);
          Alert.alert('خطا', 'خواندن فایل انتخاب‌شده ممکن نیست.');
          return;
        }
      } else {
        Alert.alert('خطا', 'فایل انتخاب‌شده قابل خواندن نیست.');
        return;
      }
    }

    console.log('📖 JSON preview:', jsonString.substring(0, 200));

    // ✅ Parse and import
    const books = JSON.parse(jsonString);
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
