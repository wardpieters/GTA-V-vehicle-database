<?php

use App\Models\VehicleType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVehicleTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehicle_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn('type');
        });

        Schema::table('vehicles', function (Blueprint $table) {
            $table->foreignIdFor(VehicleType::class)->nullable()->after('slug')->constrained();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropConstrainedForeignId('vehicle_type_id');
        });

        Schema::table('vehicles', function (Blueprint $table) {
            $table->string('type')->after('slug');
        });

        Schema::dropIfExists('vehicle_types');
    }
}
