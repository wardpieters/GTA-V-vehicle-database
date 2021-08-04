<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVehiclesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_collection_id')->constrained();

            $table->string('name');
            $table->string('slug');
            $table->string('type');
            $table->string('conditional')->nullable();
            $table->double('speed')->unsigned();
            $table->double('acceleration')->unsigned();
            $table->double('braking')->unsigned();
            $table->double('handling')->unsigned();
            $table->boolean('top_speed');
            $table->boolean('top_acceleration');
            $table->boolean('top_braking');
            $table->boolean('top_handling');
            $table->boolean('for_sale');
            $table->string('cost');
            $table->string('website')->nullable();
            $table->integer('seats')->unsigned();
            $table->boolean('personal');
            $table->boolean('premium');
            $table->boolean('moddable');
            $table->boolean('super_moddable');
            $table->boolean('sellable');
            $table->string('sell_price');

            $table->unique(['vehicle_collection_id', 'slug']);
            $table->softDeletes();
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
        Schema::dropIfExists('vehicles');
    }
}
