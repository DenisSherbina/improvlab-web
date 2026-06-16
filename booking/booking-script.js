// Booking Form Logic
document.addEventListener('DOMContentLoaded', () => {
    setupForm();
    setupScrollToTop();
    setupGenreCheckboxes();
});

// Setup Form
function setupForm() {
    const form = document.getElementById('bookingForm');
    const messageField = document.getElementById('message');
    
    // Set default message
    updateMessagePreview();

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitForm(form);
    });

    // Update message when genres change
    const genreCheckboxes = document.querySelectorAll('.genre-checkbox');
    genreCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateMessagePreview();
        });
    });

    // Update message when user types
    messageField.addEventListener('input', () => {
        // Don't overwrite if user is typing
    });
}

// Update message preview with selected genres
function updateMessagePreview() {
    const messageField = document.getElementById('message');
    const selectedGenres = getSelectedGenres();
    
    let baseMessage = 'Здравствуйте! Я заинтересовался вашим искусством и хотел бы узнать детали заказа спектакля для моего события.';
    
    if (selectedGenres.length > 0) {
        baseMessage += `\n\nОсобенно интересуют: ${selectedGenres.join(', ')}.`;
    }

    // If message is empty or is the default message, update it
    if (!messageField.value.trim() || isDefaultMessage(messageField.value)) {
        messageField.value = baseMessage;
    } else if (selectedGenres.length === 0) {
        // If genres cleared, only keep base message if it had genres before
        if (messageField.value.includes('Особенно интересуют:')) {
            messageField.value = baseMessage;
        }
    }
}

// Check if message is the default
function isDefaultMessage(text) {
    return text.includes('Здравствуйте! Я заинтересовался вашим искусством') || text.trim() === '';
}

// Get selected genres
function getSelectedGenres() {
    const genreCheckboxes = document.querySelectorAll('.genre-checkbox:checked');
    const genreLabels = {
        'comedy': 'коммедия',
        'drama': 'драма',
        'thriller': 'триллер',
        'detective': 'детектив',
        'historical': 'исторический театр',
        'contemporary': 'современный театр',
        'romantic': 'романтический театр',
        'adventure': 'приключения'
    };

    return Array.from(genreCheckboxes).map(cb => genreLabels[cb.value] || cb.value);
}

// Submit Form
function submitForm(form) {
    // Validate form
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();

    // Check if name is filled
    if (!name) {
        showNotification('❌ Пожалуйста, укажите ваше имя', 'error');
        return;
    }

    // Check if at least phone or email is provided
    if ((!phone || phone === '') && (!email || email === '')) {
        showNotification('❌ Пожалуйста, укажите хотя бы один контакт: телефон или email', 'error');
        return;
    }

    // Validate email if provided
    if (email && !isValidEmail(email)) {
        showNotification('❌ Пожалуйста, укажите корректный email', 'error');
        return;
    }

    // Подготовка данных для API
    const typeSelect = document.getElementById('event-type');
    const typeLabel = (typeSelect.selectedOptions[0] && typeSelect.selectedOptions[0].textContent) || typeSelect.value || '';
    const dateRaw = document.getElementById('event-date').value; // YYYY-MM-DD

    const payload = {
        name: name,
        phone: phone || '',
        email: email || '',
        eventType: normalizeEventType(typeLabel),
        eventDate: dateRaw ? formatDateRu(dateRaw) : '',
        guests: (document.getElementById('guests-count').value || '').toString(),
        message: document.getElementById('message').value
    };

    const submitBtn = form.querySelector('button[type=\"submit\"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = '.7'; }

    fetch('https://admin.improvlab.ru/api/forms/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(async (res) => {
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(text || `Ошибка ${res.status}`);
        }
        return res.json().catch(() => ({}));
    })
    .then(() => {
        showNotification('✅ Спасибо! Заявка успешно отправлена.', 'success');
        form.reset();
        updateMessagePreview();
    })
    .catch((err) => {
        console.error('Contact form error:', err);
        showNotification('❌ Не удалось отправить заявку. Попробуйте позже.', 'error');
    })
    .finally(() => {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = '1'; }
    });
}

// Validate email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Форматирование даты YYYY-MM-DD -> DD.MM.YYYY
function formatDateRu(yyyyMmDd) {
    const [y, m, d] = yyyyMmDd.split('-');
    if (!y || !m || !d) return '';
    return `${d.padStart(2,'0')}.${m.padStart(2,'0')}.${y}`;
}

// Нормализуем тип мероприятия в короткое русское название
function normalizeEventType(label) {
    const map = {
        'Корпоративное мероприятие': 'Корпоратив',
        'Свадьба': 'Свадьба',
        'День рождения / Юбилей': 'День рождения',
        'Конференция / Форум': 'Конференция',
        'Gastro Improv': 'Gastro Improv',
        'Свой формат': 'Другое'
    };
    return map[label] || label;
}
// Setup Genre Checkboxes
function setupGenreCheckboxes() {
    const genreCheckboxes = document.querySelectorAll('.genre-checkbox');
    
    genreCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const label = e.target.nextElementSibling;
            if (e.target.checked) {
                label.style.color = '#0d4227';
                label.style.fontWeight = '700';
            } else {
                label.style.color = '#333';
                label.style.fontWeight = '400';
            }
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

// Show Notification
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const bgColor = type === 'error' ? '#d32f2f' : type === 'success' ? '#0d4227' : '#1976d2';
    
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: ${bgColor};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-family: 'Oswald', sans-serif;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        word-wrap: break-word;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3500);
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

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});


