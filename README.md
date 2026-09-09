# 🎓 Student Tracker Pro

Современное веб-приложение для учёта посещаемости с геймификацией и аналитикой.

## 🚀 Возможности

- **Тепловая карта года** (GitHub-style) с интерактивной сеткой
- **Быстрая отметка** посещений одним кликом
- **Статистика посещаемости** с расчётом допуска к сессии (>80%)
- **Дисциплины** с цветовой индикацией и статистикой
- **Геймификация**: стрики, достижения, цели
- **Экспорт данных**: CSV, PDF-отчёты, JSON-бэкапы
- **Синхронизация с Supabase** для хранения данных в облаке
- **Автоматический деплой** через GitHub Actions

## 🛠 Технологический стек

- **Frontend**: React 18 + TypeScript + Vite
- **Стилизация**: Tailwind CSS v4
- **Анимации**: Framer Motion
- **Состояние**: Zustand
- **База данных**: Supabase (PostgreSQL)
- **Аутентификация**: Supabase Auth
- **CI/CD**: GitHub Actions
- **Деплой**: GitHub Pages

## 📦 Установка и запуск

### Локальная разработка

```bash
# Клонирование репозитория
git clone <repository-url>
cd student-tracker-pro

# Установка зависимостей
npm install

# Создание файла .env
cp .env.example .env

# Заполните .env вашими ключами Supabase
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key

# Запуск dev-сервера
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

### Сборка для production

```bash
npm run build
```

## 📘 Настройка Supabase (пошаговая инструкция)

**📖 Подробная инструкция по настройке `.env`: [ENV_SETUP.md](./ENV_SETUP.md)**

### Шаг 1: Создание проекта в Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Нажмите **"Start your project"**
3. Войдите через GitHub или создайте аккаунт
4. Нажмите **"New Project"**
5. Заполните форму:
   - **Name**: `student-tracker-pro` (или любое другое)
   - **Database Password**: создайте надёжный пароль (⚠️ **сохраните его!**)
   - **Region**: выберите ближайший к вам регион
   - **Pricing Plan**: Free (для начала достаточно)
6. Нажмите **"Create new project"**
7. ⏳ Дождитесь завершения развёртывания (~2 минуты)

### Шаг 2: Применение схемы базы данных

1. В Supabase Dashboard перейдите в **SQL Editor** (иконка `</>` в боковом меню)
2. Нажмите **"New query"**
3. Откройте файл `supabase/migrations/001_initial_schema.sql` в вашем проекте
4. Скопируйте **всё содержимое** файла
5. Вставьте в SQL Editor
6. Нажмите **Run** (или Ctrl+Enter)
7. ✅ Дождитесь сообщения **"Success. No rows returned"**

**Что было создано:**
- Таблица `profiles` - профили пользователей
- Таблица `subjects` - дисциплины
- Таблица `day_records` - записи посещаемости
- Таблица `user_achievements` - достижения
- Таблица `user_goals` - цели
- RLS политики безопасности
- Автоматические триггеры

### Шаг 3: Настройка аутентификации

1. Перейдите в **Authentication** → **Providers**
2. Убедитесь, что **Email** провайдер включён
3. Нажмите на Email провайдер
4. Для упрощения тестирования:
   - ⚠️ Отключите **"Confirm email"** (пользователи смогут входить сразу)
   - В продакшене рекомендуется включить подтверждение email
5. Нажмите **Save**

### Шаг 4: Получение API ключей

1. Перейдите в **Settings** → **API**
2. Найдите секцию **Project URLs**
3. 📋 Скопируйте **Project URL** (например: `https://abcdefghijk.supabase.co`)
4. Найдите секцию **Project API keys**
5. 📋 Скопируйте **anon public key** (длинная строка, начинающаяся с `eyJ...`)

⚠️ **Важно**: `anon` ключ безопасен для использования в клиентском коде. `service_role` ключ **НЕ** должен использоваться на фронтенде!

### Шаг 5: Настройка переменных окружения

#### Для локальной разработки:

1. В корне проекта создайте файл `.env`:

```bash
cp .env.example .env
```

2. Откройте `.env` и заполните:

```env
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Сохраните файл

#### Для GitHub Actions:

1. Перейдите в ваш репозиторий на GitHub
2. Откройте **Settings** → **Secrets and variables** → **Actions**
3. Нажмите **"New repository secret"**
4. Добавьте два secrets:

**Secret 1:**
- Name: `VITE_SUPABASE_URL`
- Value: `https://abcdefghijk.supabase.co`

**Secret 2:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

5. Нажмите **"Add secret"**

### Шаг 6: Настройка GitHub Pages

1. Перейдите в **Settings** → **Pages**
2. В разделе **Build and deployment**:
   - **Source**: выберите **GitHub Actions**
3. Сохраните настройки

### Шаг 7: Проверка работы

1. Откройте приложение: http://localhost:3000
2. Нажмите **"Регистрация"**
3. Введите:
   - Имя: `Тест`
   - Email: `test@example.com`
   - Пароль: `test123456`
4. Нажмите **"Создать аккаунт"**

**Проверка в Supabase:**
1. В Supabase Dashboard перейдите в **Authentication** → **Users**
2. Вы должны увидеть нового пользователя
3. Перейдите в **Table Editor** → **profiles**
4. Должна появиться запись с профилем пользователя

