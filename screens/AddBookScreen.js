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
} from 'react-native';
import { insertBook } from '../database/Database';
import { themes } from '../constants/theme';

export default function AddBookScreen() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const theme = themes?.spiritualTheme || {
    background: '#fff',
    primary: '#333',
    shadowColor: '#444',
    white: '#fff',
    success: 'green',
  };

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
      console.error(error);
      setSuccessMessage('مشکلی در اضافه کردن کتاب وجود داشت.');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles(theme).container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles(theme).headerContainer}>
          <Text style={styles(theme).header}>افزودن کتاب جدید</Text>
        </View>

        <TextInput
          style={styles(theme).input}
          placeholder="عنوان کتاب"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles(theme).input}
          placeholder="نام نویسنده"
          value={author}
          onChangeText={setAuthor}
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles(theme).input}
          placeholder="مکان کتاب"
          value={location}
          onChangeText={setLocation}
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles(theme).button} onPress={handleAddBook}>
          <Text style={styles(theme).buttonText}>ذخیره</Text>
        </TouchableOpacity>

        {successMessage !== '' && (
          <Text style={styles(theme).successMessage}>{successMessage}</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: theme.background,
    },
    headerContainer: {
      marginBottom: 20,
    },
    header: {
      fontSize: 26,
      fontWeight: 'bold',
      textAlign: 'center',
      color: theme.shadowColor,
    },
    input: {
      width: '80%',
      height: 50,
      borderColor: theme.primary,
      borderWidth: 1,
      marginBottom: 15,
      paddingHorizontal: 15,
      fontSize: 18,
      textAlign: 'right',
      borderRadius: 10,
      backgroundColor: theme.background,
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 15,
      marginTop: 10,
      width: '80%',
      alignItems: 'center',
      elevation: 5,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    buttonText: {
      color: theme.white,
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
    },
    successMessage: {
      marginTop: 20,
      color: theme.success,
      fontSize: 18,
      textAlign: 'center',
    },
  });
