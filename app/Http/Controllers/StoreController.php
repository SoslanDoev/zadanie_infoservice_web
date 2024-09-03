<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Requests\StoreRequest;
use Illuminate\Support\Facades\Hash;

class StoreController extends Controller
{
    public function index(StoreRequest $req) {
        $data = $req->validated();
        $data["password"] = Hash::make($data["password"]);
        $user = User::firstOrCreate([
            "email" => $data["email"],
        ], $data);
        return $user;
        // return new UserResource($user);
    }
}
