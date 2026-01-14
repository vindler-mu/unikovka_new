class LibraryApp {
    constructor() {
        this.books = this.loadBooksFromStorage();
        this.currentView = localStorage.getItem('viewMode') || 'grid';
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.editingBookId = null;
        this.currentSort = 'dateAdded';

        this.initializeElements();
        this.applyTheme();
        this.attachEventListeners();
        this.renderBooks();
        this.updateStats();
        this.applyViewMode();
    }

    initializeElements() {
        this.bookForm = document.getElementById('bookForm');
        this.booksList = document.getElementById('booksList');
        this.emptyState = document.getElementById('emptyState');
        this.searchInput = document.getElementById('searchInput');
        this.genreFilter = document.getElementById('genreFilter');
        this.statusFilter = document.getElementById('statusFilter');
        this.sortBy = document.getElementById('sortBy');
        this.themeToggle = document.getElementById('themeToggle');
        this.gridViewBtn = document.getElementById('gridView');
        this.listViewBtn = document.getElementById('listView');
        this.exportBtn = document.getElementById('exportBtn');
        this.importBtn = document.getElementById('importBtn');
        this.importFile = document.getElementById('importFile');
        this.cancelEditBtn = document.getElementById('cancelEdit');
        this.formTitle = document.getElementById('formTitle');
        this.submitBtn = document.getElementById('submitBtn');
        this.ratingInput = document.getElementById('ratingInput');

        this.totalBooksEl = document.getElementById('totalBooks');
        this.readBooksEl = document.getElementById('readBooks');
        this.readingBooksEl = document.getElementById('readingBooks');
        this.avgRatingEl = document.getElementById('avgRating');
    }

    attachEventListeners() {
        this.bookForm.addEventListener('submit', (e) => this.handleSubmitBook(e));
        this.searchInput.addEventListener('input', () => this.filterAndSortBooks());
        this.genreFilter.addEventListener('change', () => this.filterAndSortBooks());
        this.statusFilter.addEventListener('change', () => this.filterAndSortBooks());
        this.sortBy.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.filterAndSortBooks();
        });

        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.gridViewBtn.addEventListener('click', () => this.setViewMode('grid'));
        this.listViewBtn.addEventListener('click', () => this.setViewMode('list'));
        this.exportBtn.addEventListener('click', () => this.exportData());
        this.importBtn.addEventListener('click', () => this.importFile.click());
        this.importFile.addEventListener('change', (e) => this.importData(e));
        this.cancelEditBtn.addEventListener('click', () => this.cancelEdit());

        this.ratingInput.querySelectorAll('.star').forEach(star => {
            star.addEventListener('click', (e) => this.setRating(e.target.dataset.value));
            star.addEventListener('mouseenter', (e) => this.highlightStars(e.target.dataset.value));
        });

        this.ratingInput.addEventListener('mouseleave', () => {
            const currentRating = document.getElementById('rating').value;
            this.highlightStars(currentRating);
        });
    }

    loadBooksFromStorage() {
        const stored = localStorage.getItem('libraryBooks');
        let books = stored ? JSON.parse(stored) : [];

        books = books.map(book => ({
            ...book,
            rating: book.rating || 0
        }));

        return books;
    }

    saveBooksToStorage() {
        localStorage.setItem('libraryBooks', JSON.stringify(this.books));
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        const sunIcon = this.themeToggle.querySelector('.sun-icon');
        const moonIcon = this.themeToggle.querySelector('.moon-icon');

        if (this.currentTheme === 'dark') {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        } else {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.currentTheme);
        this.applyTheme();
    }

    setViewMode(mode) {
        this.currentView = mode;
        localStorage.setItem('viewMode', mode);
        this.applyViewMode();
    }

    applyViewMode() {
        if (this.currentView === 'list') {
            this.booksList.classList.add('list-view');
            this.gridViewBtn.classList.remove('active');
            this.listViewBtn.classList.add('active');
        } else {
            this.booksList.classList.remove('list-view');
            this.gridViewBtn.classList.add('active');
            this.listViewBtn.classList.remove('active');
        }
    }

    setRating(value) {
        document.getElementById('rating').value = value;
        this.highlightStars(value);
    }

    highlightStars(value) {
        const stars = this.ratingInput.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < value) {
                star.classList.add('active');
                star.textContent = '★';
            } else {
                star.classList.remove('active');
                star.textContent = '☆';
            }
        });
    }

    handleSubmitBook(e) {
        e.preventDefault();

        const bookData = {
            title: document.getElementById('title').value.trim(),
            author: document.getElementById('author').value.trim(),
            year: document.getElementById('year').value.trim(),
            genre: document.getElementById('genre').value,
            isbn: document.getElementById('isbn').value.trim(),
            status: document.getElementById('status').value,
            rating: parseInt(document.getElementById('rating').value) || 0,
            notes: document.getElementById('notes').value.trim(),
        };

        if (this.editingBookId) {
            this.updateBook(this.editingBookId, bookData);
        } else {
            this.addBook(bookData);
        }
    }

    addBook(bookData) {
        const book = {
            id: Date.now(),
            ...bookData,
            dateAdded: new Date().toISOString()
        };

        this.books.unshift(book);
        this.saveBooksToStorage();
        this.filterAndSortBooks();
        this.updateStats();
        this.bookForm.reset();
        this.setRating(0);
        this.showNotification('Kniha byla úspěšně přidána!');
    }

    updateBook(id, bookData) {
        const index = this.books.findIndex(b => b.id === id);
        if (index !== -1) {
            this.books[index] = {
                ...this.books[index],
                ...bookData
            };
            this.saveBooksToStorage();
            this.filterAndSortBooks();
            this.updateStats();
            this.cancelEdit();
            this.showNotification('Kniha byla aktualizována!');
        }
    }

    editBook(id) {
        const book = this.books.find(b => b.id === id);
        if (!book) return;

        this.editingBookId = id;

        document.getElementById('editBookId').value = id;
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('year').value = book.year || '';
        document.getElementById('genre').value = book.genre || '';
        document.getElementById('isbn').value = book.isbn || '';
        document.getElementById('status').value = book.status;
        document.getElementById('notes').value = book.notes || '';

        this.setRating(book.rating || 0);

        this.formTitle.textContent = 'Upravit knihu';
        this.submitBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Uložit změny
        `;
        this.cancelEditBtn.classList.remove('hidden');

        document.getElementById('bookFormSection').scrollIntoView({ behavior: 'smooth' });
    }

    cancelEdit() {
        this.editingBookId = null;
        this.bookForm.reset();
        this.setRating(0);
        this.formTitle.textContent = 'Přidat novou knihu';
        this.submitBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Přidat knihu
        `;
        this.cancelEditBtn.classList.add('hidden');
    }

    deleteBook(id) {
        if (confirm('Opravdu chcete odstranit tuto knihu z knihovny?')) {
            this.books = this.books.filter(book => book.id !== id);
            this.saveBooksToStorage();
            this.filterAndSortBooks();
            this.updateStats();
            this.showNotification('Kniha byla odstraněna.');
        }
    }

    filterAndSortBooks() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const genreFilter = this.genreFilter.value;
        const statusFilter = this.statusFilter.value;

        let filtered = this.books.filter(book => {
            const matchesSearch =
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                (book.isbn && book.isbn.toLowerCase().includes(searchTerm));

            const matchesGenre = !genreFilter || book.genre === genreFilter;
            const matchesStatus = !statusFilter || book.status === statusFilter;

            return matchesSearch && matchesGenre && matchesStatus;
        });

        filtered = this.sortBooks(filtered);
        this.renderBooks(filtered);
    }

    sortBooks(books) {
        const sorted = [...books];

        switch (this.currentSort) {
            case 'title':
                sorted.sort((a, b) => a.title.localeCompare(b.title, 'cs'));
                break;
            case 'author':
                sorted.sort((a, b) => a.author.localeCompare(b.author, 'cs'));
                break;
            case 'rating':
                sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'year':
                sorted.sort((a, b) => {
                    const yearA = parseInt(a.year) || 0;
                    const yearB = parseInt(b.year) || 0;
                    return yearB - yearA;
                });
                break;
            case 'dateAdded':
            default:
                sorted.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
                break;
        }

        return sorted;
    }

    renderBooks(booksToRender = this.books) {
        if (booksToRender.length === 0) {
            this.booksList.classList.add('hidden');
            this.emptyState.classList.remove('hidden');
            return;
        }

        this.booksList.classList.remove('hidden');
        this.emptyState.classList.add('hidden');

        this.booksList.innerHTML = booksToRender.map(book => this.createBookCard(book)).join('');

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bookId = parseInt(e.target.dataset.id);
                this.deleteBook(bookId);
            });
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bookId = parseInt(e.target.dataset.id);
                this.editBook(bookId);
            });
        });
    }

    createBookCard(book) {
        const statusClass = book.status.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const rating = book.rating || 0;
        const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

        return `
            <div class="book-card">
                <div>
                    <h3>${this.escapeHtml(book.title)}</h3>
                    <p class="author">${this.escapeHtml(book.author)}</p>

                    ${rating > 0 ? `<div class="book-rating" title="${rating} hvězdiček">${stars}</div>` : ''}

                    <div class="book-details">
                        ${book.year ? `<p><strong>Rok:</strong> ${this.escapeHtml(book.year)}</p>` : ''}
                        ${book.genre ? `<p><strong>Žánr:</strong> <span class="genre-badge">${this.escapeHtml(book.genre)}</span></p>` : ''}
                        ${book.isbn ? `<p><strong>ISBN:</strong> ${this.escapeHtml(book.isbn)}</p>` : ''}
                        <p><strong>Stav:</strong> <span class="status-badge ${statusClass}">${this.escapeHtml(book.status)}</span></p>
                    </div>

                    ${book.notes ? `<div class="book-notes"><strong>Poznámky:</strong> ${this.escapeHtml(book.notes)}</div>` : ''}
                </div>

                <div class="book-actions">
                    <button class="btn btn-edit edit-btn" data-id="${book.id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Upravit
                    </button>
                    <button class="btn btn-danger delete-btn" data-id="${book.id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Odstranit
                    </button>
                </div>
            </div>
        `;
    }

    updateStats() {
        const total = this.books.length;
        const read = this.books.filter(b => b.status === 'Přečteno').length;
        const reading = this.books.filter(b => b.status === 'Čtu').length;

        const ratedBooks = this.books.filter(b => b.rating > 0);
        const avgRating = ratedBooks.length > 0
            ? (ratedBooks.reduce((sum, b) => sum + b.rating, 0) / ratedBooks.length).toFixed(1)
            : '0.0';

        this.totalBooksEl.textContent = total;
        this.readBooksEl.textContent = read;
        this.readingBooksEl.textContent = reading;
        this.avgRatingEl.textContent = avgRating;
    }

    exportData() {
        const dataStr = JSON.stringify(this.books, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `knihovna_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        this.showNotification('Data byla exportována!', 'info');
    }

    importData(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedBooks = JSON.parse(event.target.result);

                if (!Array.isArray(importedBooks)) {
                    throw new Error('Neplatný formát dat');
                }

                const validBooks = importedBooks.filter(book => book.title && book.author);

                if (validBooks.length === 0) {
                    throw new Error('Žádné platné knihy k importu');
                }

                if (confirm(`Chcete importovat ${validBooks.length} knih? Toto přidá knihy k vašim stávajícím.`)) {
                    const booksWithNewIds = validBooks.map(book => ({
                        ...book,
                        id: Date.now() + Math.random(),
                        rating: book.rating || 0
                    }));

                    this.books = [...booksWithNewIds, ...this.books];
                    this.saveBooksToStorage();
                    this.filterAndSortBooks();
                    this.updateStats();
                    this.showNotification(`Importováno ${validBooks.length} knih!`, 'info');
                }
            } catch (error) {
                this.showNotification('Chyba při importu dat: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'success') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        const icon = type === 'error' ? '❌' : type === 'info' ? 'ℹ️' : '✅';
        notification.innerHTML = `
            <span style="font-size: 1.5rem;">${icon}</span>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LibraryApp();
});
