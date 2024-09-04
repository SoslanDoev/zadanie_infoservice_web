<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Leed;
use Illuminate\Support\Facades\Validator;

class LeedController extends Controller
{
    public function index() {
        $data = Leed::all();
        return response()->json($data);
    }

    public function update(Request $req, $id) {
        $data = Leed::find($id);
        if (!$data)
          return response(["status" => 400, "message" => "Ошибка. Запись не найдена"]);
        $validator = Validator::make($req->all(), [
            'status' => 'required|min:2|max:50',
        ]);
        if ($validator->fails())
            return response(["status" => 400, "errors" => $validator->errors(), "message" => "Ошибка. Запись не обновлена"]);
        $result = $data->update($req->all());
        return $result;
    }

    public function store(Request $req) {
        $validator = Validator::make($req->all(), [
            'name' => 'required|string|min:2|max:50',
            'surname' => 'required|string|min:2|max:50',
            'phone' => [
                'required',
                'regex:/^(\+?[0-9\s\-\(\)]*)$/', // Регулярное выражение для проверки телефонного номера
                'min:10', // Минимальная длина для телефона
                'max:20', // Максимальная длина для телефона
            ],
            'email' => 'required|email|max:100', // Добавлено правило для проверки формата email
            'text' => 'required|string|min:2|max:500', // Увеличен максимум для текста, так как 50 символов может быть мало
            'status' => 'string|min:2|max:50', // Пример допустимых значений для статуса
        ]);
        if ($validator->fails())
            return response(["errors" => $validator->errors()]);
        $data = Leed::create($req->all());
        if (!$data) 
            return response(["status" => 400, "message" => "Ошибка. Запись не добавлена"]);
        return $data;
    }

    // Функция удаления записи
    // Входные параметры: $id - идентификатор лида
    public function destroy($id) {
        $data = Leed::find($id);
        if (!$data)
            return response(["status" => 400, "message" => "Ошибка. Запись не найдена"]);
        $data->delete();
        // return response()->json('Запись удалена');
        return response(["status" => 200, "message" => "Запись удалена"]);
    }
}
