<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('leed', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string("surname");
            $table->string("phone");
            $table->string("email");
            $table->text("text");
            $table->string("status")->default("Новый");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('leed');
    }
};
