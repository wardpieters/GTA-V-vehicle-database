<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VehicleCollection extends Model
{
    use HasFactory, SoftDeletes;

    public function vehicles()
    {
        return $this->hasMany(Vehicle::class);
    }
}
