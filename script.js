// Splash Screen
document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splashScreen');
    
    if (splashScreen) {
        // Показываем заставку на 2 секунды
        setTimeout(() => {
            splashScreen.classList.add('fade-out');
            
            // Полностью убираем элемент после анимации
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 500); // Время совпадает с transition в CSS
        }, 2000); // 2 секунды показа
    }
    
    // Event Modal functionality
    initEventModals();
    
    // Animated title functionality
    initAnimatedTitle();
});

// Event Modal functionality
function initEventModals() {
    const eventButtons = document.querySelectorAll('.event-type-btn, [data-event]');
    const modal = document.getElementById('eventModal');
    const modalContent = document.getElementById('modalContent');
    const modalClose = document.getElementById('eventModalClose');
    
    // Event data from booking.html
    const eventData = {
        corporate: {
            badge: "Корпоративный мир",
            title: "Корпоративные <em>мероприятия</em>",
            text: "Команды наших актёров <strong>регулярно выступают</strong> на корпоративных праздниках, презентациях и командных встречах ведущих компаний Москвы. Мы создаём увлекательные и динамичные импровизационные спектакли, которые не только развлекают, но и укрепляют командный дух. Наши импровизации легко адаптируются под корпоративную культуру вашей компании.",
            features: [
                "Длительность: 30-60 минут",
                "Для 20-500 человек",
                "Коммедийная атмосфера",
                "Интерактивное взаимодействие"
            ],
            image: "public/activ/IMG_0205.JPG",
            alt: "Корпоративное мероприятие Improv Lab"
        },
        wedding: {
            badge: "Особые моменты",
            title: "Свадебные <em>торжества</em>",
            text: "Свадьба — это день, который <strong>запомнится на всю жизнь</strong>. Наши спектакли становятся <strong>главной изюминкой</strong> торжества, создавая волшебную историю о любви и приключениях, адаптированную специально для молодожёнов. Гости и молодая чета будут в восторге от <strong>уникального шоу</strong>, которое больше никогда не повторится.",
            features: [
                "Длительность: 15-60 минут",
                "Романтическая атмосфера",
                "Персонализированный сценарий",
                "Для 50-300 гостей"
            ],
            image: "public/activ/IMG_3672.JPG",
            alt: "Спектакль на свадьбе"
        },
        birthday: {
            badge: "Праздничные моменты",
            title: "Дни рождения и <em>юбилеи</em>",
            text: "День рождения — это праздник, когда хочется <strong>удивить и развеселить</strong> именинника и его гостей. Наши актёры создают <strong>забавные истории</strong>, непосредственно посвящённые юбиляру, используя его имя и личные детали. <strong>Весёлая и лёгкая</strong> атмосфера импровизационного спектакля заставит всех присутствующих смеяться и дарить хорошее настроение.",
            features: [
                "Длительность: 20-60 минут",
                "Истории про именинника",
                "Весёлая атмосфера",
                "Для 15-200 человек"
            ],
            image: "public/activ/IMG_3673.JPG",
            alt: "День рождения с Improv Lab"
        },
        conference: {
            badge: "Профессиональные события",
            title: "Конференции и <em>форумы</em>",
            text: "Длинные конференции требуют <strong>разнообразия и энергии</strong>. Мы <strong>добавляем развлечение</strong> и импульс вашему профессиональному событию, идеально вписываясь между серьёзными презентациями и сессиями. Наш <strong>интеллектуальный юмор</strong> порадует аудиторию и поможет переключить внимание перед следующей секцией программы.",
            features: [
                "Длительность: 15-60 минут",
                "Интеллектуальный юмор",
                "Адаптирование под тему",
                "Для 100-1000 человек"
            ],
            image: "public/activ/IMG_3852.jpg",
            alt: "Конференция Improv Lab"
        },
        gastro: {
            badge: "Гастрономический театр",
            title: "Gastro Improv - <em>уникальный формат</em>",
            text: "Это наш <strong>флагманский проект</strong>, где театр встречается с гастрономией. <strong>Актёры творят</strong> прямо на ваших глазах, а повара готовят блюда без рецепта, вдохновляясь развёрнутой на сцене историей. Это <strong>полностью уникальный опыт</strong>, где каждый элемент — театр, кулинария, музыка — создаёт единую гармоничную картину.",
            features: [
                "Длительность: 30-60 минут",
                "Синтез искусств",
                "Гастрономический опыт",
                "Для 30-150 человек"
            ],
            image: "public/activ/20250924-202433.JPG",
            alt: "Gastro Improv - театр и гастрономия"
        },
        custom: {
            badge: "Ваша идея",
            title: "Свой <em>уникальный формат</em>",
            text: "Не нашли подходящий формат из предложенных? Мы <strong>создадим импровизационный спектакль</strong> специально под вашу идею. От экспериментальных форм до <strong>полностью кастомизированных</strong> проектов — наша команда <strong>готова к любому творческому вызову</strong>. Обсудим все детали, вашу концепцию, тему и сюжет — и создадим театральное чудо.",
            features: [
                "Полная кастомизация",
                "Любая тематика",
                "Индивидуальный подход",
                "Согласуем все детали"
            ],
            image: "public/activ/IMG_2262-g.JPG",
            alt: "Кастомный формат спектакля"
        }
    };
    
    // Event button click handlers
    eventButtons.forEach(button => {
        button.addEventListener('click', () => {
            const eventType = button.getAttribute('data-event');
            const event = eventData[eventType];
            
            if (event) {
                showEventModal(event);
            }
        });
    });
    
    // Close modal handlers
    if (modalClose) {
        modalClose.addEventListener('click', closeEventModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-overlay')) {
                closeEventModal();
            }
        });
    }
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeEventModal();
        }
    });
    
    function showEventModal(event) {
        modalContent.innerHTML = `
            <article class="modal-event-item">
                <div class="modal-event-content">
                    <div class="modal-event-badge">${event.badge}</div>
                    <h3 class="modal-event-title">${event.title}</h3>
                    <p class="modal-event-text">${event.text}</p>
                    <ul class="modal-event-features">
                        ${event.features.map(feature => `<li><i class="fas fa-star"></i> ${feature}</li>`).join('')}
                    </ul>
                    <a href="/calendar" class="modal-booking-btn">
                        <i class="fas fa-calendar-check"></i> Перейти к бронированию
                    </a>
                </div>
                <div class="modal-event-image">
                    <img src="${event.image}" alt="${event.alt}" loading="lazy">
                </div>
            </article>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeEventModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Animated Title functionality
function initAnimatedTitle() {
    const titleElement = document.getElementById('animatedTitle');
    
    if (!titleElement) return;
    
    const titles = [
        "Готовы импровизировать?",
        "Improv Lab на Вашем мероприятии!",
        "Какое событие планируете?"
    ];
    
    let currentIndex = 0;
    
    function changeTitle() {
        // Fade out
        titleElement.classList.add('fade-out');
        
        setTimeout(() => {
            // Change text
            currentIndex = (currentIndex + 1) % titles.length;
            titleElement.textContent = titles[currentIndex];
            
            // Fade in
            titleElement.classList.remove('fade-out');
        }, 700); // Half of transition duration
    }
    
    // Start animation after initial load
    setTimeout(() => {
        setInterval(changeTitle, 3000); // Change every 3 seconds
    }, 1000); // Start after 1 second
}

// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const header = document.querySelector('.header');
const navLinksElements = document.querySelectorAll('.nav-link');

// Mobile Navigation Toggle
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
        const expanded = navToggle.classList.contains('active');
        navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        navToggle.setAttribute('aria-label', expanded ? 'Закрыть меню' : 'Открыть меню');
    });
    // Toggle with keyboard (Enter/Space)
    navToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navToggle.click();
        }
    });
}

// Close mobile menu when clicking on a link
navLinksElements.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Header scroll effect (disabled - header is not fixed anymore)
// window.addEventListener('scroll', () => {
//     if (window.scrollY > 100) {
//         header.classList.add('scrolled');
//     } else {
//         header.classList.remove('scrolled');
//     }
// });

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .event-card, .social-link, .about-content, .cta-card');
    animateElements.forEach(el => observer.observe(el));
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    const heroParticles = document.querySelector('.hero-particles');
    
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    if (heroParticles) {
        heroParticles.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
// window.addEventListener('load', () => {
//     const heroTitle = document.querySelector('.hero-title');
//     if (heroTitle) {
//         const originalText = heroTitle.textContent;
//         typeWriter(heroTitle, originalText, 50);
//     }
// });

// Interactive cards hover effects
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.feature-card, .event-card, .social-link');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add subtle glow effect
            card.style.filter = 'brightness(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.filter = 'brightness(1)';
        });
    });
});

// Interactive improv cards with click effects
document.addEventListener('DOMContentLoaded', () => {
    const improvCards = document.querySelectorAll('.improv-card');
    
    improvCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'ripple-effect';
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                pointer-events: none;
                width: 100px;
                height: 100px;
                left: 50%;
                top: 50%;
                margin-left: -50px;
                margin-top: -50px;
            `;
            
            card.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Add bounce animation
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = `floating 6s ease-in-out infinite, bounce 0.5s ease`;
            }, 10);
            
            setTimeout(() => {
                card.style.animation = `floating 6s ease-in-out infinite`;
            }, 500);
        });
    });
});

