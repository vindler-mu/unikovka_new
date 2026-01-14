import React, { useState } from 'react';
import { Trash2, Edit2, Check, X, BookOpen, BookMarked } from 'lucide-react';
import './BookCard.css';

const BookCard = ({ book, onDelete, onToggleRead, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(book);

  const handleSave = () => {
    onUpdate(book.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(book);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="book-card editing">
        <div className="edit-form">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            placeholder="Název"
          />
          <input
            type="text"
            value={editData.author}
            onChange={(e) => setEditData({ ...editData, author: e.target.value })}
            placeholder="Autor"
          />
          <input
            type="text"
            value={editData.genre || ''}
            onChange={(e) => setEditData({ ...editData, genre: e.target.value })}
            placeholder="Žánr"
          />
          <div className="edit-row">
            <input
              type="number"
              value={editData.pages || ''}
              onChange={(e) => setEditData({ ...editData, pages: e.target.value })}
              placeholder="Strany"
            />
            <input
              type="number"
              value={editData.year || ''}
              onChange={(e) => setEditData({ ...editData, year: e.target.value })}
              placeholder="Rok"
            />
          </div>
          <textarea
            value={editData.notes || ''}
            onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
            placeholder="Poznámky"
            rows="3"
          />
          <div className="edit-actions">
            <button className="btn-save" onClick={handleSave}>
              <Check size={16} /> Uložit
            </button>
            <button className="btn-cancel-edit" onClick={handleCancel}>
              <X size={16} /> Zrušit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`book-card ${book.isRead ? 'read' : 'unread'}`}>
      <div className="book-header">
        <div className="book-icon">
          {book.isRead ? <BookMarked size={24} /> : <BookOpen size={24} />}
        </div>
        <div className="book-actions">
          <button
            className="action-btn edit"
            onClick={() => setIsEditing(true)}
            title="Upravit"
          >
            <Edit2 size={16} />
          </button>
          <button
            className="action-btn delete"
            onClick={() => onDelete(book.id)}
            title="Smazat"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="book-content">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>

        <div className="book-details">
          {book.genre && <span className="badge">{book.genre}</span>}
          {book.pages && <span className="detail">{book.pages} str.</span>}
          {book.year && <span className="detail">{book.year}</span>}
        </div>

        {book.notes && (
          <div className="book-notes">
            <p>{book.notes}</p>
          </div>
        )}
      </div>

      <div className="book-footer">
        <button
          className={`read-toggle ${book.isRead ? 'read' : 'unread'}`}
          onClick={() => onToggleRead(book.id)}
        >
          {book.isRead ? '✓ Přečteno' : 'Označit jako přečtené'}
        </button>
      </div>
    </div>
  );
};

export default BookCard;
