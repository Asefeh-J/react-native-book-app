# 📚 Book List App

This is a cross-platform **React Native** app for managing a personal list of books. Users can view, add, and delete books, each with a title, author, and location. It also shows a summary of books grouped by location.

## ✨ Features

- 📖 View a list of saved books
- 🔍 Search books by title, author name, or location
- 🔠 Alphabetical filtering for easy navigation
- ➕ Add new books with title, author, and location
- 🗑️ Delete books with confirmation
- 📍 View total book count grouped by location
- 🌓 RTL layout for Farsi language support
- 🎨 Themed UI with dynamic colors


## 📦 Technologies Used

- **React Native**
- **SQLite** (local storage)
- **React Native Vector Icons**
- **Custom Theme System**


## 🚀 Getting Started

### Prerequisites

- Node.js
- Expo CLI or React Native CLI
- Android/iOS simulator or device

## How to Build apk

To generate the Android .apk for local install or sharing:
🔧 Prerequisites

    Node.js and npm installed

    eas-cli installed globally

    npm install -g eas-cli

    Expo account (create at https://expo.dev if needed)

### Steps
    1) Clone the repository

git clone https://github.com/Asefeh-J/react-native-book-app.git
cd react-native-book-app

    2) Install dependencies

npm install

    3) Make the script executable and run it

chmod +x build-apk.sh
./build-apk.sh

   4) Monitor build
The terminal will show a link. Use it to track progress and download your .apk when ready.

🔒 License

This project is licensed under the MIT License.