// Button click animations
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
`;
document.head.appendChild(style);

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
        }
    }
    
    updateCounter();
}

// Initialize counter animation when stats come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            const statCards = entry.target.querySelectorAll('.stat');
            
            statCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.animation = 'bounce 0.6s ease';
                    setTimeout(() => {
                        card.style.animation = '';
                    }, 600);
                }, index * 200);
            });
            
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent);
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

// Floating animation for improv cards
function createFloatingAnimation() {
    const cards = document.querySelectorAll('.improv-card');
    
    cards.forEach((card, index) => {
        const delay = index * 0.5;
        const duration = 3 + Math.random() * 2;
        
        card.style.animation = `floating ${duration}s ease-in-out infinite`;
        card.style.animationDelay = `${delay}s`;
    });
}

// Initialize floating animations
document.addEventListener('DOMContentLoaded', createFloatingAnimation);

// Social media link tracking (optional)
document.addEventListener('DOMContentLoaded', () => {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', () => {
            const platform = link.classList.contains('telegram') ? 'Telegram' :
                           link.classList.contains('instagram') ? 'Instagram' :
                           link.classList.contains('vk') ? 'VKontakte' : 'Social';
            
            console.log(`Clicked on ${platform} link`);
            // Here you could add analytics tracking
        });
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Remove any loading spinners or show content
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(el => el.style.display = 'none');
});

// Error handling for external links
document.addEventListener('DOMContentLoaded', () => {
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    
    externalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Optional: Add confirmation for external links
            // if (!confirm('Вы покидаете сайт. Продолжить?')) {
            //     e.preventDefault();
            // }
        });
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    }
    
    // Enter key activates focused elements
    if (e.key === 'Enter') {
        const focused = document.activeElement;
        if (focused && focused.classList.contains('nav-link')) {
            focused.click();
        }
    }
});

// Performance optimization: Lazy load images (if any are added later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.addEventListener('DOMContentLoaded', () => {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    });
}

// Add touch support for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe up - could be used for navigation
            console.log('Swipe up detected');
        } else {
            // Swipe down
            console.log('Swipe down detected');
        }
    }
}

// Interactive button effects
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px) scale(1.05)';
            button.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
            button.style.boxShadow = '';
        });
        
        button.addEventListener('mousedown', () => {
            button.style.transform = 'translateY(0) scale(0.98)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = 'translateY(-2px) scale(1.05)';
        });
    });
});

// Smooth scrolling for sections (removed parallax to fix overlap issues)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    // Only apply subtle parallax to hero background elements
    if (hero) {
        const heroBackground = hero.querySelector('.hero-background');
        const heroShapes = hero.querySelector('.hero-shapes');
        
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        
        if (heroShapes) {
            heroShapes.style.transform = `translateY(${scrolled * 0.2}px)`;
        }
    }
});

// Footer navigation interactions
document.addEventListener('DOMContentLoaded', () => {
    const navCategories = document.querySelectorAll('.nav-category');
    const subcategories = document.querySelectorAll('.nav-subcategories');
    
    navCategories.forEach(category => {
        const button = category.querySelector('.nav-category-button');
        const subcats = category.querySelector('.nav-subcategories');
        
        if (button && subcats) {
            button.addEventListener('click', () => {
                // Toggle subcategories visibility
                subcats.style.maxHeight = subcats.style.maxHeight ? null : subcats.scrollHeight + 'px';
                subcats.style.opacity = subcats.style.opacity === '0' ? '1' : '0';
                
                // Add active state
                button.classList.toggle('active');
            });
            
            // Initialize with hidden subcategories
            subcats.style.maxHeight = '0';
            subcats.style.opacity = '0';
            subcats.style.overflow = 'hidden';
            subcats.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
        }
    });
});

// Add glow effect to contact button
document.addEventListener('DOMContentLoaded', () => {
    const contactButton = document.querySelector('.contact-button');
    
    if (contactButton) {
        contactButton.addEventListener('mouseenter', () => {
            contactButton.style.boxShadow = '0 8px 25px rgba(220, 38, 38, 0.4), 0 0 20px rgba(220, 38, 38, 0.3)';
        });
        
        contactButton.addEventListener('mouseleave', () => {
            contactButton.style.boxShadow = '0 4px 15px rgba(220, 38, 38, 0.3)';
        });
    }
});

// Gallery interactions
document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            // Add subtle glow effect
            item.style.filter = 'brightness(1.1)';
            
            // Add staggered animation delay
            setTimeout(() => {
                item.style.transform = 'translateY(-5px) scale(1.02)';
            }, index * 50);
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.filter = 'brightness(1)';
            item.style.transform = 'translateY(0) scale(1)';
        });
        
        item.addEventListener('click', () => {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                pointer-events: none;
                width: 100px;
                height: 100px;
                left: 50%;
                top: 50%;
                margin-left: -50px;
                margin-top: -50px;
                z-index: 10;
            `;
            
            item.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Photo Modal functionality
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    const modalClose = document.getElementById('modalClose');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const eventPhotos = document.querySelectorAll('.event-photo');
    const heroGalleryPhotos = document.querySelectorAll('.hero-gallery img');
    
    let currentPhotoIndex = 0;
    let currentPhotos = [];
    
    // Initialize photo modal
    function initPhotoModal() {
        if (!modal || !modalImage || !modalClose) return;
        
        // Close modal handlers
        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-overlay')) {
                closeModal();
            }
        });
        
        // Navigation handlers
        if (prevBtn) prevBtn.addEventListener('click', showPreviousPhoto);
        if (nextBtn) nextBtn.addEventListener('click', showNextPhoto);
        
        // Keyboard navigation
        document.addEventListener('keydown', handleKeydown);
        
        // Handle window resize
        window.addEventListener('resize', handleWindowResize);
    }
    
    // Handle keyboard navigation
    function handleKeydown(e) {
        if (!modal.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                showPreviousPhoto();
                break;
            case 'ArrowRight':
                showNextPhoto();
                break;
        }
    }
    
    // Handle window resize
    function handleWindowResize() {
        if (!modal.classList.contains('active')) return;
        
        // Reload current photo to adjust size
        if (currentPhotos.length > 0) {
            loadPhoto(currentPhotoIndex);
        }
    }
    
    // Open modal with specific photo
    function openModal(photoElement) {
        if (!modal || !modalImage) return;
        
        // Check if photo is from event card or hero gallery
        const eventCard = photoElement.closest('.event-card');
        const heroGallery = photoElement.closest('.hero-gallery');
        
        if (eventCard) {
            // Get all photos from the same event card
            currentPhotos = Array.from(eventCard.querySelectorAll('.event-photo'));
        } else if (heroGallery) {
            // Get all photos from hero gallery
            currentPhotos = Array.from(heroGallery.querySelectorAll('img'));
        } else {
            return;
        }
        
        currentPhotoIndex = currentPhotos.indexOf(photoElement);
        
        if (currentPhotoIndex === -1) return;
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Load current photo
        loadPhoto(currentPhotoIndex);
        
        // Update navigation buttons
        updateNavigationButtons();
    }
    
    // Close modal
    function closeModal() {
        if (!modal) return;
        
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear image source to free memory
        if (modalImage) {
            modalImage.src = '';
        }
    }
    
    // Load photo by index
    function loadPhoto(index) {
        if (!modalImage || !currentPhotos[index]) return;
        
        const photo = currentPhotos[index];
        const fullImageSrc = photo.dataset.full || photo.src;
        
        // Add loading effect
        modalImage.style.opacity = '0';
        modalImage.style.transform = 'scale(0.9)';
        
        // Load image
        const img = new Image();
        img.onload = () => {
            modalImage.src = fullImageSrc;
            
            // Ensure image fits within viewport
            const maxWidth = window.innerWidth * 0.95;
            const maxHeight = window.innerHeight * 0.95;
            
            if (img.width > maxWidth || img.height > maxHeight) {
                const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
                modalImage.style.maxWidth = (img.width * ratio) + 'px';
                modalImage.style.maxHeight = (img.height * ratio) + 'px';
            } else {
                modalImage.style.maxWidth = img.width + 'px';
                modalImage.style.maxHeight = img.height + 'px';
            }
            
            // Animate in
            setTimeout(() => {
                modalImage.style.opacity = '1';
                modalImage.style.transform = 'scale(1)';
            }, 50);
        };
        img.onerror = () => {
            modalImage.src = photo.src; // Fallback to original src
            modalImage.style.opacity = '1';
            modalImage.style.transform = 'scale(1)';
        };
        img.src = fullImageSrc;
    }
    
    // Show previous photo
    function showPreviousPhoto() {
        if (currentPhotos.length === 0) return;
        
        currentPhotoIndex = (currentPhotoIndex - 1 + currentPhotos.length) % currentPhotos.length;
        loadPhoto(currentPhotoIndex);
        updateNavigationButtons();
    }
    
    // Show next photo
    function showNextPhoto() {
        if (currentPhotos.length === 0) return;
        
        currentPhotoIndex = (currentPhotoIndex + 1) % currentPhotos.length;
        loadPhoto(currentPhotoIndex);
        updateNavigationButtons();
    }
    
    // Update navigation buttons visibility
    function updateNavigationButtons() {
        if (!prevBtn || !nextBtn) return;
        
        // Show/hide navigation buttons based on number of photos
        if (currentPhotos.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
        }
    }
    
    // Add click handlers to all event photos
    eventPhotos.forEach(photo => {
        photo.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(photo);
        });
        
        // Add keyboard support
        photo.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(photo);
            }
        });
        
        // Make photos focusable
        photo.setAttribute('tabindex', '0');
        photo.setAttribute('role', 'button');
        photo.setAttribute('aria-label', 'Открыть фото в полном размере');
    });
    
    // Add click handlers to all hero gallery photos
    heroGalleryPhotos.forEach(photo => {
        photo.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(photo);
        });
        
        // Add keyboard support
        photo.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(photo);
            }
        });
        
        // Make photos focusable
        photo.setAttribute('tabindex', '0');
        photo.setAttribute('role', 'button');
        photo.setAttribute('aria-label', 'Открыть фото в полном размере');
    });
    
    // Initialize modal
    initPhotoModal();
});

