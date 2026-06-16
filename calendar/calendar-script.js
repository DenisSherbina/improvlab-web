// КОНСТАНТЫ
const OPEN_TIME_MINUTES = 10 * 60;    // 10:00
const CLOSE_TIME_MINUTES = 25 * 60;   // 01:00 (следующего дня => 24+1)
const NIGHT_TARIFF_START = 22 * 60;   // 22:00
const MIN_BREAK_MINUTES = 120;        // 2 часа

// Бутафорские данные: выходные и события на месяц вперёд
const mockData = generateMockData();

function generateMockData() {
    const today = new Date();
    today.setHours(0,0,0,0);
    const end = new Date(today);
    end.setMonth(end.getMonth() + 1);

    const daysOff = new Set();
    const eventsByDate = {}; // 'YYYY-MM-DD' => [{start,end,type}]

    // случайные выходные (6 значений)
    for (let i = 0; i < 6; i++) {
        const d = new Date(today.getTime() + Math.random() * (end - today));
        d.setHours(0,0,0,0);
        daysOff.add(toKey(d));
    }

    // пара дней с мероприятиями
    const example1 = new Date(today.getTime() + 5 * 24*60*60*1000);
    example1.setHours(0,0,0,0);
    eventsByDate[toKey(example1)] = [
        { start: minutes(18, 0), end: minutes(20, 0), type: 'corporate' }
    ];

    const example2 = new Date(today.getTime() + 12 * 24*60*60*1000);
    example2.setHours(0,0,0,0);
    eventsByDate[toKey(example2)] = [
        { start: minutes(12, 0), end: minutes(14, 0), type: 'wedding' },
        { start: minutes(16, 30), end: minutes(18, 0), type: 'birthday' }
    ];

    return { daysOff, eventsByDate, today, end };
}

function minutes(h, m) { return h*60 + (m||0); }
function toKey(d) {
    // Локальное форматирование YYYY-MM-DD (без смещения UTC)
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,'0');
    const day = String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
}

// DOM элементы
const gridEl = document.getElementById('calendarGrid');
const monthEl = document.getElementById('calendarMonth');
const prevBtn = document.getElementById('prevMonth');
const nextBtn = document.getElementById('nextMonth');
const selectedDateEl = document.getElementById('selectedDate');
const startTimeEl = document.getElementById('startTime');
const endTimeEl = document.getElementById('endTime');
const bookingForm = document.getElementById('bookingForm');

let currentMonthStart = startOfMonth(mockData.today);
let selectedDateKey = '';

init();

function init() {
    renderCalendar(currentMonthStart);
    prevBtn.addEventListener('click', () => changeMonth(-1));
    nextBtn.addEventListener('click', () => changeMonth(1));

    bookingForm.addEventListener('submit', onSubmitBooking);

    // Автозаполнение окончания на +1 час при выборе начала
    startTimeEl.addEventListener('change', onStartTimeChange);

    startTimeEl.value = '10:00';
    endTimeEl.value = '12:00';
}

function onStartTimeChange() {
    if (!startTimeEl.value) return;
    const sMin = parseTimeToMinutes(startTimeEl.value);
    let newEnd = sMin + 60; // +1 час
    if (newEnd > CLOSE_TIME_MINUTES) newEnd = CLOSE_TIME_MINUTES; // не позже 01:00

    // Устанавливаем, но пользователь всегда может изменить после
    endTimeEl.value = toTimeStr(newEnd);
}

function changeMonth(delta) {
    const candidate = new Date(currentMonthStart);
    candidate.setMonth(candidate.getMonth() + delta);

    // Только месяц вперёд: запрещаем листать вперёд дальше end и назад до прошлого
    const thisMonth = startOfMonth(mockData.today);
    const nextMonth = startOfMonth(mockData.end);

    if (candidate < thisMonth) return;
    if (candidate > nextMonth) return;

    currentMonthStart = candidate;
    renderCalendar(currentMonthStart);
}

