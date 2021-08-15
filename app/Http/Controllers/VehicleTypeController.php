<?php

namespace App\Http\Controllers;

use App\Http\Resources\VehicleTypeResource;
use App\Models\VehicleType;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class VehicleTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return AnonymousResourceCollection
     */
    public function index()
    {
        return VehicleTypeResource::collection(VehicleType::all());
    }
}
