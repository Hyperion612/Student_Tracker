# 📘 Руководство по настройке Supabase

## Шаг 1: Создание проекта в Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Нажмите "Start your project"
3. Войдите через GitHub или создайте аккаунт
4. Нажмите "New Project"
5. Заполните:
   - **Name**: `student-tracker-pro` (или любое другое)
   - **Database Password**: создайте надёжный пароль (сохраните его!)
   - **Region**: выберите ближайший к вам регион
   - **Pricing Plan**: Free (для начала достаточно)
6. Нажмите "Create new project"
7. Дождитесь завершения развёртывания (~2 минуты)

## Шаг 2: Применение схемы базы данных

### Вариант A: Через SQL Editor (рекомендуется)

1. В Supabase Dashboard перейдите в **SQL Editor** (иконка </> в боковом меню)
2. Нажмите "New query"
3. Откройте файл `supabase/migrations/001_initial_schema.sql` в вашем проекте
4. Скопируйте **всё содержимое** файла
5. Вставьте в SQL Editor
6. Нажмите **Run** (или Ctrl+Enter)
7. Дождитесь сообщения "Success. No rows returned"

### Вариант B: Через Table Editor

Если предпочитаете графический интерфейс:

1. Перейдите в **Table Editor**
2. Создайте таблицы вручную согласно схеме из миграции
3. Настройте RLS политики
4. Создайте триггеры и функции

## Шаг 3: Настройка аутентификации

1. Перейдите в **Authentication** → **Providers**
2. Убедитесь, что **Email** провайдер включён
3. Нажмите на Email провайдер
4. Для упрощения тестирования:
   - Отключите **"Confirm email"** (пользователи смогут входить сразу после регистрации)
   - В продакшене рекомендуется включить подтверждение email
5. Нажмите **Save**

### Опционально: Настройка email шаблонов

1. Перейдите в **Authentication** → **Email Templates**
2. Настройте шаблоны писем на русском языке
3. Можно изменить тему, содержимое и стиль

## Шаг 4: Получение API ключей

1. Перейдите в **Settings** → **API**
2. Найдите секцию **Project URLs**
3. Скопируйте **Project URL** (например: `https://abcdefghijk.supabase.co`)
4. Найдите секцию **Project API keys**
5. Скопируйте **anon public key** (длинная строка, начинающаяся с `eyJ...`)

⚠️ **Важно**: `anon` ключ безопасен для использования в клиентском коде. `service_role` ключ **НЕ** должен использоваться на фронтенде!

## Шаг 5: Настройка переменных окружения

### Локальная разработка

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
4. Перезапустите dev-сервер:

```bash
npm run dev
```

### Деплой на Vercel

1. Перейдите в настройки проекта на Vercel
2. Откройте **Settings** → **Environment Variables**
3. Добавьте:
   - **VITE_SUPABASE_URL**: ваш Project URL
   - **VITE_SUPABASE_ANON_KEY**: ваш anon key
4. Выберите окружения: Production, Preview, Development
5. Нажмите **Save**
6. Redeploy проект

## Шаг 6: Проверка работы

### Тест регистрации

1. Откройте приложение: http://localhost:3000
2. Нажмите "Регистрация"
3. Введите:
   - Имя: `Тест`
   - Email: `test@example.com`
   - Пароль: `test123456`
4. Нажмите "Создать аккаунт"

### Проверка в Supabase

1. В Supabase Dashboard перейдите в **Authentication** → **Users**
2. Вы должны увидеть нового пользователя
3. Перейдите в **Table Editor** → **profiles**
4. Должна появиться запись с профилем пользователя

### Тест онбординга

1. После регистрации вы попадёте на экран онбординга
2. Пройдите все 3 шага
3. Проверьте в Supabase:
   - **profiles**: данные должны обновиться
   - **day_records**: должны появиться демо-записи
   - **user_achievements**: должны быть инициализированы

## Шаг 7: Настройка CORS (если нужно)

Если вы разрабатываете локально и видите ошибки CORS:

1. Перейдите в **Authentication** → **URL Configuration**
2. Добавьте локальный URL в **Site URL**:
   - `http://localhost:3000`
   - `http://localhost:5173` (если используете стандартный Vite port)
3. В **Redirect URLs** добавьте:
   - `http://localhost:3000/**`
   - `http://localhost:5173/**`

## 🔍 Отладка

### Проблема: "Failed to fetch"

**Решение:**
- Проверьте правильность `VITE_SUPABASE_URL`
- Убедитесь, что проект активен в Supabase
- Проверьте интернет-соединение

### Проблема: "Invalid API key"

**Решение:**
- Проверьте правильность `VITE_SUPABASE_ANON_KEY`
- Убедитесь, что скопировали именно `anon` ключ, а не `service_role`
- Перезапустите dev-сервер после изменения `.env`

### Проблема: "new row violates row-level security policy"

**Решение:**
- Убедитесь, что миграция БД применена полностью
- Проверьте, что RLS политики созданы
- Проверьте, что пользователь авторизован

### Проблема: Пользователь не может войти

**Решение:**
- Проверьте, что Email провайдер включён
- Если включено подтверждение email, подтвердите адрес или отключите эту опцию
- Проверьте пароль (минимум 6 символов)

## 🚀 Оптимизация для продакшена

### 1. Включите подтверждение email

В продакшене рекомендуется требовать подтверждение email для безопасности.

### 2. Настройте Rate Limiting

В Supabase Dashboard:
- **Authentication** → **Rate Limits**
- Настройте лимиты согласно вашим потребностям

### 3. Мониторинг

Используйте встроенные инструменты Supabase:
- **Logs**: просмотр логов API запросов
- **Reports**: мониторинг производительности
- **Authentication** → **Logs**: логи аутентификации

### 4. Бэкапы

- Free план: автоматические бэкапы каждый день (7 дней хранения)
- Pro план: point-in-time recovery

## 📊 Использование Supabase Dashboard

### Просмотр данных

1. **Table Editor**: просмотр и редактирование данных
2. **SQL Editor**: выполнение произвольных SQL запросов
3. **Authentication**: управление пользователями

### Полезные запросы

```sql
-- Получить статистику пользователя
SELECT * FROM get_user_stats('user-uuid-here');

-- Посчитать общую посещаемость
SELECT 
  COUNT(*) FILTER (WHERE status = 'ATTENDED') as attended,
  COUNT(*) FILTER (WHERE status = 'SKIPPED') as skipped,
  COUNT(*) as total
FROM day_records
WHERE user_id = 'user-uuid-here';

-- Найти пользователей с низкой посещаемостью
SELECT p.name, p.id
FROM profiles p
JOIN day_records dr ON p.id = dr.user_id
GROUP BY p.id, p.name
HAVING COUNT(*) FILTER (WHERE dr.status = 'ATTENDED')::float / COUNT(*) < 0.8;
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

### Рекомендации:
1. Используйте RLS для всех таблиц
2. Валидируйте данные на клиенте и сервере
3. Ограничьте размер запросов
4. Используйте HTTPS в продакшене
5. Регулярно обновляйте зависимости

## 📚 Дополнительные ресурсы

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [JavaScript Client Library](https://supabase.com/docs/reference/javascript/introduction)

---

Если возникли проблемы, проверьте раздел "Отладка" выше или создайте issue в репозитории.
