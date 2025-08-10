import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

export async function exportBooksToDownloads(bookArray) {
  console.log('📦 exportBooksToDownloads started');

  if (!Array.isArray(bookArray) || bookArray.length === 0) {
    Alert.alert('ℹ️ اطلاعات خالی', 'هیچ کتابی برای خروجی گرفتن وجود ندارد.');
    return;
  }

  const json = JSON.stringify(bookArray, null, 2);
  const fileUri = FileSystem.documentDirectory + 'books_export.json'; // private app folder

  try {
    // Write file to app sandbox
    await FileSystem.writeAsStringAsync(fileUri, json);
    console.log('✅ فایل ذخیره شد در:', fileUri);

    // If sharing is available, open share sheet
    if (await Sharing.isAvailableAsync()) {
      console.log('📤 شروع اشتراک‌گذاری...');
      await Sharing.shareAsync(fileUri);
    } else {
      console.log('⚠️ Sharing API not available');
      Alert.alert(
        '✅ موفقیت',
        'فایل JSON در فضای داخلی برنامه ذخیره شد. می‌توانید هنگام انتقال داده، آن را انتخاب کنید.'
      );
    }
  } catch (error) {
    console.error('❌ خطا در خروجی گرفتن:', error);
    Alert.alert('خطا', 'در ذخیره یا اشتراک‌گذاری فایل مشکلی پیش آمد.');
  }
}
