Проект Laravel + Vue.js
Это проект на базе Laravel и Vue.js

Установка зависимостей
<p>npm install</p>
<p>composer install</p>

Скопируйте файл .env.example в .env:
<p>copy .env.example .env  # Windows</p>
<p>cp .env.example .env  # Linux/MacOS</p>

Сгенерируйте ключ приложения:
<p>php artisan key:generate</p>

Также сгенерируйте секрет для JWT аутентификации:
<p>php artisan jwt:secret</p>

Для работы с БД
Измените значения на свои данные:

<p>DB_DATABASE — имя созданной базы данных</p>
<p>DB_USERNAME — имя пользователя базы данных</p>
<p>DB_PASSWORD — пароль для этого пользователя</p>

После этого выполните миграции для создания необходимых таблиц:
<p>php artisan migrate</p>

Необходимо заполнить базу данных начальными данными, выполните сидер:
<p>php artisan db:seed --class=StatusTableSeeder</p>

Запуск локального сервера
<p>php artisan serve</p>

Запуск сборки фронтенда
<p>npm run dev</p>

<p>SMTP (Mail.ru) - уже настроен по умолчанию</p>

Теперь проект должен быть запущен локально на вашем устройстве! http://127.0.0.1:8000/