## 🚢 Деплой через GitHub Actions

### Автоматический деплой

При каждом push в ветку `main` автоматически:
1. ✅ Проверяется код (TypeScript)
2. ✅ Собирается приложение
3. ✅ Деплоится на GitHub Pages

### Ручной деплой

1. Перейдите в **Actions**
2. Выберите workflow **"Build and Deploy to GitHub Pages"**
3. Нажмите **"Run workflow"**
4. Выберите ветку и нажмите **"Run workflow"**

### URL вашего сайта

После первого деплоя сайт будет доступен по адресу:
```
https://<username>.github.io/<repository-name>/
```

## 📊 Структура базы данных

### Таблицы

**profiles** - профили пользователей
```sql
- id (UUID, primary key)
- name (text)
- semester_start (date)
- semester_end (date)
- accent_color (text: 'lime' | 'cyan' | 'violet')
- onboarding_complete (boolean)
```

**subjects** - дисциплины
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- name (text)
- color (text)
- emoji (text)
```

**day_records** - записи посещаемости
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- date (date)
- status (text: 'ATTENDED' | 'SKIPPED' | 'EXCUSED' | 'SICK' | 'HOLIDAY' | 'UNMARKED')
- subject_id (UUID, nullable)
- note (text, nullable)
```

**user_achievements** - достижения
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- achievement_id (text)
- unlocked (boolean)
- unlocked_at (timestamp, nullable)
```

**user_goals** - цели
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- title (text)
- target_percent (integer)
- period (text: 'week' | 'month' | 'semester')
- completed (boolean)
```

### Row Level Security (RLS)

Все таблицы защищены RLS-политиками. Пользователи могут видеть и изменять только свои данные.

## 🎮 Геймификация

### Достижения

- 🏆 **Идеальная неделя** - 7 дней подряд без прогулов
- 💪 **Железная воля** - 30 дней без прогулов
- ⏰ **Пунктуальность** - 50 посещённых дней
- 💯 **Сотня** - 100 посещённых дней
- 🏃 **Марафонец** - 60 дней стрик
- 👑 **Чемпион** - 95% посещаемости
- 🌅 **Ранняя пташка** - первый день семестра
- 🦠 **Выживший** - переболеть и вернуться

### Расчёт посещаемости

```typescript
rating = (attended + excused * 0.75 + sick * 0.5) / total * 100
admissible = rating >= 80%
```

## 🔐 Безопасность

### Что безопасно на фронтенде:
- ✅ `anon` key
- ✅ Публичные API вызовы
- ✅ Чтение данных с RLS

### Что НЕ безопасно на фронтенде:
- ❌ `service_role` key
- ❌ Прямое изменение RLS политик
- ❌ Хранение секретов в коде

## 📁 Структура проекта

```
student-tracker-pro/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── src/
│   ├── components/             # React компоненты
│   │   ├── Auth.tsx           # Аутентификация
│   │   ├── Onboarding.tsx     # Онбординг
│   │   ├── Heatmap.tsx        # Тепловая карта
│   │   ├── DashboardStats.tsx # Статистика
│   │   ├── QuickMark.tsx      # Быстрая отметка
│   │   ├── WeeklyOverview.tsx # Недельный обзор
│   │   ├── Subjects.tsx       # Дисциплины
│   │   ├── Achievements.tsx   # Достижения
│   │   └── ExportButton.tsx   # Экспорт
│   ├── lib/
│   │   ├── supabase.ts        # Клиент Supabase
│   │   └── api.ts             # API функции
│   ├── store/
│   │   └── useStore.ts        # Zustand store
│   ├── hooks/
│   │   ├── useAuth.ts         # Хук аутентификации
│   │   └── useSupabaseSync.ts # Синхронизация
│   ├── utils/
│   │   └── attendance.ts      # Утилиты
│   ├── App.tsx                # Главный компонент
│   └── main.tsx               # Точка входа
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Схема БД
├── .env.example               # Пример переменных окружения
└── package.json
```

## 🐛 Отладка

### Проблема: "Failed to fetch"
**Решение:**
- Проверьте правильность `VITE_SUPABASE_URL`
- Убедитесь, что проект активен в Supabase
- Проверьте интернет-соединение

### Проблема: "Invalid API key"
**Решение:**
- Проверьте правильность `VITE_SUPABASE_ANON_KEY`
- Убедитесь, что скопировали именно `anon` ключ
- Перезапустите dev-сервер после изменения `.env`

### Проблема: "new row violates row-level security policy"
**Решение:**
- Убедитесь, что миграция БД применена полностью
- Проверьте, что RLS политики созданы
- Проверьте, что пользователь авторизован

### Проблема: Workflow не запускается
**Решение:**
- Проверьте, что secrets добавлены в GitHub
- Убедитесь, что workflow файл находится в `.github/workflows/`
- Проверьте логи в Actions

## 📚 Полезные ссылки

- [Supabase Docs](https://supabase.com/docs)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vite Docs](https://vitejs.dev)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

## 📝 Лицензия

MIT

---

**Student Tracker Pro** - Сделано с ❤️ для студентов
