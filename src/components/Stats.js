import React from 'react';
import { BookOpen, BookMarked, Library, TrendingUp } from 'lucide-react';
import './Stats.css';

const Stats = ({ books }) => {
  const totalBooks = books.length;
  const readBooks = books.filter(book => book.isRead).length;
  const unreadBooks = totalBooks - readBooks;
  const readPercentage = totalBooks > 0 ? Math.round((readBooks / totalBooks) * 100) : 0;
  const totalPages = books.reduce((sum, book) => sum + (parseInt(book.pages) || 0), 0);

  return (
    <div className="stats-container">
      <div className="stat-card">
        <div className="stat-icon library">
          <Library size={24} />
        </div>
        <div className="stat-content">
          <div className="stat-value">{totalBooks}</div>
          <div className="stat-label">Celkem knih</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon read">
          <BookMarked size={24} />
        </div>
        <div className="stat-content">
          <div className="stat-value">{readBooks}</div>
          <div className="stat-label">Přečteno</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon unread">
          <BookOpen size={24} />
        </div>
        <div className="stat-content">
          <div className="stat-value">{unreadBooks}</div>
          <div className="stat-label">K přečtení</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon progress">
          <TrendingUp size={24} />
        </div>
        <div className="stat-content">
          <div className="stat-value">{readPercentage}%</div>
          <div className="stat-label">Dokončeno</div>
          {totalPages > 0 && (
            <div className="stat-extra">{totalPages.toLocaleString()} stran</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;
