<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Requests\StoreRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Mail\AccountConfirmationMail;

class StoreController extends Controller
{
    public function index(StoreRequest $req) {
        $data = $req->validated();
        $data["password"] = Hash::make($data["password"]);

        // Проверка на наличие пользователя с данным email
        $existingUser = User::where("email", $data["email"])->first();
        if ($existingUser) {
            return response(["status" => 400, "message" => "Такой пользователь уже существует"]);
        }

        // Создание токена для подтверждения email
        $data['verification_token'] = Str::random(60);

        // Создание нового пользователя
        $user = User::create($data);

        // Токен для доступа (если нужно)
        $token = auth()->tokenById($user->id);

        // Отправка письма с подтверждением
        Mail::to($data["email"])->send(new AccountConfirmationMail($user, $data['verification_token']));

        return response(["access_token" => $token], 201);
    }

    public function verifyMessage ($id) {
        $user = User::find($id);
        if (!$user)
            return response(["status" => 400, "message" => "Пользователь не найден"]);
        // Отправка письма с подтверждением
        Mail::to($user["email"])->send(new AccountConfirmationMail($user, $user['verification_token']));
        return response(["status" => 200, "message" => "Сообщение отправлено на почту"]);
    }

    public function verify($token)
    {
        // Поиск пользователя по токену
        $user = User::where('verification_token', $token)->first();

        if (!$user) {
            return response(['status' => 400, 'message' => 'Неверный токен'], 400);
        }

        // Подтверждение email
        $user->email_verified_at = now();
        $user->verification_token = null; // Очистка токена после подтверждения
        $user->save();

        return response(['status' => 200, 'message' => 'Email подтвержден успешно']);
    }
}