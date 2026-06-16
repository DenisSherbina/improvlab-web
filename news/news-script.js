// News Data
const newsData = [
    {
        id: 1,
        title: "Грандиозный фестиваль «Случай» в Москвич центре",
        description: "Команда Improv Lab подарила зрителям незабываемый вечер импровизационного театра. Более 500 человек насладились виртуозной игрой наших актёров.",
        image: "../../public/activ/IMG_3551.JPG",
        category: "events",
        date: "18 октября 2025",
        views: 1250,
        likes: 89,
        comments: 24
    },
    {
        id: 2,
        title: "Новая программа: Ужин с импровизацией",
        description: "GASTRO IMPROV - уникальный проект, где театр встречается с гастрономией. Актёры творят на ваших глазах, повара готовят без рецепта.",
        image: "../../public/activ/IMG_3532.JPG",
        category: "events",
        date: "15 октября 2025",
        views: 2340,
        likes: 156,
        comments: 42
    },
    {
        id: 3,
        title: "Интервью с создателем: Пётр Никищихин о рождении Improv Lab",
        description: "Узнайте, как появилась идея создать театр импровизации и что вдохновило Петра на создание этого уникального проекта, который меняет искусство здесь и сейчас.",
        image: "../../public/team/_TM19892.jpg",
        category: "team",
        date: "12 октября 2025",
        views: 3100,
        likes: 245,
        comments: 67
    },
    {
        id: 4,
        title: "Behind The Scenes: Как готовятся актёры к спектаклю?",
        description: "Закулисные кадры с репетиций Improv Lab. Смотрите, как наша команда готовится к каждому выступлению и какие упражнения развивают мастерство импровизации.",
        image: "../../public/activ/IMG_0211.JPG",
        category: "behind",
        date: "10 октября 2025",
        views: 1850,
        likes: 134,
        comments: 38
    },
    {
        id: 5,
        title: "Маскарад в Петровском дворце: историческое событие",
        description: "Спектакль по мотивам лермонтовского «Маскарада» прошел во дворце и превзошел все ожидания. Актёры-импровизаторы создавали историю в реальном времени.",
        image: "../../public/activ/IMG_2270.JPG",
        category: "events",
        date: "8 октября 2025",
        views: 2750,
        likes: 198,
        comments: 55
    }
];

// State Management
const state = {
    filter: 'all',
    likes: JSON.parse(localStorage.getItem('newsLikes')) || {}
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderNews();
    setupFilters();
    setupScrollToTop();
});

// Render News Cards
function renderNews() {
    const newsGrid = document.getElementById('newsGrid');
    newsGrid.innerHTML = '';

    const filteredNews = state.filter === 'all' 
        ? newsData 
        : newsData.filter(news => news.category === state.filter);

    if (filteredNews.length === 0) {
        newsGrid.innerHTML = `
            <div class="news-empty" style="grid-column: 1 / -1;">
                <div class="news-empty-icon">📰</div>
                <p class="news-empty-text">Новости по этой категории не найдены</p>
            </div>
        `;
        return;
    }

    filteredNews.forEach((news, index) => {
        const newsCard = createNewsCard(news);
        newsGrid.appendChild(newsCard);
        
        // Trigger animation
        setTimeout(() => {
            newsCard.style.opacity = '1';
        }, index * 50);
    });
}

// Create News Card
function createNewsCard(news) {
    const card = document.createElement('article');
    card.className = 'news-card';
    card.style.opacity = '0';
    card.setAttribute('data-id', news.id);
    
    const isLiked = state.likes[news.id] || false;
    const likeCount = news.likes + (isLiked ? 1 : 0);

    card.innerHTML = `
        <div style="position: relative; overflow: hidden;">
            <img src="${news.image}" alt="${news.title}" class="news-card-image" loading="lazy">
            <span class="news-card-badge">${getCategoryLabel(news.category)}</span>
        </div>
        <div class="news-card-content">
            <div class="news-card-header">
                <div class="news-card-date">${news.date}</div>
                <h3 class="news-card-title">${escapeHtml(news.title)}</h3>
            </div>
            <p class="news-card-description">${escapeHtml(news.description)}</p>
            
            <div class="news-card-footer">
                <div class="news-card-meta">
                    <div class="news-card-meta-item">
                        <i class="fas fa-eye"></i>
                        <span>${formatNumber(news.views)}</span>
                    </div>
                    <div class="news-card-meta-item">
                        <i class="fas fa-comment"></i>
                        <span>${news.comments}</span>
                    </div>
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <button class="like-btn ${isLiked ? 'active' : ''}" data-id="${news.id}" title="Мне нравится">
                        <i class="fas fa-heart"></i>
                        <span style="font-size: 0.9rem; margin-left: 2px;">${formatNumber(likeCount)}</span>
                    </button>
                    <button class="news-card-button" data-id="${news.id}">
                        <i class="fas fa-arrow-right"></i>
                        Читать
                    </button>
                </div>
            </div>
        </div>
    `;

    // Event Listeners
    const likeBtn = card.querySelector('.like-btn');
    const readBtn = card.querySelector('.news-card-button');

    likeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleLike(news.id);
    });

    readBtn.addEventListener('click', () => {
        // Track view
        news.views++;
        showNotification('Новость открыта! Спасибо за интерес.');
    });

    return card;
}

// Toggle Like
function toggleLike(newsId) {
    state.likes[newsId] = !state.likes[newsId];
    localStorage.setItem('newsLikes', JSON.stringify(state.likes));
    renderNews();
    
    const liked = state.likes[newsId];
    showNotification(liked ? '❤️ Спасибо за лайк!' : 'Лайк удален');
}

// Setup Filters
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.filter = btn.dataset.filter;
            renderNews();
            window.scrollTo({ top: 300, behavior: 'smooth' });
        });
    });
}

// Setup Scroll to Top
function setupScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'flex';
        } else {
            scrollBtn.style.display = 'none';
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Get Category Label
function getCategoryLabel(category) {
    const labels = {
        'all': 'Новость',
        'events': 'События',
        'team': 'Команда',
        'behind': 'Behind The Scenes'
    };
    return labels[category] || 'Новость';
}

// Utility Functions
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #0d4227;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-family: 'Oswald', sans-serif;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);


