import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { insertBook } from '../database/Database';
import { themes } from '../constants/theme';


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
      console.error(error);
      setSuccessMessage('مشکلی در اضافه کردن کتاب وجود داشت.');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <View style={styles.container}>
<View style={styles.headerContainer}>
  <Text style={styles.header}> افزودن کتاب جدید</Text>
</View>
      <TextInput
        style={styles.input}
        placeholder="عنوان کتاب"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="نام نویسنده"
        value={author}
        onChangeText={setAuthor}
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="مکان کتاب"
        value={location}
        onChangeText={setLocation}
        placeholderTextColor="#999"
      />

<TouchableOpacity style={styles.button} onPress={handleAddBook}>
  <Text style={styles.buttonText}> ذخیره</Text>
</TouchableOpacity>


      {successMessage !== '' && (
        <Text style={styles.successMessage}>{successMessage}</Text>
      )}
    </View>
  );
}
const currentTheme = themes.spiritualTheme; 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20,
    backgroundColor: currentTheme.background, 
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: currentTheme.shadowColor, 
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: currentTheme.primary, 
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 18,
    textAlign: 'right',
    borderRadius: 10,
    backgroundColor: currentTheme.background, 
  },
  button: {
    backgroundColor: currentTheme.primary, 
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
    color: currentTheme.white, 
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  successMessage: {
    marginTop: 20,
    color: currentTheme.success, 
    fontSize: 18,
    textAlign: 'center',
  },
});
