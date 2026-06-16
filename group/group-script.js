// Group page logic: navigation, scroll-to-top, signup form
document.addEventListener('DOMContentLoaded', () => {
  setupMobileNav();
  setupScrollToTop();
  setupGroupForm();
  setupGroupGallery();
});

function setupMobileNav() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!navToggle || !navLinks) return;

  const setExpanded = (expanded) => navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  setExpanded(false);

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
    setExpanded(navToggle.classList.contains('active'));
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
      setExpanded(false);
    });
  });
}

function setupScrollToTop() {
  const btn = document.getElementById('scrollToTop');
  if (!btn) return;

  const toggle = () => {
    if (window.pageYOffset > 300) btn.classList.add('visible');
    else btn.classList.remove('visible');
  };
  toggle();
  window.addEventListener('scroll', toggle);
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function setupGroupForm() {
  const form = document.getElementById('groupForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitGroupForm(form);
  });
}

function submitGroupForm(form) {
  const name = getValue('name');
  const phone = getValue('phone');
  const level = getValue('level');
  const preferred = getValue('preferred');
  const message = getValue('message');

  if (!name) {
    showNotification('❌ Пожалуйста, укажите ваше имя', 'error');
    return;
  }

  if (!phone) {
    showNotification('❌ Укажите номер телефона для связи', 'error');
    return;
  }

  const fullMessage = [
    'Заявка: Набор новой регулярной группы по импровизации.',
    '',
    `Уровень: ${level || '—'}`,
    `Предпочтения: ${preferred || '—'}`,
    '',
    message ? `Комментарий: ${message}` : 'Комментарий: —',
    '',
    'Расписание блока:',
    '13.02, пятница 19:00–21:00',
    '17.02, вторник 19:00–21:00',
    '27.02, пятница 19:00–21:00',
    '06.03, пятница 19:00–21:00',
    '',
    'Стоимость блока: 12000 ₽'
  ].join('\n');

  const payload = {
    name,
    phone,
    eventType: 'Набор регулярной группы по импровизации',
    eventDate: '',
    guests: '',
    message: fullMessage
  };

  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.75';
  }

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
    })
    .catch((err) => {
      console.error('Group form error:', err);
      showNotification('❌ Не удалось отправить заявку. Попробуйте позже.', 'error');
    })
    .finally(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }
    });
}

function getValue(id) {
  const el = document.getElementById(id);
  return (el && typeof el.value === 'string') ? el.value.trim() : '';
}

function setupGroupGallery() {
  const modal = document.getElementById('groupPhotoModal');
  const modalImage = document.getElementById('groupModalImage');
  const modalClose = document.getElementById('groupModalClose');
  const overlay = modal?.querySelector('.group-modal-overlay');
  const images = document.querySelectorAll('.group-gallery-img');

  if (!modal || !modalImage || !images.length) return;

  const openModal = (src) => {
    modalImage.src = src;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  images.forEach((img) => {
    img.addEventListener('click', () => {
      const src = img.dataset.full || img.src;
      openModal(src);
    });
    img.style.cursor = 'pointer';
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function showNotification(message, type = 'info') {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  const bgColor = type === 'error' ? '#d32f2f' : type === 'success' ? '#0d4227' : '#1976d2';
  notification.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: ${bgColor};
    color: white;
    padding: 14px 18px;
    border-radius: 10px;
    z-index: 1000;
    font-family: 'Oswald', sans-serif;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
    max-width: 420px;
    word-wrap: break-word;
    transition: opacity 0.25s ease, transform 0.25s ease;
  `;

  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(8px)';
    setTimeout(() => notification.remove(), 250);
  }, 3200);
}

