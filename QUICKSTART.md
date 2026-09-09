# 🚀 Быстрый старт - GitHub Actions

## Что настроено

✅ **CI/CD Pipeline** полностью готов к работе:
- Автоматическая проверка кода при каждом push
- Автоматическая сборка приложения
- Автоматический деплой на выбранную платформу
- Автоматические релизы при создании тегов
- Проверка безопасности зависимостей
- Автоматическое обновление зависимостей через Dependabot

## 📋 Что нужно сделать

### 1. Добавьте Secrets в GitHub

Перейдите в ваш репозиторий → **Settings** → **Secrets and variables** → **Actions**

Добавьте **обязательные** secrets:

```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Выберите платформу деплоя

#### Вариант A: Vercel (рекомендуется)

Добавьте secrets:
```
VERCEL_TOKEN = your-vercel-token
VERCEL_ORG_ID = your-org-id
VERCEL_PROJECT_ID = your-project-id
```

**Как получить:**
1. Зарегистрируйтесь на [vercel.com](https://vercel.com)
2. Импортируйте репозиторий
3. Получите токены в Settings → Tokens

#### Вариант B: Netlify

Добавьте secrets:
```
NETLIFY_AUTH_TOKEN = your-netlify-token
NETLIFY_SITE_ID = your-site-id
```

**Как получить:**
1. Зарегистрируйтесь на [netlify.com](https://netlify.com)
2. Создайте новый сайт из Git
3. Получите токены в User Settings → Applications

#### Вариант C: GitHub Pages (бесплатно)

Не требует дополнительных secrets!

**Настройка:**
1. Перейдите в **Settings** → **Pages**
2. Source: **GitHub Actions**
3. Сохраните

### 3. Активируйте нужный workflow

По умолчанию все deploy workflows отключены. Активируйте один:

**Для Vercel:**
```bash
# Удалите или закомментируйте другие deploy workflows
rm .github/workflows/deploy-netlify.yml
rm .github/workflows/deploy-github-pages.yml
```

**Для Netlify:**
```bash
rm .github/workflows/deploy-vercel.yml
rm .github/workflows/deploy-github-pages.yml
```

**Для GitHub Pages:**
```bash
rm .github/workflows/deploy-vercel.yml
rm .github/workflows/deploy-netlify.yml
```

### 4. Настройте защиту ветки main

Перейдите в **Settings** → **Branches** → **Add branch protection rule**

- Branch name pattern: `main`
- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging
  - Выберите: `Type Check`, `Build`

### 5. Сделайте первый push

```bash
git add .
git commit -m "Initial commit with GitHub Actions"
git push origin main
```

## ✅ Проверка работы

1. Перейдите в **Actions** в вашем репозитории
2. Вы должны увидеть запущенный workflow **CI**
3. Дождитесь завершения всех проверок
4. Если настроен деплой - проверьте URL вашего сайта

## 🎯 Создание первого релиза

```bash
# Создайте тег
git tag v1.0.0
git push origin v1.0.0
```

Это автоматически:
- Соберёт приложение
- Создаст архивы
- Сгенерирует changelog
- Создаст GitHub Release

## 📊 Мониторинг

### Просмотр логов
**Actions** → Выберите workflow → Нажмите на job

### Статус бейджи
Добавьте в README.md:

```markdown
![CI](https://github.com/USERNAME/REPO/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/USERNAME/REPO/actions/workflows/deploy-vercel.yml/badge.svg)
```

## 🔧 Полезные команды

```bash
# Запустить workflow вручную
# Actions → Выберите workflow → Run workflow

# Отменить запущенный workflow
# Actions → Выберите workflow → Cancel workflow

# Повторить failed workflow
# Actions → Выберите workflow → Re-run jobs
```

## 🐛 Если что-то не работает

### Проблема: Workflow не запускается
**Решение:** Проверьте, что файлы находятся в `.github/workflows/`

### Проблема: Build fails
**Решение:** Проверьте логи в Actions, убедитесь что secrets настроены

### Проблема: Deploy fails
**Решение:** Проверьте токены и IDs платформ деплоя

### Проблема: Secrets не доступны
**Решение:** Убедитесь что имена secrets совпадают с workflow

## 📚 Документация

- [GITHUB_ACTIONS.md](./GITHUB_ACTIONS.md) - Подробная документация
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Настройка Supabase
- [README.md](./README.md) - Основная документация

## 💡 Советы

1. **Используйте Vercel** - самая простая интеграция с GitHub
2. **Включите Dependabot** - автоматическое обновление зависимостей
3. **Защитите ветку main** - требуйте PR и проверки перед мержем
4. **Создавайте релизы** - используйте теги для версионирования
5. **Мониторьте security** - проверяйте audit logs регулярно

---

**Готово!** 🎉 Ваш CI/CD pipeline настроен и готов к работе.

При следующем push в main автоматически:
1. Проверится код
2. Соберётся приложение
3. Задеплоится на выбранную платформу
