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

    // Fix: handle Gmail/Drive "content://" URIs properly
    if (Platform.OS === 'android' && fileUri.startsWith('content://')) {
      const destUri = FileSystem.cacheDirectory + 'import_books.json';
      await FileSystem.StorageAccessFramework.readAsStringAsync(fileUri)
        .then(async (content) => {
          await FileSystem.writeAsStringAsync(destUri, content);
        })
        .catch((err) => {
          console.error('❌ SAF read failed:', err);
          Alert.alert('خطا', 'خواندن فایل از حافظه ناموفق بود.');
          return;
        });
      fileUri = destUri;
    }

    // Read JSON
    const jsonString = await FileSystem.readAsStringAsync(fileUri);
    const books = JSON.parse(jsonString);
    console.log(`📚 Found ${books.length} books in file`);

    if (!Array.isArray(books) || books.length === 0) {
      Alert.alert('⚠️ هشدار', 'فایل انتخاب‌شده هیچ کتابی ندارد.');
      return;
    }

    // Ask for confirmation before importing
    Alert.alert(
      'تأیید انتقال',
      `آیا مایلید ${books.length} کتاب را وارد کنید؟`,
      [
        { text: 'لغو', style: 'cancel', onPress: () => console.log('🚫 Import cancelled') },
        {
          text: 'بله',
          onPress: async () => {
            let imported = 0;
            for (const book of books) {
              if (book.title) {
                await insertBook(book.title, book.author || '', book.location || '');
                imported++;
              }
            }
            Alert.alert('✅ موفقیت', `${imported} کتاب با موفقیت وارد شد.`);
          },
        },
      ]
    );
  } catch (error) {
    console.error('❌ Import Error:', error);
    Alert.alert('خطا', 'در وارد کردن فایل مشکلی پیش آمد.');
  }
}
