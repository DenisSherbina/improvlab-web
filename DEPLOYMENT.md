# Инструкция по развертыванию проекта Improv Lab

## Предварительные требования

1. **Node.js** (версия 14 или выше)
2. **npm** или **yarn**
3. **PM2** - менеджер процессов для Node.js
4. **nginx** (опционально, для проксирования)

## Установка зависимостей

### 1. Установка Node.js и npm

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Проверка установки
node --version
npm --version
```

### 2. Установка PM2 глобально

```bash
npm install -g pm2
```

### 3. Установка зависимостей проекта

```bash
cd /path/to/improvlab-web
npm install
```

## Настройка проекта для продакшена

### 1. Создание ecosystem файла для PM2

Создайте файл `ecosystem.config.js` в корне проекта:

```javascript
module.exports = {
  apps: [{
    name: 'improvlab-web',
    script: 'server.js',
    instances: 'max', // Использовать все доступные CPU ядра
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
```

### 2. Создание простого сервера

Создайте файл `server.js` в корне проекта:

```javascript
const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(compression());
app.use(express.static(path.join(__dirname), {
  maxAge: '1d',
  etag: false
}));

// Обработка всех маршрутов (для SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### 3. Установка дополнительных зависимостей

```bash
npm install express compression --save
```

### 4. Создание директории для логов

```bash
mkdir logs
```

## Запуск проекта через PM2

### 1. Запуск в режиме разработки

```bash
pm2 start ecosystem.config.js --env development
```

### 2. Запуск в продакшен режиме

```bash
pm2 start ecosystem.config.js --env production
```

### 3. Полезные команды PM2

```bash
# Просмотр статуса всех процессов
pm2 status

# Просмотр логов
pm2 logs improvlab-web

# Просмотр логов в реальном времени
pm2 logs improvlab-web --follow

# Перезапуск приложения
pm2 restart improvlab-web

# Остановка приложения
pm2 stop improvlab-web

# Удаление приложения из PM2
pm2 delete improvlab-web

# Перезагрузка без простоя
pm2 reload improvlab-web

# Мониторинг в реальном времени
pm2 monit

# Сохранение текущей конфигурации
pm2 save

# Восстановление сохраненной конфигурации
pm2 resurrect
```

## Настройка автозапуска

### 1. Настройка автозапуска PM2

```bash
# Генерация скрипта автозапуска
pm2 startup

# Сохранение текущих процессов
pm2 save
```

### 2. Создание systemd сервиса (альтернативный способ)

Создайте файл `/etc/systemd/system/improvlab-web.service`:

```ini
[Unit]
Description=Improv Lab Web Application
After=network.target

[Service]
Type=forking
User=www-data
WorkingDirectory=/path/to/improvlab-web
ExecStart=/usr/bin/pm2 start /path/to/improvlab-web/ecosystem.config.js --env production
ExecReload=/usr/bin/pm2 reload /path/to/improvlab-web/ecosystem.config.js
ExecStop=/usr/bin/pm2 stop /path/to/improvlab-web/ecosystem.config.js
Restart=always

[Install]
WantedBy=multi-user.target
```

Активация сервиса:

```bash
sudo systemctl daemon-reload
sudo systemctl enable improvlab-web
sudo systemctl start improvlab-web
```

## Настройка nginx (опционально)

### 1. Установка nginx

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

### 2. Создание конфигурации nginx

Создайте файл `/etc/nginx/sites-available/improvlab-web`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Редирект на HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL сертификаты (замените на свои)
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    # SSL настройки
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # Gzip сжатие
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Кэширование статических файлов
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # Основной прокси к приложению
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Таймауты
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Логи
    access_log /var/log/nginx/improvlab-web.access.log;
    error_log /var/log/nginx/improvlab-web.error.log;
}
```

### 3. Активация конфигурации

```bash
# Создание символической ссылки
sudo ln -s /etc/nginx/sites-available/improvlab-web /etc/nginx/sites-enabled/

# Проверка конфигурации
sudo nginx -t

# Перезапуск nginx
sudo systemctl restart nginx
```

## SSL сертификат с Let's Encrypt

### 1. Установка Certbot

```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx
```

### 2. Получение SSL сертификата

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 3. Автообновление сертификата

```bash
# Добавление в crontab
sudo crontab -e

# Добавить строку:
0 12 * * * /usr/bin/certbot renew --quiet
```

## Мониторинг и обслуживание

### 1. Мониторинг через PM2

```bash
# Установка PM2 Plus (опционально)
pm2 link <secret_key> <public_key>

# Локальный мониторинг
pm2 monit
```

### 2. Логирование

```bash
# Ротация логов
pm2 install pm2-logrotate

# Настройка ротации
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
```

### 3. Резервное копирование

Создайте скрипт `/path/to/backup.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/path/to/backups"
PROJECT_DIR="/path/to/improvlab-web"

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/improvlab-web_$DATE.tar.gz -C $PROJECT_DIR .

# Удаление старых бэкапов (старше 30 дней)
find $BACKUP_DIR -name "improvlab-web_*.tar.gz" -mtime +30 -delete
```

Добавьте в crontab:

```bash
# Ежедневное резервное копирование в 2:00
0 2 * * * /path/to/backup.sh
```

## Полезные команды для отладки

```bash
# Проверка портов
netstat -tulpn | grep :3000

# Проверка процессов
ps aux | grep node

# Проверка логов nginx
sudo tail -f /var/log/nginx/error.log

# Проверка логов PM2
pm2 logs improvlab-web --lines 100

# Проверка статуса сервисов
sudo systemctl status nginx
pm2 status
```

## Обновление проекта

```bash
# Остановка приложения
pm2 stop improvlab-web

# Обновление кода
git pull origin main

# Установка новых зависимостей (если есть)
npm install

# Сборка проекта (если нужно)
npm run build

# Запуск приложения
pm2 start improvlab-web

# Сохранение конфигурации
pm2 save
```

## Заключение

После выполнения всех шагов ваш проект Improv Lab будет:

- ✅ Запущен через PM2 с автозапуском
- ✅ Настроен с nginx для проксирования
- ✅ Защищен SSL сертификатом
- ✅ Настроен мониторинг и логирование
- ✅ Готов к продакшен использованию

Для получения помощи используйте команду `pm2 --help` или обращайтесь к [официальной документации PM2](https://pm2.keymetrics.io/docs/).