// Console welcome message
console.log(`
🎭 Добро пожаловать в Improv Lab! 🎭
Сайт создан с любовью к импровизации и творчеству.
Присоединяйтесь к нашему сообществу: @Improv_labbot
`);

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// Scroll to Top Button
document.addEventListener('DOMContentLoaded', () => {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        // Показываем/скрываем кнопку при скролле
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
        
        // Скролл наверх при клике
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});


// ---- Team Arc Swiper ----
document.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelector('.arcSwiper');
  if (!el) return;
  const swiper = new Swiper('.arcSwiper', {
    slidesPerView: 'auto',
    centeredSlides: true,
    loop: true,
    spaceBetween: 34,
    speed: 900,
    grabCursor: true,
    autoplay: { delay: 2400, disableOnInteraction: false },
    effect: 'coverflow',
    coverflowEffect: {
      rotate: 7,      // лёгкий наклон по Y
      stretch: 0,
      depth: 180,
      modifier: 1.05,
      slideShadows: false,
    },
    pagination: { el: '.curved-carousel .swiper-pagination', clickable: true },
    on: {
      resize(sw) { sw.update(); }
    }
  });
});

// Gallery Image Modal functionality for all sections
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    const modalClose = document.getElementById('modalClose');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let currentGalleryImages = [];
    let currentImageIndex = 0;
    
    // Initialize all gallery functionality
    function initializeGallery(gallerySelector, imageSelector) {
        const gallery = document.querySelector(gallerySelector);
        if (!gallery) return;
        
        const images = gallery.querySelectorAll(imageSelector);
        images.forEach((img, index) => {
            img.addEventListener('click', () => {
                // Get all images from the same gallery
                currentGalleryImages = Array.from(images);
                currentImageIndex = currentGalleryImages.indexOf(img);
                
                openGalleryModal(img);
            });
        });
    }
    
    // Initialize different galleries
    initializeGallery('.hero-gallery', 'img');
    initializeGallery('.about-gallery', '.tile img');
    initializeGallery('.gastro-gallery-inline', '.gallery-image');
    initializeGallery('.masquerade-gallery-inline', '.gallery-image');
    
    // Navigation handlers
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentGalleryImages.length > 0) {
                currentImageIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
                updateModalImage();
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (currentGalleryImages.length > 0) {
                currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
                updateModalImage();
            }
        });
    }
    
    // Close modal handlers
    if (modalClose) {
        modalClose.addEventListener('click', closeGalleryModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-overlay')) {
                closeGalleryModal();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal && modal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeGalleryModal();
            } else if (e.key === 'ArrowLeft') {
                prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                nextBtn.click();
            }
        }
    });
    
    function openGalleryModal(img) {
        if (!modal || !modalImage) return;
        
        modalImage.src = img.dataset.src || img.src;
        modalImage.alt = img.alt;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateModalImage();
    }
    
    function closeGalleryModal() {
        if (!modal) return;
        
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function updateModalImage() {
        if (currentGalleryImages.length > 0 && currentImageIndex >= 0 && modalImage) {
            const currentImg = currentGalleryImages[currentImageIndex];
            modalImage.src = currentImg.dataset.src || currentImg.src;
            modalImage.alt = currentImg.alt;
        }
    }
});

