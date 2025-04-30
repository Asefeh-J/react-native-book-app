import * as SQLite from 'expo-sqlite';

// Open the database asynchronously
export const openDatabase = async () => {
  const db = await SQLite.openDatabaseAsync('books.db');
  return db;
};

// Initialize the database (creating the table)
export const initDatabase = async () => {
  const db = await openDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      location TEXT NOT NULL
    );
  `);
};

// Insert a book into the database
export const insertBook = async (title, author, location) => {
  const db = await openDatabase();
  await db.runAsync(
    'INSERT INTO books (title, author, location) VALUES (?, ?, ?)',
    title,
    author,
    location
  );
};

// Fetch all books from the database
export const fetchAllBooks = async () => {
  const db = await openDatabase();
  const result = await db.getAllAsync('SELECT * FROM books');
  return result;
};

// Search books by title
export const searchByTitle = async (title) => {
  const db = await openDatabase();
  const result = await db.getAllAsync('SELECT * FROM books WHERE title LIKE ?', [`%${title}%`]);
  return result;
};

// Search books by author
export const searchByAuthor = async (author) => {
  const db = await openDatabase();
  const result = await db.getAllAsync('SELECT * FROM books WHERE author LIKE ?', [`%${author}%`]);
  return result;
};

// Search books by location
export const searchByLocation = async (location) => {
  const db = await openDatabase();
  const result = await db.getAllAsync('SELECT * FROM books WHERE location LIKE ?', [`%${location}%`]);
  return result;
};

// Search books by the first letter of the title only
export const searchByLetter = async (letter) => {
  const db = await openDatabase();
  // Search by title starting with the given letter
  const result = await db.getAllAsync(
    `SELECT * FROM books WHERE title LIKE ?`,
    [`${letter}%`]  // Match books where title starts with the selected letter
  );
  return result;
};


// Fetch books alphabetically by title
export const fetchBooksAlphabeticallyByTitle = async () => {
  const db = await openDatabase();
  const result = await db.getAllAsync('SELECT * FROM books ORDER BY title ASC');
  return result;
};

// Fetch books alphabetically by author
export const fetchBooksAlphabeticallyByAuthor = async () => {
  const db = await openDatabase();
  const result = await db.getAllAsync('SELECT * FROM books ORDER BY author ASC');
  return result;
};

// Delete a book by its ID
export const deleteBook = async (id) => {
  const db = await openDatabase();
  await db.runAsync('DELETE FROM books WHERE id = ?', [id]);
};

// Update a book by its ID
export const updateBook = async (id, title, author, location) => {
  const db = await openDatabase();
  await db.runAsync(
    'UPDATE books SET title = ?, author = ?, location = ? WHERE id = ?',
    title,
    author,
    location,
    id
  );
};

// Fetch books with pagination
export const fetchBooksWithPagination = async (page, limit) => {
  const db = await openDatabase();
  const offset = (page - 1) * limit;
  const result = await db.getAllAsync('SELECT * FROM books LIMIT ? OFFSET ?', [limit, offset]);
  return result;
};
