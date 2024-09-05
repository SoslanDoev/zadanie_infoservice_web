<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StatusTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('status')->insert([
            'name' => "Новый",
        ]);
        DB::table('status')->insert([
            'name' => "В работе",
        ]);
        DB::table('status')->insert([
            'name' => "Завершен",
        ]);
    }
}
