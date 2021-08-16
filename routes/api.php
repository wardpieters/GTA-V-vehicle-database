<?php

use App\Http\Controllers\VehicleCollectionController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\VehicleTypeController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::apiResource('collections', VehicleCollectionController::class)->only(['index']);
//Route::apiResource('collections/{slug}/vehicles', VehicleCollectionController::class)->only(['index']);
Route::apiResource('vehicles', VehicleController::class)->only(['index']);
Route::get('vehicles/types', [VehicleTypeController::class, 'index']);

