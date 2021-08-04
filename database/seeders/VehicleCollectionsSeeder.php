<?php

namespace Database\Seeders;

use App\Models\VehicleCollection;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Spatie\Regex\Regex;
use Spatie\Regex\RegexFailed;

class VehicleCollectionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     * @throws RegexFailed
     */
    public function run()
    {
        // https://socialclub.rockstargames.com/gtav/VehiclesAjax
        $response = Http::get('https://socialclub.rockstargames.com/gtav/VehiclesAjax');

        if($response->ok()) {
            $body = $response->body();
            $regex = Regex::match('/settings.VehiclesJson = (.*);/', $body);

            if ($regex->hasMatch()) {
                $match = json_decode($regex->group(1), true);
                foreach ($match['VehicleCollections'] as $collection) {
                    VehicleCollection::updateOrCreate([
                        'slug' => $collection['Url'],
                    ], [
                        'name' => $collection['Name'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}
