<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Подтверждение аккаунта</title>
</head>
<body>
    <h1>Привет, {{ $user->name }}!</h1>
    <p>Спасибо за регистрацию в нашем приложении. Пожалуйста, подтвердите свой аккаунт, нажав на ссылку ниже:</p>
    <a href="{{ url('/api/verify-email/' . $token) }}">Подтвердить аккаунт</a>
    <p>Если вы не создавали аккаунт, просто проигнорируйте это письмо.</p>
</body>
</html>