// Theme switching based on scroll position
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const gastroSection = document.getElementById('gastro-improv');
    const masqueradeSection = document.getElementById('masquerade');
    
    let isScrolling = false;
    let scrollTimeout;
    
    function updateTheme() {
        if (!gastroSection || !masqueradeSection) return;
        
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const gastroTop = gastroSection.offsetTop;
        const gastroBottom = gastroTop + gastroSection.offsetHeight;
        const masqueradeTop = masqueradeSection.offsetTop;
        const masqueradeBottom = masqueradeTop + masqueradeSection.offsetHeight;
        
        // Определяем, какая секция находится в центре экрана
        const gastroInView = scrollY + windowHeight / 2 >= gastroTop && 
                           scrollY + windowHeight / 2 <= gastroBottom;
        const masqueradeInView = scrollY + windowHeight / 2 >= masqueradeTop && 
                               scrollY + windowHeight / 2 <= masqueradeBottom;
        
        // Удаляем все темы
        body.classList.remove('gastro-theme', 'masquerade-theme');
        
        // Применяем нужную тему
        if (gastroInView) {
            body.classList.add('gastro-theme');
        } else if (masqueradeInView) {
            body.classList.add('masquerade-theme');
        }
    }
    
    function handleScroll() {
        if (!isScrolling) {
            requestAnimationFrame(() => {
                updateTheme();
                isScrolling = false;
            });
            isScrolling = true;
        }
        
        // Очищаем предыдущий таймер
        clearTimeout(scrollTimeout);
        
        // Устанавливаем новый таймер для дебаунса
        scrollTimeout = setTimeout(() => {
            updateTheme();
        }, 100);
    }
    
    // Обработчик скролла
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Вызываем функцию при загрузке страницы
    updateTheme();
});

// Video Modal functionality
document.addEventListener('DOMContentLoaded', () => {
    const showVideoBtn = document.getElementById('showVideoBtn');
    const videoModal = document.getElementById('videoModal');
    const videoModalClose = document.getElementById('videoModalClose');
    const modalVideo = document.getElementById('modalVideo');
    
    if (showVideoBtn && videoModal && videoModalClose && modalVideo) {
        // Открытие модального окна
        showVideoBtn.addEventListener('click', () => {
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            // Автоматический запуск видео со звуком
            modalVideo.muted = false;
            modalVideo.play();
        });
        
        // Закрытие модального окна
        videoModalClose.addEventListener('click', () => {
            videoModal.classList.remove('active');
            document.body.style.overflow = '';
            modalVideo.pause();
            modalVideo.currentTime = 0;
        });
        
        // Закрытие при клике вне видео
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal || e.target.classList.contains('modal-overlay')) {
                videoModal.classList.remove('active');
                document.body.style.overflow = '';
                modalVideo.pause();
                modalVideo.currentTime = 0;
            }
        });
        
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                videoModal.classList.remove('active');
                document.body.style.overflow = '';
                modalVideo.pause();
                modalVideo.currentTime = 0;
            }
        });
    }
});
