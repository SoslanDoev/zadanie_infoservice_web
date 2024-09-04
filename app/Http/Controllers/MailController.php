<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class MailController extends Controller
{
    public function send(Request $request)
    {
        Mail::raw('Тестовое сообщение', function ($message) {
            $message->to('soslan2002osetia@mail.ru')
                    ->subject('Тестовая почта');
        });
        return 'Письмо отправлено!';
    }
}
