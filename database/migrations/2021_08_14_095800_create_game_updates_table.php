<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGameUpdatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('game_updates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn('conditional');
            $table->foreignId('game_update_id')->nullable()->after('type')->constrained();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('game_updates');

        Schema::table('vehicles', function (Blueprint $table) {
            $table->string('conditional')->nullable();
            $table->dropColumn('game_update_id');
        });
    }
}
