<?php

use App\Http\Controllers\MailController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LeedController;

// подтверждение аккаунта
use App\Http\Controllers\EmailVerificationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(["namespace" => "User", "prefix" => "users"], function() {
    Route::post("/", [StoreController::class, "index"]);
});

// Для пользователя 
Route::group(['middleware' => 'api','prefix' => 'auth'], function ($router) {
    Route::post("/login", [AuthController::class, "login"]); // Авторизация
    Route::post("/logout", [AuthController::class, "logout"]); // Выход
    Route::post("/refresh", [AuthController::class, "refresh"]); // Обновление ключа
    Route::post("/me", [AuthController::class, "me"]); // Вся информация
    Route::post("/password_change", [AuthController::class, "changePassword"]); // Смена пароля
});

Route::get('/send-mail', [MailController::class, 'send']);

// Для подтверждения аккаунта
Route::get('/verify-email-message/{id}', [StoreController::class, 'verifyMessage']);
Route::get('/verify-email/{token}', [StoreController::class, 'verify']);

// Leed
Route::group(["namespace" => "Leed", "prefix" => "leed"], function() {
    Route::get("/", [LeedController::class, "index"]);
    Route::post("/", [LeedController::class, "store"]);
    Route::delete("/{id}", [LeedController::class, "destroy"]);
    Route::patch('/{id}', [LeedController::class, 'update']);
});