function renderCalendar(monthStart) {
    // заголовок месяца
    const monthNames = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
    monthEl.textContent = `${monthNames[monthStart.getMonth()]} ${monthStart.getFullYear()}`;

    gridEl.innerHTML = '';

    // Шапка дней недели
    const weekdays = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
    weekdays.forEach(w => {
        const h = document.createElement('div');
        h.className = 'calendar-cell header';
        h.style.minHeight = 'auto';
        h.style.background = 'transparent';
        h.style.border = 'none';
        h.innerHTML = `<div class="date" style="opacity:.8">${w}</div>`;
        gridEl.appendChild(h);
    });

    const firstDayIdx = (monthStart.getDay() + 6) % 7; // Пн=0
    const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth()+1, 0).getDate();

    // пустые до первого
    for (let i = 0; i < firstDayIdx; i++) {
        const empty = document.createElement('div');
        empty.className = 'calendar-cell empty';
        empty.style.minHeight = 'auto';
        empty.style.background = 'transparent';
        empty.style.border = 'none';
        gridEl.appendChild(empty);
    }

    // дни
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), d);
        date.setHours(0,0,0,0);
        const key = toKey(date);
        const { daysOff, eventsByDate, today, end } = mockData;

        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'calendar-cell';

        const isPast = date < today;
        const isAfterRange = date > end;
        const isDayOff = daysOff.has(key);
        const events = eventsByDate[key] || [];

        let stateClass = 'free';
        if (isDayOff) stateClass = 'busy';
        else if (events.length > 0) stateClass = 'partial';

        if (isPast || isAfterRange) {
            cell.classList.add('disabled');
            cell.disabled = true;
        }
        cell.classList.add(stateClass);

        const statusBadges = events.map(e => badgeForEvent(e)).join('');
        cell.innerHTML = `
            <div class="date">${d}</div>
            <div class="meta">${labelForState(stateClass)}</div>
            <div class="badges">${statusBadges}</div>
        `;

        if (!cell.disabled && stateClass !== 'busy') {
            cell.addEventListener('click', () => selectDate(key, cell));
        }

        gridEl.appendChild(cell);
    }

    // кнопки навигации доступность
    const thisMonth = startOfMonth(mockData.today);
    const nextMonth = startOfMonth(mockData.end);
    prevBtn.disabled = startOfMonth(currentMonthStart) <= thisMonth;
    nextBtn.disabled = startOfMonth(currentMonthStart) >= nextMonth;
}

function labelForState(state) {
    switch (state) {
        case 'free': return 'Доступно';
        case 'partial': return 'Частично занято';
        case 'busy': return 'Недоступно';
        default: return '';
    }
}

function badgeForEvent(e) {
    const s = toTimeStr(e.start);
    const en = toTimeStr(e.end);
    return `<span class="slot-badge"><i class="dot dot-busy"></i>${s}–${en}</span>`;
}

function toTimeStr(totalMin) {
    // учитываем 01:00 как 25:00
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    const hh = (h % 24).toString().padStart(2, '0');
    const mm = m.toString().padStart(2, '0');
    return `${hh}:${mm}`;
}

function selectDate(key, cell) {
    // снять прошлый выбор
    gridEl.querySelectorAll('.calendar-cell.selected').forEach(n => n.classList.remove('selected'));
    cell.classList.add('selected');

    selectedDateKey = key;
    selectedDateEl.value = key;
}

