# 🤖 Telegram Bot (Vercel Serverless + Turso DB)

Telegram-бот для `@goosean_bot` ("lil gus"), работающий на **Vercel** без выделенного сервера с базой данных **Turso (libSQL/SQLite)**.

---

## 🚀 Быстрый запуск и подключение

### 1. Данные из Turso (https://app.turso.tech)
В открытой вкладке Turso:
1. Выберите вашу базу данных (или нажмите **Create Database**).
2. Скопируйте **Database URL** (вида `libsql://<db-name>-pierrot.turso.io`).
3. Нажмите **Create Token** (или **Show Token**) и скопируйте **Auth Token**.

---

### 2. Загрузка репозитория на GitHub (https://github.com)
1. В открытой вкладке GitHub нажмите **New repository** (или `+` -> *New repository*).
2. Назовите его, например, `tg-bot-turso` и нажмите **Create repository**.
3. Загрузите файлы этого проекта в созданный репозиторий:
   - Можно просто перетащить файлы проекта через браузер: кнопка **"uploading an existing file"** на странице репозитория.
   - Или через Git в терминале:
     ```bash
     cd C:\Users\nedoa\.gemini\antigravity\scratch\telegram-bot-turso
     git init
     git add .
     git commit -m "Initial commit: Vercel + Turso Telegram bot"
     git branch -M main
     git remote add origin https://github.com/<ваш-логин>/tg-bot-turso.git
     git push -u origin main
     ```

---

### 3. Деплой на Vercel (https://vercel.com)
1. В открытой вкладке Vercel нажмите **"Add New..."** -> **"Project"**.
2. В списке репозиториев GitHub найдите созданный `tg-bot-turso` и нажмите **"Import"**.
3. В блоке **"Environment Variables"** добавьте 3 переменные:
   - `BOT_TOKEN` = `9004019448:AAH2FR7XOuLFOWu41JB9Mx5BI9SC08x4BGg`
   - `TURSO_DATABASE_URL` = ваш URL из Turso
   - `TURSO_AUTH_TOKEN` = ваш токен из Turso
4. Нажмите **"Deploy"**.

---

### 4. Активация Webhook (В один клик!)
После завершения деплоя Vercel выдаст ссылку на проект (например: `https://tg-bot-turso.vercel.app`).

Просто перейдите в браузере по ссылке:
👉 **`https://<ваш-проект>.vercel.app/api/set-webhook`**

Бот автоматически зарегистрирует вебхук в Telegram, и в ответ появится `{"ok": true}`.

После этого откройте Telegram и напишите боту **@goosean_bot** команду `/start`!
