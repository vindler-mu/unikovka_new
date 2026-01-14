import React from 'react';
import BookCard from './BookCard';
import './BookList.css';

const BookList = ({ books, onDeleteBook, onToggleRead, onUpdateBook }) => {
  if (books.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📚</div>
        <h3>Zatím žádné knihy</h3>
        <p>Začněte přidáním své první knihy do knihovny</p>
      </div>
    );
  }

  return (
    <div className="book-list">
      <h2>Moje knihy ({books.length})</h2>
      <div className="books-grid">
        {books.map(book => (
          <BookCard
            key={book.id}
            book={book}
            onDelete={onDeleteBook}
            onToggleRead={onToggleRead}
            onUpdate={onUpdateBook}
          />
        ))}
      </div>
    </div>
  );
};

export default BookList;
