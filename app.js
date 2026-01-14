class LibraryApp {
    constructor() {
        this.books = this.loadBooksFromStorage();
        this.initializeElements();
        this.attachEventListeners();
        this.renderBooks();
        this.updateStats();
    }

    initializeElements() {
        this.bookForm = document.getElementById('bookForm');
        this.booksList = document.getElementById('booksList');
        this.emptyState = document.getElementById('emptyState');
        this.searchInput = document.getElementById('searchInput');
        this.genreFilter = document.getElementById('genreFilter');
        this.statusFilter = document.getElementById('statusFilter');
        this.bookCount = document.getElementById('bookCount');
    }

    attachEventListeners() {
        this.bookForm.addEventListener('submit', (e) => this.handleAddBook(e));
        this.searchInput.addEventListener('input', () => this.filterBooks());
        this.genreFilter.addEventListener('change', () => this.filterBooks());
        this.statusFilter.addEventListener('change', () => this.filterBooks());
    }

    loadBooksFromStorage() {
        const stored = localStorage.getItem('libraryBooks');
        return stored ? JSON.parse(stored) : [];
    }

    saveBooksToStorage() {
        localStorage.setItem('libraryBooks', JSON.stringify(this.books));
    }

    handleAddBook(e) {
        e.preventDefault();

        const book = {
            id: Date.now(),
            title: document.getElementById('title').value.trim(),
            author: document.getElementById('author').value.trim(),
            year: document.getElementById('year').value.trim(),
            genre: document.getElementById('genre').value,
            isbn: document.getElementById('isbn').value.trim(),
            status: document.getElementById('status').value,
            notes: document.getElementById('notes').value.trim(),
            dateAdded: new Date().toISOString()
        };

        this.books.unshift(book);
        this.saveBooksToStorage();
        this.renderBooks();
        this.updateStats();
        this.bookForm.reset();

        this.showNotification('Kniha byla úspěšně přidána!');
    }

    deleteBook(id) {
        if (confirm('Opravdu chcete odstranit tuto knihu z knihovny?')) {
            this.books = this.books.filter(book => book.id !== id);
            this.saveBooksToStorage();
            this.renderBooks();
            this.updateStats();
            this.showNotification('Kniha byla odstraněna.');
        }
    }

    filterBooks() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const genreFilter = this.genreFilter.value;
        const statusFilter = this.statusFilter.value;

        const filtered = this.books.filter(book => {
            const matchesSearch =
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm);

            const matchesGenre = !genreFilter || book.genre === genreFilter;
            const matchesStatus = !statusFilter || book.status === statusFilter;

            return matchesSearch && matchesGenre && matchesStatus;
        });

        this.renderBooks(filtered);
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
    }

    createBookCard(book) {
        const statusClass = book.status.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        return `
            <div class="book-card">
                <h3>${this.escapeHtml(book.title)}</h3>
                <p class="author">${this.escapeHtml(book.author)}</p>

                <div class="book-details">
                    ${book.year ? `<p><strong>Rok:</strong> ${this.escapeHtml(book.year)}</p>` : ''}
                    ${book.genre ? `<p><strong>Žánr:</strong> <span class="genre-badge">${this.escapeHtml(book.genre)}</span></p>` : ''}
                    ${book.isbn ? `<p><strong>ISBN:</strong> ${this.escapeHtml(book.isbn)}</p>` : ''}
                    <p><strong>Stav:</strong> <span class="status-badge ${statusClass}">${this.escapeHtml(book.status)}</span></p>
                </div>

                ${book.notes ? `<div class="book-notes"><strong>Poznámky:</strong> ${this.escapeHtml(book.notes)}</div>` : ''}

                <button class="btn btn-danger delete-btn" data-id="${book.id}">
                    Odstranit
                </button>
            </div>
        `;
    }

    updateStats() {
        const count = this.books.length;
        this.bookCount.textContent = `Celkem knih: ${count}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message) {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #22c55e;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
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
