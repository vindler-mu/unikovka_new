import React, { useState, useEffect } from 'react';
import BookList from './components/BookList';
import AddBookForm from './components/AddBookForm';
import SearchBar from './components/SearchBar';
import Stats from './components/Stats';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, read, unread

  // Načtení knih z localStorage při startu
  useEffect(() => {
    const savedBooks = localStorage.getItem('homeLibrary');
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    }
  }, []);

  // Uložení knih do localStorage při změně
  useEffect(() => {
    localStorage.setItem('homeLibrary', JSON.stringify(books));
  }, [books]);

  const addBook = (book) => {
    const newBook = {
      id: Date.now(),
      ...book,
      isRead: false,
      addedDate: new Date().toISOString(),
    };
    setBooks([newBook, ...books]);
  };

  const deleteBook = (id) => {
    setBooks(books.filter(book => book.id !== id));
  };

  const toggleReadStatus = (id) => {
    setBooks(books.map(book =>
      book.id === id ? { ...book, isRead: !book.isRead } : book
    ));
  };

  const updateBook = (id, updatedBook) => {
    setBooks(books.map(book =>
      book.id === id ? { ...book, ...updatedBook } : book
    ));
  };

  // Filtrování knih
  const filteredBooks = books.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.genre && book.genre.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter =
      filter === 'all' ? true :
      filter === 'read' ? book.isRead :
      filter === 'unread' ? !book.isRead : true;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="App">
      <header className="app-header">
        <h1>📚 Domácí knihovna</h1>
        <p>Spravujte svoji osobní sbírku knih</p>
      </header>

      <div className="app-container">
        <div className="main-content">
          <AddBookForm onAddBook={addBook} />

          <Stats books={books} />

          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filter={filter}
            onFilterChange={setFilter}
          />

          <BookList
            books={filteredBooks}
            onDeleteBook={deleteBook}
            onToggleRead={toggleReadStatus}
            onUpdateBook={updateBook}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
