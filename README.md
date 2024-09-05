Проект Laravel + Vue.js
Это проект на базе Laravel и Vue.js

Установка зависимостей
npm install
composer install

Скопируйте файл .env.example в .env:
copy .env.example .env  # Windows
cp .env.example .env  # Linux/MacOS

Сгенерируйте ключ приложения:
php artisan key:generate

Также сгенерируйте секрет для JWT аутентификации:
php artisan jwt:secret

Для работы с БД
Измените значения на свои данные:

DB_DATABASE — имя созданной базы данных
DB_USERNAME — имя пользователя базы данных
DB_PASSWORD — пароль для этого пользователя

После этого выполните миграции для создания необходимых таблиц:
php artisan migrate

Необходимо заполнить базу данных начальными данными, выполните сидер:
php artisan db:seed --class=StatusTableSeeder

Запуск локального сервера
php artisan serve

Запуск сборки фронтенда
npm run dev

SMTP (Mail.ru) - уже настроен по умолчанию

Теперь проект должен быть запущен локально на вашем устройстве! http://127.0.0.1:8000/