<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Leed extends Model
{
    use HasFactory;
    public $table = 'leed';
    public $timestamps = true;
    protected $fillable = [
        'name',
        'surname',
        'phone',
        'email',
        'text',
        "status",
    ];
}
