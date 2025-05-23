import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { insertBook } from '../database/Database';

export default function AddBookScreen() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddBook = async () => {
    if (!title || !author || !location) {
      setSuccessMessage('لطفاً همه فیلدها را پر کنید.');
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }

    try {
      await insertBook(title, author, location);
      setSuccessMessage('کتاب با موفقیت اضافه شد!');
      setTitle('');
      setAuthor('');
      setLocation('');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("Error adding book:", error);
      setSuccessMessage('مشکلی در اضافه کردن کتاب وجود داشت.');
      Alert.alert('خطا', 'مشکلی در اضافه کردن کتاب وجود داشت.');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <Text style={styles.header}>افزودن کتاب جدید</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="عنوان کتاب"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#A89BAE"
        />

        <TextInput
          style={styles.input}
          placeholder="نام نویسنده"
          value={author}
          onChangeText={setAuthor}
          placeholderTextColor="#A89BAE"
        />

        <TextInput
          style={styles.input}
          placeholder="مکان کتاب"
          value={location}
          onChangeText={setLocation}
          placeholderTextColor="#A89BAE"
        />

        <TouchableOpacity style={styles.button} onPress={handleAddBook}>
          <Text style={styles.buttonText}>ذخیره</Text>
        </TouchableOpacity>

        {successMessage !== '' && (
          <Text style={styles.successMessage}>{successMessage}</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F4F1EA',
  },
  headerContainer: {
    marginBottom: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#7D6B91',
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#5E548E',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 18,
    textAlign: 'right',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    color: '#3E3C64',
  },
  button: {
    backgroundColor: '#5E548E',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#7D6B91',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  successMessage: {
    marginTop: 20,
    // --- CHANGE IS HERE ---
    color: '#A89BAE', // Hardcoded: textMuted
    // --- END CHANGE ---
    fontSize: 18,
    textAlign: 'center',
  },
});