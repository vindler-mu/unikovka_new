import React, { useState } from 'react';
import { BookPlus } from 'lucide-react';
import './AddBookForm.css';

const AddBookForm = ({ onAddBook }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    pages: '',
    year: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.author) {
      onAddBook(formData);
      setFormData({
        title: '',
        author: '',
        genre: '',
        pages: '',
        year: '',
        notes: ''
      });
      setIsOpen(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="add-book-form-container">
      {!isOpen ? (
        <button
          className="add-book-button"
          onClick={() => setIsOpen(true)}
        >
          <BookPlus size={20} />
          Přidat novou knihu
        </button>
      ) : (
        <div className="add-book-form">
          <h3>Přidat novou knihu</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Název knihy *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Např. 1984"
                />
              </div>
              <div className="form-group">
                <label>Autor *</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  placeholder="Např. George Orwell"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Žánr</label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  placeholder="Např. Sci-fi"
                />
              </div>
              <div className="form-group">
                <label>Počet stran</label>
                <input
                  type="number"
                  name="pages"
                  value={formData.pages}
                  onChange={handleChange}
                  placeholder="Např. 328"
                />
              </div>
              <div className="form-group">
                <label>Rok vydání</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="Např. 1949"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Poznámky</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Vaše poznámky k této knize..."
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                Přidat knihu
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setIsOpen(false)}
              >
                Zrušit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddBookForm;
