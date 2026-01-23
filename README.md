# IT Quiz - Платформа для тестирования знаний разработчиков

Веб-приложение для проверки знаний в области IT с поддержкой различных категорий (Frontend, Backend, DevOps) и уровней сложности (Junior, Middle, Senior).

## Технологический стек

### Frontend
- **React 18.3** - библиотека для построения UI
- **TypeScript 5.5** - типизированный JavaScript
- **Vite 5.4** - быстрый сборщик и dev-сервер
- **React Router 7.8** - маршрутизация
- **Tailwind CSS 3.4** - CSS фреймворк
- **Lucide React** - иконки
- **React Toastify** - уведомления

### Backend
- **Node.js** - серверная среда выполнения
- **Express 5.1** - веб-фреймворк
- **PostgreSQL** - база данных
- **pg** - PostgreSQL клиент для Node.js

### Dev Tools
- **ESLint 9** - линтер кода
- **PostCSS** - обработка CSS
- **Autoprefixer** - автоматические вендорные префиксы

## Требования

- **Node.js** >= 18.x
- **npm** >= 9.x
- **PostgreSQL** >= 14.x

## Установка

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка базы данных

#### Создание базы данных PostgreSQL

```bash
# Подключение к PostgreSQL
psql -U postgres

# Создание базы данных
CREATE DATABASE itquiz;

# Выход
\q
```

#### Импорт схемы и данных

```bash
psql -U postgres -d itquiz -f tables.sql
```

### 4. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
# Admin credentials
VITE_ADMIN_EMAIL=your-email@example.com
VITE_ADMIN_PASSWORD=your-secure-password

# PostgreSQL connection
DB_USER=postgres
DB_HOST=localhost
DB_NAME=itquiz
DB_PASSWORD=your-db-password
DB_PORT=5432

# Server port (optional)
SERVER_PORT=5000
```


## Запуск проекта

### Режим разработки

Запустите два терминала:

**Терминал 1 - Frontend (Vite dev server):**
```bash
npm run dev
```
Приложение будет доступно по адресу: `http://localhost:5173`

**Терминал 2 - Backend (Express server):**
```bash
npm run server
```
API будет доступно по адресу: `http://localhost:5000`

### Production сборка

```bash
# Сборка frontend
npm run build

# Запуск production сервера
npm run server
```

После сборки приложение будет доступно по адресу: `http://localhost:5000`

## Структура проекта

```
├── api/                    # API
│   └── quiz.js            # API маршруты
├── src/
│   ├── components/        # React компоненты
│   │   ├── AdminLogin.tsx
│   │   ├── AdminPanel.tsx
│   │   ├── Quiz.tsx
│   │   └── ...
│   ├── contexts/          # React контексты
│   │   └── ThemeContext.tsx
│   ├── hooks/             # Кастомные хуки
│   │   └── useTheme.ts
│   ├── services/          # API сервисы
│   │   └── quizService.ts
│   ├── types/             # TypeScript типы
│   │   └── index.ts
│   ├── App.tsx            # Главный компонент
│   ├── main.tsx           # Точка входа
│   └── index.css          # Глобальные стили
├── dist/                  # Production сборка
├── server.js              # Express сервер
├── tables.sql             # SQL схема и данные
├── .env                   # Переменные окружения
├── vite.config.ts         # Конфигурация Vite
├── tailwind.config.js     # Конфигурация Tailwind
└── tsconfig.json          # Конфигурация TypeScript
```

## Доступные скрипты

```bash
npm run dev      # Запуск Vite dev server (frontend)
npm run build    # Production сборка
npm run preview  # Предпросмотр production сборки
npm run lint     # Проверка кода с ESLint
npm run server   # Запуск Express сервера (backend)
```

## Функциональность

### Для пользователей
- ✅ Выбор категории (Frontend, Backend, DevOps)
- ✅ Выбор уровня сложности (Junior, Middle, Senior)
- ✅ Прохождение квизов с таймером
- ✅ Просмотр результатов с объяснениями
- ✅ Темная/светлая тема

### Для администраторов
- ✅ Авторизация в админ-панели
- ✅ Управление категориями
- ✅ Управление вопросами
- ✅ Добавление/редактирование/удаление контента

## База данных

### Таблицы

**categories** - категории вопросов
- `id` (text, PK)
- `title` (text)
- `description` (text)
- `created_at` (timestamp)

**levels** - уровни сложности
- `id` (text, PK)
- `title` (text)
- `order_index` (integer)
- `created_at` (timestamp)

**questions** - вопросы
- `id` (uuid, PK)
- `category_id` (text, FK)
- `level_id` (text, FK)
- `text` (text)
- `options` (jsonb)
- `correct_answer` (integer)
- `explanation` (text)
- `created_at` (timestamp)

## API

### Quiz API (`/api/quiz`)

```
GET    /categories              # Получить все категории
POST   /categories              # Создать категорию
PUT    /categories/:id          # Обновить категорию
DELETE /categories/:id          # Удалить категорию

GET    /levels                  # Получить все уровни

GET    /questions               # Получить все вопросы
GET    /questions/:categoryId/:levelId  # Получить вопросы по категории и уровню
POST   /questions               # Создать вопрос
PUT    /questions/:id           # Обновить вопрос
DELETE /questions/:id           # Удалить вопрос
```

## Диагностика

### Ошибка подключения к базе данных

Проверьте:
1. PostgreSQL запущен
2. Параметры подключения в `.env` корректны
3. База данных `itquiz` создана
4. Схема импортирована из `tables.sql`

### Порт уже занят

Измените порт в `.env`:
```env
SERVER_PORT=3001
```

### Ошибки TypeScript

```bash
# Очистка кэша и переустановка
rm -rf node_modules package-lock.json
npm install
```
