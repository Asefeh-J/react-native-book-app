import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

export async function exportBooksToDownloads(bookArray) {
  const json = JSON.stringify(bookArray, null, 2);
  const fileUri = FileSystem.documentDirectory + 'books_export.json';

  try {
    // Write JSON to app sandbox (safe location)
    await FileSystem.writeAsStringAsync(fileUri, json);
    console.log('✅ فایل با موفقیت در فضای امن برنامه ذخیره شد:', fileUri);

    // Try to share the file with user
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      Alert.alert('✅ موفقیت', 'فایل JSON در فضای برنامه ذخیره شد اما اشتراک‌گذاری در این دستگاه پشتیبانی نمی‌شود.');
    }
  } catch (error) {
    console.error('❌ خطا در خروجی گرفتن:', error);
    Alert.alert('خطا', 'در ذخیره یا اشتراک‌گذاری فایل مشکلی پیش آمد.');
  }
}
