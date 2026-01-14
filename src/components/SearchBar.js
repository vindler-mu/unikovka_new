import React from 'react';
import { Search } from 'lucide-react';
import './SearchBar.css';

const SearchBar = ({ searchQuery, onSearchChange, filter, onFilterChange }) => {
  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Hledat knihy podle názvu, autora nebo žánru..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          Všechny
        </button>
        <button
          className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
          onClick={() => onFilterChange('read')}
        >
          Přečtené
        </button>
        <button
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => onFilterChange('unread')}
        >
          Nepřečtené
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
