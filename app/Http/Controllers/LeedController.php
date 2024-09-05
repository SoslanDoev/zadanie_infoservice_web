<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Leed;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\LeedResource;

class LeedController extends Controller
{
    /*
        Функция для получения лидов
        Входные параметры:
            -> null;
        Выход: 
            -> Коллекция объектов LeedResource, содержащая все записи лидов из таблицы Leed. 
    */
    public function index() {
        return LeedResource::collection(Leed::all());
    }

    /*
        Функция для обновления информации о лиде
        Входные параметры:
            -> Request $req; // Объект запроса, содержащий данные для обновления.
            -> int $id;      // Идентификатор лида, который необходимо обновить.
        Выход:
            -> JSON-ответ с информацией о статусе операции.
            Если запись не найдена, возвращает сообщение об ошибке.
            Если валидация данных не прошла, возвращает ошибки валидации.
            В противном случае, возвращает результат обновления записи.
    */
    public function update(Request $req, $id) {
        // return $req . $id;
        $data = Leed::find($id);
        if (!$data)
          return response(["status" => 400, "message" => "Ошибка. Запись не найдена"]);
        $validator = Validator::make($req->all(), [
            'status_id' => 'required|exists:status,id',
        ]);
        if ($validator->fails())
            return response(["status" => 400, "errors" => $validator->errors(), "message" => "Ошибка. Запись не обновлена"]);
        $result = $data->update($req->all());
        return $result;
    }

    /*
        Функция для создания нового лида в базе данных.
        Входные параметры:
            -> Request $req; // Объект запроса, содержащий данные для создания нового лида.
        Выход:
            -> JSON-ответ с информацией о статусе операции.
            Если валидация данных не прошла, возвращает ошибки валидации.
            Если запись не была успешно добавлена, возвращает сообщение об ошибке.
            В противном случае, возвращает созданный объект лида.
    */
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

    /*
        Функция удаления определенного лида
        Входные параметры:
            -> id - Идентификатор лида;
        Выход: 
            -> status - Код запроса
            -> message - Сообщение
    */
    public function destroy($id) {
        $data = Leed::find($id);
        if (!$data)
            return response(["status" => 400, "message" => "Ошибка. Запись не найдена"]);
        $data->delete();
        // return response()->json('Запись удалена');
        return response(["status" => 200, "message" => "Запись удалена"]);
    }
}
