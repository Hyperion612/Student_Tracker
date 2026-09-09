# 🔌 Подключение Supabase через .env

## Как это работает

Приложение использует файл `.env` для подключения к Supabase. Когда вы запускаете приложение, Vite автоматически загружает переменные из `.env` и делает их доступными через `import.meta.env`.

```typescript
// src/lib/supabase.ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

## Быстрая настройка (2 минуты)

### 1. Создайте файл `.env`

```bash
cp .env.example .env
```

### 2. Получите ключи из Supabase

1. Откройте [supabase.com](https://supabase.com) → ваш проект
2. Перейдите в **Settings** → **API**
3. Скопируйте:
   - **Project URL**: `https://abcdefghijk.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. Заполните `.env`

```env
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Перезапустите сервер

```bash
npm run dev
```

## Проверка работы

### ✅ Supabase подключен

В консоли браузера **НЕТ** предупреждения о том что Supabase не настроен.

### ❌ Supabase не подключен

В консоли видите:
```
⚠️ Supabase не настроен!
Приложение работает в локальном режиме (localStorage).
```

**Решение:**
1. Проверьте что файл `.env` создан
2. Убедитесь что переменные начинаются с `VITE_`
3. Перезапустите dev-сервер

## Два режима работы

### 1. С Supabase (облачный режим)

**Когда:** `.env` настроен с валидными ключами

**Возможности:**
- ✅ Авторизация через email/password
- ✅ Синхронизация данных между устройствами
- ✅ Данные хранятся в PostgreSQL
- ✅ Резервные копии

### 2. Без Supabase (локальный режим)

**Когда:** `.env` не настроен или ключи невалидны

**Возможности:**
- ✅ Все функции работают
- ✅ Данные хранятся в localStorage
- ❌ Нет синхронизации
- ❌ Нет авторизации
- ❌ Данные удаляются при очистке браузера

**Используется для:**
- Быстрого тестирования
- Демо без настройки Supabase
- Разработки без интернета

## GitHub Actions

Для автоматического деплоя добавьте secrets в GitHub:

1. **Settings** → **Secrets and variables** → **Actions**
2. Добавьте два secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Безопасность

### ✅ Можно коммитить:
- `.env.example` (шаблон без реальных значений)

### ❌ Нельзя коммитить:
- `.env` (содержит реальные ключи)

Проверьте что `.env` в `.gitignore`:
```bash
cat .gitignore | grep .env
```

## Troubleshooting

### Проблема: "Supabase не настроен"

**Решение:**
```bash
# Проверьте файл
cat .env

# Удалите кэш Vite
rm -rf node_modules/.vite

# Перезапустите
npm run dev
```

### Проблема: "Invalid API key"

**Решение:**
- Убедитесь что используете `anon` key, а не `service_role`
- Проверьте что ключ скопирован полностью
- Убедитесь что нет пробелов в начале/конце

### Проблема: Переменные не загружаются

**Решение:**
- Файл должен называться именно `.env` (не `.env.txt`)
- Переменные должны начинаться с `VITE_`
- Перезапустите сервер после изменения `.env`

## Полезные ссылки

- 📖 [ENV_SETUP.md](./ENV_SETUP.md) - Подробная инструкция
- 📖 [README.md](./README.md) - Основная документация
- 📖 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Настройка базы данных

---

**Готово!** 🎉 После настройки `.env` приложение автоматически подключится к Supabase.
