# 🔐 Настройка Supabase с реальными ключами

## ✅ Что уже сделано:

1. **Создан файл `.env`** с вашими ключами Supabase
2. **`.env` добавлен в `.gitignore`** - не попадёт в git
3. **GitHub Actions настроен** - использует secrets из GitHub

## 📋 Ваши ключи Supabase:

```
URL: https://wvmmcyjicxvoqmjjwjct.supabase.co
ANON KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🚀 Как использовать:

### Локальная разработка

Файл `.env` уже создан в корне проекта. Просто запустите:

```bash
npm run dev
```

Теперь приложение будет работать с вашей Supabase базой данных!

### Деплой на GitHub Pages

Ваши ключи уже добавлены в GitHub Secrets:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

При каждом push в main GitHub Actions автоматически:
1. Соберёт приложение с вашими ключами
2. Задеплоит на GitHub Pages
3. Сайт будет работать с облачной базой данных

## 🔒 Безопасность

### ✅ Что безопасно:
- Файл `.env` локально на вашем компьютере
- GitHub Secrets (зашифрованы GitHub)
- `anon` ключ в клиентском коде (предназначен для этого)

### ❌ Что НЕ безопасно:
- Коммитить `.env` в git (запрещено `.gitignore`)
- Хардкодить ключи в исходный код
- Использовать `service_role` key на фронтенде

## 🧪 Проверка работы

### 1. Локально

```bash
# Запустите dev-сервер
npm run dev

# Откройте http://localhost:3000
# Должна появиться форма регистрации
```

### 2. Проверьте Supabase Dashboard

1. Откройте https://supabase.com/dashboard/project/wvmmcyjicxvoqmjjwjct
2. Перейдите в **Authentication** → **Users**
3. Зарегистрируйтесь в приложении
4. Пользователь должен появиться в списке

### 3. Проверьте базу данных

1. В Supabase Dashboard перейдите в **Table Editor**
2. Должны быть таблицы:
   - `profiles`
   - `subjects`
   - `day_records`
   - `user_achievements`
   - `user_goals`

## 📊 Структура данных

После регистрации и онбординга в базе появятся:

**profiles** - ваш профиль:
```sql
id: uuid
name: "Ваше имя"
semester_start: "2024-09-01"
semester_end: "2025-01-31"
accent_color: "lime"
onboarding_complete: true
```

**day_records** - записи посещаемости (демо-данные):
```sql
user_id: uuid
date: "2024-09-02"
status: "ATTENDED" | "SKIPPED" | "EXCUSED" | "SICK" | "HOLIDAY"
```

**subjects** - дисциплины (демо-данные):
```sql
user_id: uuid
name: "Математика"
color: "#84cc16"
emoji: "📐"
```

## 🔄 Синхронизация

### Как работает:

1. **Регистрация** → создаётся пользователь в Supabase Auth
2. **Онбординг** → создаётся профиль в таблице `profiles`
3. **Отметки** → сохраняются в `day_records`
4. **Дисциплины** → сохраняются в `subjects`
5. **Достижения** → обновляются в `user_achievements`

### Автоматическая синхронизация:

- При входе данные загружаются из Supabase
- При изменении данных они синхронизируются с Supabase
- При выходе локальные данные очищаются

## 🐛 Troubleshooting

### Проблема: "Failed to fetch"

**Причина:** Supabase URL неправильный или проект не активен

**Решение:**
1. Проверьте что проект активен в Supabase Dashboard
2. Проверьте URL в `.env`
3. Убедитесь что нет опечаток

### Проблема: "Invalid API key"

**Причина:** Неправильный anon key

**Решение:**
1. Скопируйте ключ заново из Supabase Dashboard
2. Проверьте что это `anon` key, а не `service_role`
3. Убедитесь что ключ скопирован полностью

### Проблема: Пользователь не создаётся

**Причина:** Email provider не настроен

**Решение:**
1. В Supabase Dashboard → Authentication → Providers
2. Убедитесь что Email provider включён
3. Отключите "Confirm email" для тестирования

### Проблема: Данные не синхронизируются

**Причина:** RLS политики блокируют доступ

**Решение:**
1. Проверьте что миграция применена
2. В Supabase Dashboard → Authentication → Policies
3. Убедитесь что политики созданы для всех таблиц

## 📝 Применение миграции

Если таблицы ещё не созданы:

1. Откройте Supabase Dashboard
2. Перейдите в **SQL Editor**
3. Скопируйте содержимое `supabase/migrations/001_initial_schema.sql`
4. Вставьте в SQL Editor
5. Нажмите **Run**

## 🎯 Следующие шаги

1. ✅ Запустите `npm run dev`
2. ✅ Зарегистрируйтесь в приложении
3. ✅ Пройдите онбординг
4. ✅ Проверьте что данные появились в Supabase
5. ✅ Запушьте изменения в main
6. ✅ Дождитесь деплоя на GitHub Pages
7. ✅ Проверьте что сайт работает с облачной базой

## 🔗 Полезные ссылки

- [Supabase Dashboard](https://supabase.com/dashboard/project/wvmmcyjicxvoqmjjwjct)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [ENV_SETUP.md](./ENV_SETUP.md) - подробная инструкция по `.env`

---

**Готово!** 🎉 Ваше приложение теперь подключено к Supabase и готово к работе с облачной базой данных!
