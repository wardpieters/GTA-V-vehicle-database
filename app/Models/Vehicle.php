<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehicle extends Model
{
    use HasFactory, SoftDeletes;

    protected $casts = [
        'top_speed' => 'boolean',
        'top_acceleration' => 'boolean',
        'top_braking' => 'boolean',
        'top_handling' => 'boolean',
        'for_sale' => 'boolean',
        'personal' => 'boolean',
        'premium' => 'boolean',
        'moddable' => 'boolean',
        'super_moddable' => 'boolean',
        'sellable' => 'boolean',
    ];
}