function onSubmitBooking(e) {
    e.preventDefault();
    if (!selectedDateKey) { notify('Выберите дату в календаре.', 'error'); return; }

    const sVal = startTimeEl.value;
    const eVal = endTimeEl.value;
    const name = document.getElementById('contactName').value.trim();
    const contact = document.getElementById('contactPhone').value.trim();

    if (!name || !contact) { notify('Укажите имя и контакт для связи.', 'error'); return; }
    if (!sVal || !eVal) { notify('Укажите время начала и окончания.', 'error'); return; }

    const sMin = parseTimeToMinutes(sVal);
    const eMinRaw = parseTimeToMinutes(eVal);
    // поддержка 00:xx и 01:00 как след. сутки
    const eMin = eMinRaw < OPEN_TIME_MINUTES ? eMinRaw + 24*60 : eMinRaw;

    if (sMin < OPEN_TIME_MINUTES || sMin >= CLOSE_TIME_MINUTES) {
        notify('Начало вне рабочего времени (10:00–01:00).', 'error'); return;
    }
    if (eMin <= sMin) { notify('Окончание должно быть позже начала.', 'error'); return; }
    if (eMin > CLOSE_TIME_MINUTES) { notify('Окончание позже 01:00.', 'error'); return; }

    // Проверка пересечений и паузы 2 часа
    const todaysEvents = mockData.eventsByDate[selectedDateKey] || [];
    if (!respectBreaks(todaysEvents, sMin, eMin)) {
        notify('Между мероприятиями должна быть пауза минимум 2 часа.', 'error');
        return;
    }

    const nightTariff = sMin >= NIGHT_TARIFF_START || eMin > NIGHT_TARIFF_START;

    // Подготовка данных для API
    const eventTypeSelect = document.getElementById('eventType');
    const eventTypeLabel = (eventTypeSelect.selectedOptions[0] && eventTypeSelect.selectedOptions[0].textContent) || eventTypeSelect.value;

    const payload = {
        date: formatDateRuFromKey(selectedDateKey),
        startTime: toTimeStr(sMin),
        endTime: toTimeStr(eMin),
        eventType: eventTypeLabel,
        comment: document.getElementById('comment').value,
        name,
        contact
    };

    const submitBtn = document.getElementById('submitBooking');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = '.7'; }

    fetch('https://admin.improvlab.ru/api/forms/booking', {
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
        notify(nightTariff ? 'Заявка отправлена! Внимание: вечерний тариф применяется.' : 'Заявка отправлена! Мы свяжемся с вами.', 'success');
        bookingForm.reset();
        selectedDateEl.value = selectedDateKey; // сохраняем выбранную дату
    })
    .catch((err) => {
        console.error('Booking form error:', err);
        notify('Не удалось отправить запрос. Попробуйте позже.', 'error');
    })
    .finally(() => {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = '1'; }
    });
}

function parseTimeToMinutes(val) {
    const [hh, mm] = val.split(':').map(Number);
    return hh*60 + mm;
}

function respectBreaks(events, s, e) {
    // сортируем существующие
    const list = [...events, { start: s, end: e }].sort((a,b) => a.start - b.start);
    for (let i = 1; i < list.length; i++) {
        const prev = list[i-1];
        const cur = list[i];
        // Пересечение
        if (cur.start < prev.end) return false;
        // Пауза минимум 2 часа
        if (cur.start - prev.end < MIN_BREAK_MINUTES) return false;
    }
    return true;
}

function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }

function formatDateRuFromKey(key) {
    // key: YYYY-MM-DD -> DD.MM.YYYY
    const [y,m,d] = key.split('-');
    if (!y || !m || !d) return key;
    return `${d.padStart(2,'0')}.${m.padStart(2,'0')}.${y}`;
}

function notify(message, type) {
    const old = document.querySelector('.notification');
    if (old) old.remove();
    const n = document.createElement('div');
    n.className = `notification ${type}`;
    n.textContent = message;
    Object.assign(n.style, {
        position:'fixed', bottom:'24px', right:'24px', zIndex:1000,
        background: type==='error' ? '#d32f2f' : '#0d4227', color:'#fff',
        padding:'12px 16px', borderRadius:'10px', boxShadow:'0 8px 20px rgba(0,0,0,0.25)',
        fontFamily:'Oswald, sans-serif'
    });
    document.body.appendChild(n);
    setTimeout(()=>{ n.style.opacity='0'; setTimeout(()=>n.remove(), 300); }, 2600);
}


