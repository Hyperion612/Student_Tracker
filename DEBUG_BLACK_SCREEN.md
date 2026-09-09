# 🐛 Отладка чёрного экрана

## Проблема: Чёрный экран при входе на сайт

Если вы видите чёрный экран вместо приложения, вот пошаговая инструкция по диагностике:

## 1. Откройте консоль браузера

Нажмите **F12** или **Ctrl+Shift+I** (Cmd+Option+I на Mac) и перейдите на вкладку **Console**.

### Что вы должны увидеть:

#### ✅ Если Supabase НЕ настроен:
```
⚠️ Supabase не настроен!

Приложение работает в локальном режиме (localStorage).
Для синхронизации с облаком:
1. Создайте файл .env в корне проекта
2. Добавьте переменные:
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key

Подробная инструкция: README.md → Настройка Supabase
```

И затем:
```
App state: {loading: false, user: null, isConfigured: false, onboardingComplete: false}
Showing Onboarding screen
```

#### ✅ Если Supabase настроен:
```
App state: {loading: false, user: null, isConfigured: true, onboardingComplete: false}
Showing Auth screen
```

### ❌ Если видите ошибки:

#### Ошибка: "Cannot read property 'X' of undefined"
**Причина:** Ошибка в коде компонента

**Решение:**
```bash
# Очистите кэш и перезапустите
rm -rf node_modules/.vite
npm run dev
```

#### Ошибка: "Failed to fetch"
**Причина:** Supabase URL неправильный или проект не активен

**Решение:**
- Проверьте `VITE_SUPABASE_URL` в `.env`
- Убедитесь что проект активен в Supabase Dashboard

#### Ошибка: "Invalid API key"
**Причина:** Неправильный anon key

**Решение:**
- Скопируйте ключ заново из Supabase Dashboard
- Убедитесь что это `anon` key, а не `service_role`

## 2. Проверьте вкладку Network

В DevTools перейдите на вкладку **Network** и обновите страницу.

### Что должно загрузиться:
- ✅ `index.html`
- ✅ `index-*.js` (основной бандл)
- ✅ `index-*.css` (стили)

### Если файлы не загружаются:
- Проверьте что dev-сервер запущен (`npm run dev`)
- Проверьте что нет ошибок в терминале

## 3. Проверьте вкладку Elements

В DevTools перейдите на вкладку **Elements**.

### Что должно быть:
```html
<div id="root">
  <!-- React контент -->
</div>
```

### Если `<div id="root">` пустой:
- Есть ошибка JavaScript
- Проверьте вкладку Console

### Если `<div id="root">` отсутствует:
- Проблема с `index.html`
- Проверьте что `main.tsx` правильно подключён

## 4. Проверьте терминал

В терминале где запущен `npm run dev` не должно быть ошибок.

### Нормальный вывод:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Если видите ошибки:
- Исправьте ошибки TypeScript
- Проверьте что все зависимости установлены (`npm install`)

## 5. Пошаговая диагностика

### Шаг 1: Очистите кэш
```bash
# Очистите кэш Vite
rm -rf node_modules/.vite

# Очистите кэш браузера
# Ctrl+Shift+Delete → Очистить кэш

# Перезапустите dev-сервер
npm run dev
```

### Шаг 2: Проверьте .env
```bash
# Проверьте что файл существует
ls -la .env

# Проверьте содержимое
cat .env
```

Должно быть:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### Шаг 3: Проверьте переменные в браузере

В консоли браузера введите:
```javascript
import.meta.env.VITE_SUPABASE_URL
import.meta.env.VITE_SUPABASE_ANON_KEY
```

Должны вернуть значения из `.env` или `undefined` если не настроены.

### Шаг 4: Проверьте Zustand store

В консоли браузера:
```javascript
// Получите состояние store
const state = JSON.parse(localStorage.getItem('student-tracker-pro') || '{}');
console.log(state);
```

Должно показать состояние приложения.

### Шаг 5: Проверьте Supabase клиент

В консоли браузера:
```javascript
// Проверьте что Supabase клиент создан
console.log(window.__supabase); // если экспортируется
```

## 6. Частые проблемы и решения

### Проблема: Бесконечная загрузка (спиннер)

**Причина:** `loading` состояние не переключается в `false`

**Решение:**
1. Проверьте `useAuth` hook
2. Убедитесь что `setLoading(false)` вызывается
3. Проверьте что Supabase не блокирует запрос

### Проблема: Показывается Auth экран, но не работает

**Причина:** Supabase Auth не настроен

**Решение:**
1. Проверьте что Email provider включён в Supabase
2. Проверьте что "Confirm email" отключён (для тестирования)

### Проблема: Показывается Onboarding, но не работает

**Причина:** Ошибка в Onboarding компоненте

**Решение:**
1. Проверьте консоль на ошибки
2. Попробуйте очистить localStorage:
```javascript
localStorage.clear();
location.reload();
```

### Проблема: Основной экран показывается, но контент пустой

**Причина:** Ошибка в компонентах дашборда

**Решение:**
1. Проверьте консоль на ошибки
2. Проверьте что `settings.onboardingComplete` = true
3. Проверьте что `generateDemoData()` вызвался

## 7. Полная переустановка

Если ничего не помогает:

```bash
# Удалите node_modules и lock файл
rm -rf node_modules package-lock.json

# Удалите кэш
rm -rf .vite dist

# Переустановите зависимости
npm install

# Перезапустите
npm run dev
```

## 8. Проверка production сборки

Если dev-версия работает, но production нет:

```bash
# Соберите production версию
npm run build

# Проверьте что dist/ создан
ls -la dist/

# Запустите preview
npm run preview
```

Откройте http://localhost:4173 и проверьте консоль.

## 9. Получение помощи

Если проблема не решена:

1. Откройте консоль браузера (F12)
2. Скопируйте все ошибки
3. Сделайте скриншот вкладки Console
4. Создайте issue в репозитории с:
   - Описанием проблемы
   - Скриншотами
   - Логами из консоли
   - Версией Node.js (`node --version`)
   - Версией npm (`npm --version`)

## 10. Временное решение

Если нужно срочно посмотреть приложение:

```bash
# Очистите всё
localStorage.clear();
sessionStorage.clear();

# Перезагрузите
location.reload();
```

Это сбросит все данные и покажет Onboarding заново.

---

**Полезные команды:**

```bash
# Проверить версию Node
node --version

# Проверить версию npm
npm --version

# Очистить кэш npm
npm cache clean --force

# Переустановить зависимости
rm -rf node_modules package-lock.json
npm install

# Очистить кэш Vite
rm -rf node_modules/.vite

# Перезапустить dev-сервер
npm run dev

# Собрать production
npm run build

# Проверить production
npm run preview
```

---

Если после всех шагов проблема не решена, создайте issue с подробным описанием и логами.
