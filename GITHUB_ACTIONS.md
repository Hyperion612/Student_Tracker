# 🚀 Настройка GitHub Actions

## Обзор Workflows

Проект включает 5 автоматизированных workflows:

1. **CI** (`ci.yml`) - Проверка типов, линтинг, сборка при каждом push/PR
2. **Deploy to Vercel** (`deploy-vercel.yml`) - Автоматический деплой на Vercel
3. **Deploy to Netlify** (`deploy-netlify.yml`) - Автоматический деплой на Netlify
4. **Deploy to GitHub Pages** (`deploy-github-pages.yml`) - Деплой на GitHub Pages
5. **Security Audit** (`security.yml`) - Проверка безопасности зависимостей
6. **Release** (`release.yml`) - Автоматическое создание релизов

## 📋 Настройка Secrets

### 1. Supabase Secrets (обязательно)

Перейдите в **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Добавьте:

```
VITE_SUPABASE_URL
```
Значение: Ваш Project URL из Supabase (например, `https://abc123.supabase.co`)

```
VITE_SUPABASE_ANON_KEY
```
Значение: Ваш anon key из Supabase (начинается с `eyJ...`)

### 2. Vercel Secrets (для деплоя на Vercel)

#### Получение токенов:

1. Перейдите на [vercel.com](https://vercel.com)
2. Войдите в аккаунт
3. Перейдите в **Settings** → **Tokens**
4. Создайте новый токен:
   - Name: `GitHub Actions`
   - Scope: Ваш аккаунт
   - Expiration: No expiration (или по вашему выбору)
5. Скопируйте токен

#### Получение Project ID и Org ID:

1. Откройте ваш проект на Vercel
2. В URL вы увидите ID проекта: `vercel.com/your-team/your-project-id`
3. Org ID можно найти в **Settings** → **General** → **Team ID**

Добавьте secrets:

```
VERCEL_TOKEN
```
Значение: Токен из шага 4

```
VERCEL_ORG_ID
```
Значение: Ваш Team/Org ID

```
VERCEL_PROJECT_ID
```
Значение: ID проекта из URL

### 3. Netlify Secrets (для деплоя на Netlify)

#### Получение токенов:

1. Перейдите на [netlify.com](https://netlify.com)
2. Войдите в аккаунт
3. Перейдите в **User Settings** → **Applications** → **Personal access tokens**
4. Создайте новый токен:
   - Description: `GitHub Actions`
   - Expiration: No expiration
5. Скопируйте токен

#### Получение Site ID:

1. Откройте ваш сайт на Netlify
2. Перейдите в **Site settings** → **General**
3. Найдите **Site details** → **Site ID**
4. Скопируйте ID

Добавьте secrets:

```
NETLIFY_AUTH_TOKEN
```
Значение: Токен из шага 5

```
NETLIFY_SITE_ID
```
Значение: Site ID из шага 4

### 4. GitHub Pages (не требует дополнительных secrets)

GitHub Pages использует встроенный `GITHUB_TOKEN`, который автоматически предоставляется.

## 🔧 Активация Workflows

### Вариант 1: Vercel (рекомендуется)

1. Раскомментируйте workflow `deploy-vercel.yml`
2. Добавьте все Vercel secrets
3. Отключите другие deploy workflows (удалите или переименуйте)

### Вариант 2: Netlify

1. Раскомментируйте workflow `deploy-netlify.yml`
2. Добавьте все Netlify secrets
3. Отключите другие deploy workflows

### Вариант 3: GitHub Pages (бесплатно)

1. Раскомментируйте workflow `deploy-github-pages.yml`
2. Перейдите в **Settings** → **Pages**
3. В разделе **Build and deployment**:
   - Source: **GitHub Actions**
   - Workflow: выберите `deploy-github-pages.yml`
4. Сохраните настройки

## 📝 Использование

### Автоматические триггеры

**CI workflow** запускается автоматически при:
- Push в ветки `main` или `develop`
- Создании/обновлении Pull Request в `main` или `develop`

**Deploy workflows** запускаются автоматически при:
- Push в ветку `main`

**Security Audit** запускается:
- Каждый понедельник в полночь
- При push в `main`
- Вручную через **Actions** → **Security Audit** → **Run workflow**

**Release** запускается при:
- Push тега версии (например, `v1.0.0`)

### Ручной запуск

Любой workflow можно запустить вручную:

1. Перейдите в **Actions**
2. Выберите нужный workflow
3. Нажмите **Run workflow**
4. Выберите ветку и нажмите **Run workflow**

### Создание релиза

```bash
# Создайте и push тег
git tag v1.0.0
git push origin v1.0.0
```

Это автоматически:
1. Соберёт приложение
2. Создаст архивы (tar.gz и zip)
3. Сгенерирует changelog
4. Создаст GitHub Release с артефактами

## 🎯 Best Practices

### 1. Защита ветки main

Перейдите в **Settings** → **Branches** → **Add branch protection rule**:

- Branch name pattern: `main`
- ✅ Require a pull request before merging
  - Required approvals: 1
- ✅ Require status checks to pass before merging
  - Required: `Type Check`, `Build`
- ✅ Include administrators

### 2. Environment Secrets

Для разных окружений (production, staging) используйте **Environments**:

1. Перейдите в **Settings** → **Environments**
2. Создайте окружение (например, `production`)
3. Добавьте secrets для этого окружения
4. В workflow укажите:

```yaml
jobs:
  deploy:
    environment: production
    steps:
      - name: Deploy
        run: ...
```

### 3. Кэширование зависимостей

Все workflows уже используют кэширование npm для ускорения сборки.

### 4. Матрица тестирования

Для тестирования на разных версиях Node.js:

```yaml
strategy:
  matrix:
    node-version: [18, 20, 22]
```

## 🔍 Мониторинг

### Просмотр логов

1. Перейдите в **Actions**
2. Выберите нужный workflow run
3. Нажмите на job для просмотра деталей
4. Разверните шаги для просмотра логов

### Уведомления

GitHub автоматически отправляет email при:
- Failed workflow
- Successful deployment (если настроено)

Для дополнительных уведомлений используйте:
- Slack integration
- Discord webhooks
- Telegram bots

## 🐛 Отладка

### Проблема: Workflow не запускается

**Решение:**
- Проверьте, что workflow файл находится в `.github/workflows/`
- Убедитесь, что файл имеет расширение `.yml` или `.yaml`
- Проверьте синтаксис YAML

### Проблема: Build fails

**Решение:**
- Проверьте логи в Actions
- Убедитесь, что все secrets настроены
- Проверьте, что зависимости установлены корректно

### Проблема: Deploy fails

**Решение:**
- Проверьте токены и IDs
- Убедитесь, что проект создан на платформе деплоя
- Проверьте права доступа токена

### Проблема: Secrets не доступны

**Решение:**
- Проверьте, что secrets добавлены в правильном репозитории
- Убедитесь, что имена secrets совпадают с workflow
- Проверьте, что secrets не заэкспайрены

## 📊 Статус бейджи

Добавьте бейджи в README:

```markdown
![CI](https://github.com/username/repo/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/username/repo/actions/workflows/deploy-vercel.yml/badge.svg)
```

Замените `username/repo` на ваш репозиторий.

## 💰 Стоимость

- **GitHub Actions**: 2000 минут/месяц бесплатно для private repos
- **Vercel**: Free tier включает 100 GB bandwidth/month
- **Netlify**: Free tier включает 100 GB bandwidth/month
- **GitHub Pages**: Бесплатно для public repos

## 📚 Дополнительные ресурсы

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Action](https://github.com/marketplace/actions/vercel-action)
- [Netlify Action](https://github.com/marketplace/actions/netlify-actions)
- [GitHub Pages Action](https://github.com/marketplace/actions/deploy-pages)

---

Если возникли проблемы, проверьте логи в **Actions** или создайте issue в репозитории.
