<?php

use App\Http\Controllers\GameUpdateController;
use App\Http\Controllers\VehicleCollectionController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\VehicleTypeController;
use App\Http\Controllers\WebsiteController;
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

// Vehicles
Route::match(['get', 'post'], 'vehicles', [VehicleController::class, 'index']);
Route::apiResource('vehicles', VehicleController::class)->only(['show']);

Route::apiResource('types', VehicleTypeController::class)->only(['index']);
Route::apiResource('updates', GameUpdateController::class)->only(['index']);
Route::apiResource('websites', WebsiteController::class)->only(['index']);

