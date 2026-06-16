// Press Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Press data with real articles
    const pressData = [
        {
            id: 1,
            title: "GASTRO IMPROV: новое шоу от PERELMAN PEOPLE и ImprovLab",
            description: "В пространстве Well Well, находящимся на -1 этаже ресторана «Рыба моя» на Китай-городе, разворачивается новое уникальное гастро шоу: сцена и кухня соединяется единой темой, рождающейся в импровизации, прямо на глазах у зрителя. Это не просто ужин с представлением — это синтез искусств, где актёры создают истории, а повара интерпретируют их в блюдах. Каждый вечер уникален, каждая история неповторима, и каждый гость становится частью этого волшебного процесса.",
            source: "Chef.ru",
            date: "17 Сентября 2025",
            image: "../../public/activ/20250924-202433.jpg",
            views: 1247,
            likes: 89,
            liked: false,
            url: "https://chef.ru/news/gastro-improv-novoe-gastronomicheskoe-improvizaczionnoe-shou-ot-perelman-people-i-improvlab/?ysclid=mhc3pcb2qb632933016"
        },
        {
            id: 2,
            title: "Вова Перельман делает первый прогон своего нового шоу",
            description: "Основатель Perelman People и создатель концепции Gastro Improv представляет новый формат театрального искусства. Это не просто шоу — это эксперимент, где границы между зрителем и актёром стираются, а кулинария становится частью театрального действа.",
            source: "Сысоев FM",
            date: "23 сентября 2025",
            image: "../../public/other/photo_2025-10-29_18-59-56.jpg",
            views: 743,
            likes: 45,
            liked: false,
            url: "https://t.me/sysoevfm/18391"
        },
        {
            id: 3,
            title: "Рестораны, где подают эмоции",
            description: "Московские рестораны взяли курс на мультижанровые события и смело скрещивают искусство гастрономии с другими. «Сноб» оценил начинание и составил план, куда сходить этой осенью. Improv Lab становится одним из главных героев этого гастрономического ренессанса, предлагая уникальный формат, где театр и кулинария создают единое пространство для эмоций и впечатлений.",
            source: "Сноб",
            date: "6 Октября 2025",
            image: "../../public/other/photo_2025-10-29_18-54-21.jpg",
            views: 892,
            likes: 67,
            liked: false,
            url: "https://snob.ru/food/restorany-gde-podaiut-emotsii/?utm_source=telegram&utm_medium=social&utm_content=article"
        },
        {
            id: 4,
            title: "Грандиозное событие  Gastro Improv от Perelman People",
            description: "Испытала новый опыт: актёры импровизируют без сценария, а повара — без рецепта. Все начинается со знакомства с явствами, из которых, в последствии, пока вы увлечены импровизированным театром, повара готовят для гостей ужин. Это не просто ужин — это путешествие в мир, где каждое блюдо рассказывает историю, а каждый актёр становится поваром эмоций.",
            source: "Мир Саши Фабиш",
            date: "10 Октября 2025",
            image: "../../public/other/photo_2025-10-29_18-55-33.jpg",
            views: 2156,
            likes: 134,
            liked: false,
            url: "https://t.me/sashafabish/5072"
        },
        {
            id: 5,
            title: "Фестиваль «Случай» - это про эксперименты",
            description: "Именно об этом говорит «IMPROV LAB» — самая многочисленная команда сегодняшнего дня. Как вышло, что на видео их четверо? Случайно. Фестиваль «Случай» стал площадкой для самых смелых экспериментов в области импровизационного театра, где Improv Lab показал, что случайность может стать искусством, а спонтанность — мастерством.",
            source: "Импровизационный фестиваль «Случай»",
            date: "18 октября 2025",
            image: "../../public/activ/IMG_3854.JPG",
            views: 1089,
            likes: 78,
            liked: false,
            url: "https://t.me/festimprov/86"
        }
    ];

    // DOM elements
    const pressGrid = document.getElementById('pressGrid');
    const scrollToTopBtn = document.getElementById('scrollToTop');

    // Initialize
    init();

    function init() {
        renderPressCards();
        setupEventListeners();
    }

    function renderPressCards() {
        if (pressData.length === 0) {
            pressGrid.innerHTML = `
                <div class="press-empty">
                    <div class="press-empty-icon">📰</div>
                    <div class="press-empty-text">Статьи не найдены</div>
                </div>
            `;
            return;
        }

        pressGrid.innerHTML = pressData.reverse().map(item => createPressCard(item)).join('');
        
        // Add event listeners to like buttons and show more buttons
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', handleLike);
        });

        document.querySelectorAll('.press-card-show-more').forEach(btn => {
            btn.addEventListener('click', handleShowMore);
        });
    }

    function createPressCard(item) {
        const isLongText = item.description.length > 200;
        const truncatedText = isLongText ? item.description.substring(0, 200) + '...' : item.description;
        
        return `
            <article class="press-card" data-id="${item.id}">
                <div class="press-card-image-container">
                    <img src="${item.image}" alt="${item.title}" class="press-card-image" loading="lazy">
                </div>
                <div class="press-card-content">
                    <div class="press-card-header">
                        <div class="press-card-date">${item.date}</div>
                        <h3 class="press-card-title">${item.title}</h3>
                        <div class="press-card-source">${item.source}</div>
                        <p class="press-card-description ${isLongText ? 'truncated' : ''}" data-full-text="${item.description}">
                            ${isLongText ? truncatedText : item.description}
                        </p>
                        ${isLongText ? `<button class="press-card-show-more" data-id="${item.id}">Показать полностью</button>` : ''}
                    </div>
                    <div class="press-card-footer">
                        <div class="press-card-meta">
                            <div class="press-card-views press-card-meta-item">
                                <i class="fas fa-eye"></i>
                                <span class="view-counter">${formatNumber(item.views)}</span>
                            </div>
                            <div class="press-card-likes press-card-meta-item">
                                <button class="like-btn ${item.liked ? 'active' : ''}" data-id="${item.id}">
                                    <i class="fas fa-heart"></i>
                                </button>
                                <span class="like-counter">${item.likes}</span>
                            </div>
                        </div>
                        <a href="${item.url}" class="press-card-button" target="_blank" rel="noopener">
                            Читать статью <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </div>
            </article>
        `;
    }

    function formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }

    function handleLike(e) {
        e.preventDefault();
        const button = e.currentTarget;
        const itemId = parseInt(button.dataset.id);
        const item = pressData.find(item => item.id === itemId);
        
        if (!item) return;

        // Toggle like status
        item.liked = !item.liked;
        item.likes += item.liked ? 1 : -1;

        // Update button appearance
        button.classList.toggle('active', item.liked);
        button.classList.toggle('liked', item.liked);
        
        // Update counter
        const counter = button.nextElementSibling;
        counter.textContent = item.likes;

        // Add animation
        if (item.liked) {
            button.style.animation = 'none';
            setTimeout(() => {
                button.style.animation = 'heartBeat 0.6s ease';
            }, 10);
        }

        // Save to localStorage
        saveLikesToStorage();
    }

    function handleShowMore(e) {
        e.preventDefault();
        const button = e.currentTarget;
        const itemId = parseInt(button.dataset.id);
        const card = document.querySelector(`[data-id="${itemId}"]`);
        const description = card.querySelector('.press-card-description');
        const fullText = description.dataset.fullText;
        
        if (description.classList.contains('truncated')) {
            // Show full text
            description.textContent = fullText;
            description.classList.remove('truncated');
            description.classList.add('full');
            button.textContent = 'Свернуть';
        } else {
            // Show truncated text
            const truncatedText = fullText.substring(0, 200) + '...';
            description.textContent = truncatedText;
            description.classList.remove('full');
            description.classList.add('truncated');
            button.textContent = 'Показать полностью';
        }
    }

    function saveLikesToStorage() {
        const likesData = pressData.reduce((acc, item) => {
            acc[item.id] = { liked: item.liked, likes: item.likes };
            return acc;
        }, {});
        localStorage.setItem('improvlab_press_likes', JSON.stringify(likesData));
    }

    function loadLikesFromStorage() {
        const savedLikes = localStorage.getItem('improvlab_press_likes');
        if (savedLikes) {
            try {
                const likesData = JSON.parse(savedLikes);
                pressData.forEach(item => {
                    if (likesData[item.id]) {
                        item.liked = likesData[item.id].liked;
                        item.likes = likesData[item.id].likes;
                    }
                });
            } catch (e) {
                console.error('Error loading likes from storage:', e);
            }
        }
    }

    function setupEventListeners() {
        // Scroll to top button
        if (scrollToTopBtn) {
            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

            // Show/hide scroll to top button
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    scrollToTopBtn.style.display = 'block';
                } else {
                    scrollToTopBtn.style.display = 'none';
                }
            });
        }

        // Mobile menu toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (navToggle && navLinks) {
            navToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
    }

    // Load saved likes on page load
    loadLikesFromStorage();

    // Simulate view increment on page load
    pressData.forEach(item => {
        item.views += Math.floor(Math.random() * 10);
    });
});


