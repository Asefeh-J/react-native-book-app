import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { updateBook } from '../database/Database';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function EditBookScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { book } = route.params;

  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [location, setLocation] = useState(book.location);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('خطا', 'عنوان کتاب نمی‌تواند خالی باشد.');
      return;
    }

    try {
      await updateBook(book.id, title, author, location);
      Alert.alert('موفق', 'اطلاعات کتاب با موفقیت به‌روزرسانی شد.', [
        { onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('❌ Error updating book:', error);
      Alert.alert('خطا', 'مشکلی در ذخیره تغییرات پیش آمد.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>ویرایش اطلاعات کتاب</Text>

        <Text style={styles.label}>عنوان:</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="عنوان کتاب"
        />

        <Text style={styles.label}>نویسنده:</Text>
        <TextInput
          style={styles.input}
          value={author}
          onChangeText={setAuthor}
          placeholder="نویسنده کتاب"
        />

        <Text style={styles.label}>محل:</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="محل نگهداری"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>ذخیره تغییرات</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F4F1EA',
  },
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7D6B91',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    marginBottom: 6,
    color: '#5E548E',
    textAlign: 'right',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#5E548E',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'right',
    color: '#3E3C64',
  },
  saveButton: {
    backgroundColor: '#5E548E',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
