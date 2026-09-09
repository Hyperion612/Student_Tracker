# 🔧 Настройка .env для Supabase

## Быстрый старт (5 минут)

### 1. Создайте файл `.env`

В корне проекта создайте файл `.env`:

```bash
cp .env.example .env
```

### 2. Получите ключи из Supabase

1. Откройте [supabase.com](https://supabase.com)
2. Выберите ваш проект
3. Перейдите в **Settings** → **API**
4. Скопируйте два значения:

**Project URL:**
```
https://abcdefghijk.supabase.co
```

**anon public key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQ1NTM2MDAsImV4cCI6MTk5MDEyOTYwMH0...
```

### 3. Заполните `.env`

Откройте файл `.env` и добавьте:

```env
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Важно:** 
- Используйте именно **anon key**, а НЕ service_role key
- Не добавляйте кавычки вокруг значений
- Убедитесь что нет пробелов до/после `=`

### 4. Перезапустите dev-сервер

```bash
# Остановите сервер (Ctrl+C)
npm run dev
```

### 5. Проверьте работу

Откройте консоль браузера (F12). Если видите сообщение:

```
⚠️ Supabase не настроен!
```

Значит `.env` не загружен. Проверьте:
- Файл называется именно `.env` (не `.env.txt`)
- Переменные начинаются с `VITE_`
- Сервер перезапущен после изменения `.env`

## Проверка подключения

### В консоли браузера

Должно быть **НЕТ** предупреждения о том что Supabase не настроен.

### В приложении

1. Откройте http://localhost:3000
2. Вы должны увидеть экран авторизации
3. Зарегистрируйтесь с любым email/паролем
4. Проверьте в Supabase Dashboard → Authentication → Users
5. Ваш пользователь должен появиться

## Структура .env файла

```env
# Комментарий (игнорируется)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Правила:
- ✅ Каждая переменная на новой строке
- ✅ Формат: `KEY=value` (без пробелов вокруг `=`)
- ✅ Переменные должны начинаться с `VITE_`
- ❌ Не используйте кавычки вокруг значений
- ❌ Не используйте пробелы в значениях
- ❌ Не коммитьте `.env` в git (он в `.gitignore`)

## Переменные окружения

### VITE_SUPABASE_URL

**Что это:** URL вашего Supabase проекта

**Где найти:**
1. Supabase Dashboard
2. Settings → API
3. Project URL

**Пример:**
```
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
```

### VITE_SUPABASE_ANON_KEY

**Что это:** Публичный ключ для клиентского доступа

**Где найти:**
1. Supabase Dashboard
2. Settings → API
3. Project API keys → anon public

**Пример:**
```
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQ1NTM2MDAsImV4cCI6MTk5MDEyOTYwMH0...
```

⚠️ **Безопасность:**
- ✅ `anon` key безопасен для фронтенда
- ❌ `service_role` key НЕ безопасен (даёт полный доступ к БД)

## GitHub Actions

Для автоматического деплоя добавьте secrets в GitHub:

1. Откройте репозиторий на GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Нажмите **New repository secret**
4. Добавьте два secrets:

**Secret 1:**
- Name: `VITE_SUPABASE_URL`
- Value: `https://abcdefghijk.supabase.co`

**Secret 2:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Troubleshooting

### Проблема: "Supabase не настроен" в консоли

**Причины:**
1. Файл `.env` не создан
2. Переменные не начинаются с `VITE_`
3. Сервер не перезапущен после изменения `.env`
4. Опечатки в именах переменных

**Решение:**
```bash
# Проверьте что файл существует
ls -la .env

# Проверьте содержимое
cat .env

# Перезапустите сервер
npm run dev
```

### Проблема: "Invalid API key"

**Причины:**
1. Скопирован `service_role` key вместо `anon`
2. Ключ скопирован не полностью
3. Есть лишние пробелы или символы

**Решение:**
- Скопируйте ключ заново из Supabase Dashboard
- Убедитесь что это именно `anon public` key
- Проверьте что нет пробелов в начале/конце

### Проблема: "Failed to fetch"

**Причины:**
1. Неправильный `VITE_SUPABASE_URL`
2. Supabase проект не активен
3. Проблемы с интернетом

**Решение:**
- Проверьте URL в браузере (должен открываться Supabase Dashboard)
- Убедитесь что проект активен в Supabase
- Проверьте интернет-соединение

### Проблема: Переменные не загружаются

**Причины:**
1. Файл называется `.env.txt` вместо `.env`
2. Файл в неправильной директории
3. Кэширование Vite

**Решение:**
```bash
# Удалите кэш Vite
rm -rf node_modules/.vite

# Перезапустите сервер
npm run dev
```

## Локальный режим (без Supabase)

Если `.env` не настроен, приложение работает в **локальном режиме**:
- Данные хранятся в localStorage браузера
- Нет синхронизации между устройствами
- Нет авторизации
- Все данные удаляются при очистке браузера

Это удобно для:
- Быстрого тестирования
- Демо без настройки Supabase
- Разработки без интернета

## Безопасность

### Что можно коммитить:
- ✅ `.env.example` (шаблон без реальных значений)

### Что НЕЛЬЗЯ коммитить:
- ❌ `.env` (содержит реальные ключи)
- ❌ Любые файлы с секретами

### Проверка:
```bash
# Убедитесь что .env в .gitignore
cat .gitignore | grep .env
```

Должно показать: `.env`

## Дополнительные ресурсы

- [Supabase Docs - Environment Variables](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs#environment-variables)
- [Vite Docs - Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [README.md](./README.md) - Полная документация

---

**Готово!** 🎉 После настройки `.env` приложение будет работать с облачной базой данных Supabase.
