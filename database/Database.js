import * as SQLite from 'expo-sqlite';

// Declare a module-scoped variable to hold the single database instance
let _db = null;

// Open the database asynchronously (singleton pattern)
export const openDatabase = async () => {
  if (_db) {
    console.log('Database: Returning existing database instance.');
    return _db; // Return the already open database instance
  }

  try {
    console.log('Database: Opening new database connection...');
    _db = await SQLite.openDatabaseAsync('books.db');
    console.log('Database: Connection opened successfully.');
    return _db;
  } catch (error) {
    console.error('Database: Failed to open database:', error);
    // Re-throw the error so calling functions can handle it
    throw new Error('Failed to open database connection.');
  }
};

// Optional: Function to close the database (useful for testing or specific lifecycle needs)
export const closeDatabase = async () => {
  if (_db) {
    console.log('Database: Closing database connection...');
    await _db.closeAsync();
    _db = null;
    console.log('Database: Connection closed.');
  }
};

// Initialize the database (creating the table)
export const initDatabase = async () => {
  const db = await openDatabase(); // Get the single database instance
  try {
    console.log('Database: Initializing table...');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        location TEXT NOT NULL
      );
    `);
    console.log('Database: Table initialized successfully.');
  } catch (error) {
    console.error('Database: Failed to initialize table:', error);
    throw new Error('Failed to initialize database table.');
  }
};

// Insert a book into the database
export const insertBook = async (title, author, location) => {
  const db = await openDatabase();
  try {
    console.log(`Database: Inserting book "${title}"...`);
    await db.runAsync(
      'INSERT INTO books (title, author, location) VALUES (?, ?, ?)',
      [title, author, location]
    );
    console.log(`Database: Book "${title}" inserted.`);
  } catch (error) {
    console.error(`Database: Failed to insert book "${title}":`, error);
    throw new Error(`Failed to insert book: ${error.message}`);
  }
};

// Fetch all books from the database
export const fetchAllBooks = async () => {
  const db = await openDatabase();
  try {
    console.log('Database: Fetching all books...');
    const result = await db.getAllAsync('SELECT * FROM books');
    console.log(`Database: Fetched ${result.length} books.`);
    return result;
  } catch (error) {
    console.error('Database: Failed to fetch all books:', error);
    throw new Error(`Failed to fetch all books: ${error.message}`);
  }
};

// Search books by title
export const searchByTitle = async (title) => {
  const db = await openDatabase();
  try {
    console.log(`Database: Searching by title "${title}"...`);
    const result = await db.getAllAsync(
      'SELECT * FROM books WHERE title LIKE ?',
      [`%${title}%`]
    );
    console.log(`Database: Found ${result.length} books matching title "${title}".`);
    return result;
  } catch (error) {
    console.error(`Database: Failed to search by title "${title}":`, error);
    throw new Error(`Failed to search by title: ${error.message}`);
  }
};

// Search books by author
export const searchByAuthor = async (author) => {
  const db = await openDatabase();
  try {
    console.log(`Database: Searching by author "${author}"...`);
    const result = await db.getAllAsync(
      'SELECT * FROM books WHERE author LIKE ?',
      [`%${author}%`]
    );
    console.log(`Database: Found ${result.length} books by author "${author}".`);
    return result;
  } catch (error) {
    console.error(`Database: Failed to search by author "${author}":`, error);
    throw new Error(`Failed to search by author: ${error.message}`);
  }
};

// Search books by location
export const searchByLocation = async (location) => {
  const db = await openDatabase();
  try {
    console.log(`Database: Searching by location "${location}"...`);
    const result = await db.getAllAsync(
      'SELECT * FROM books WHERE location LIKE ?',
      [`%${location}%`]
    );
    console.log(`Database: Found ${result.length} books at location "${location}".`);
    return result;
  } catch (error) {
    console.error(`Database: Failed to search by location "${location}":`, error);
    throw new Error(`Failed to search by location: ${error.message}`);
  }
};

// Search books by the first letter of the title only
export const searchByLetter = async (letter) => {
  const db = await openDatabase();
  try {
    console.log(`Database: Searching by letter "${letter}%"...`);
    const result = await db.getAllAsync(
      'SELECT * FROM books WHERE title LIKE ?',
      [`${letter}%`]
    );
    console.log(`Database: Found ${result.length} books starting with letter "${letter}".`);
    return result;
  } catch (error) {
    console.error(`Database: Failed to search by letter "${letter}":`, error);
    throw new Error(`Failed to search by letter: ${error.message}`);
  }
};

// Fetch books alphabetically by title
export const fetchBooksAlphabeticallyByTitle = async () => {
  const db = await openDatabase();
  try {
    console.log('Database: Fetching books alphabetically by title...');
    const result = await db.getAllAsync(
      'SELECT * FROM books ORDER BY title ASC'
    );
    console.log(`Database: Fetched ${result.length} books alphabetically by title.`);
    return result;
  } catch (error) {
    console.error('Database: Failed to fetch books alphabetically by title:', error);
    throw new Error(`Failed to fetch books alphabetically by title: ${error.message}`);
  }
};

// Fetch books alphabetically by author
export const fetchBooksAlphabeticallyByAuthor = async () => {
  const db = await openDatabase();
  try {
    console.log('Database: Fetching books alphabetically by author...');
    const result = await db.getAllAsync(
      'SELECT * FROM books ORDER BY author ASC'
    );
    console.log(`Database: Fetched ${result.length} books alphabetically by author.`);
    return result;
  } catch (error) {
      console.error('Database: Failed to fetch books alphabetically by author:', error);
      throw new Error(`Failed to fetch books alphabetically by author: ${error.message}`);
  }
};

// Delete a book by its ID
export const deleteBook = async (id) => {
  const db = await openDatabase();
  try {
    console.log(`Database: Deleting book with ID ${id}...`);
    await db.runAsync(
      'DELETE FROM books WHERE id = ?',
      [id]
    );
    console.log(`Database: Book with ID ${id} deleted.`);
  } catch (error) {
    console.error(`Database: Failed to delete book with ID ${id}:`, error);
    throw new Error(`Failed to delete book: ${error.message}`);
  }
};

// Update a book by its ID
export const updateBook = async (id, title, author, location) => {
  const db = await openDatabase();
  try {
    console.log(`Database: Updating book with ID ${id}...`);
    await db.runAsync(
      'UPDATE books SET title = ?, author = ?, location = ? WHERE id = ?',
      [title, author, location, id]
    );
    console.log(`Database: Book with ID ${id} updated.`);
  } catch (error) {
    console.error(`Database: Failed to update book with ID ${id}:`, error);
    throw new Error(`Failed to update book: ${error.message}`);
  }
};

// Fetch books with pagination
export const fetchBooksWithPagination = async (page, limit) => {
  const db = await openDatabase();
  const offset = (page - 1) * limit;
  try {
    console.log(`Database: Fetching books with pagination - Page ${page}, Limit ${limit}...`);
    const result = await db.getAllAsync(
      'SELECT * FROM books LIMIT ? OFFSET ?',
      [limit, offset]
    );
    console.log(`Database: Fetched ${result.length} books for page ${page}.`);
    return result;
  } catch (error) {
    console.error(`Database: Failed to fetch books with pagination (Page ${page}, Limit ${limit}):`, error);
    throw new Error(`Failed to fetch books with pagination: ${error.message}`);
  }
};