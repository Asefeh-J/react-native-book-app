import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

export async function exportBooksToDownloads(bookArray) {
  const json = JSON.stringify(bookArray, null, 2);
  const fileUri = FileSystem.documentDirectory + 'books_export.json';

  try {
    // Write JSON to temporary file
    await FileSystem.writeAsStringAsync(fileUri, json);

    // Ask permission
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('اجازه دسترسی رد شد', 'برای ذخیره فایل نیاز به اجازه دارید.');
      return;
    }

    // Save to Downloads
    const asset = await MediaLibrary.createAssetAsync(fileUri);
    await MediaLibrary.createAlbumAsync('Download', asset, false);

    Alert.alert('✅ موفقیت', 'فایل JSON با موفقیت در پوشه Downloads ذخیره شد.');
  } catch (error) {
    console.error('❌ خطا در خروجی گرفتن:', error);
    Alert.alert('خطا', 'ذخیره فایل با مشکل مواجه شد.');
  }
}
