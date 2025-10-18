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

    // 📦 Copy file into app sandbox so we can safely read it
    const destUri = FileSystem.cacheDirectory + 'import_books.json';
    try {
      await FileSystem.copyAsync({ from: fileUri, to: destUri });
      console.log('✅ File copied to sandbox:', destUri);
    } catch (err) {
      console.error('❌ Copy failed (trying content:// fallback):', err);
      if (Platform.OS === 'android' && fileUri.startsWith('content://')) {
        // Fallback: use base64 read/write
        const base64 = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await FileSystem.writeAsStringAsync(destUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
        console.log('✅ Copied via base64 fallback:', destUri);
      } else {
        Alert.alert('خطا', 'فایل انتخابی قابل خواندن نیست.');
        return;
      }
    }

    // 🧠 Read JSON from the safe local copy
    const jsonString = await FileSystem.readAsStringAsync(destUri);
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
