<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

// Для отправки писем на почту
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['email', 'password']);

        if (! $token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth()->user());
    }
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'old_password' => 'required',
            'new_password' => 'required|min:3|confirmed',
            "new_password_confirmation" => "required|min:3"
        ]);
        if ($validator->fails())
            return response(["status" => 400, "errors" => $validator->errors(), "message" => "Ошибка. Валидация не прошла"]);
        // Проверка старого пароля
        if (!Hash::check($request->old_password, auth()->user()->password)) {
            return response(["status" => 400, "errors" => "Ошибка. Проверьте правильность паролей"]);
        }

        // Обновление пароля
        $user = auth()->user();
        $user->password = Hash::make($request->new_password);
        $user->save();

        // Инвалидация текущих JWT токенов (по желанию)
        auth()->logout();

        return response()->json([
            "status" => 200,
            'message' => 'Пароль успешно изменен',
        ]);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }
}
