<?php

namespace Database\Seeders;

use App\Models\Vehicle;
use App\Models\VehicleCollection;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Database\Seeder;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Facades\Http;
use Spatie\Regex\Regex;
use Spatie\Regex\RegexFailed;

class VehiclesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     * @throws RegexFailed
     */
    public function run()
    {
        $collections = VehicleCollection::all();

        foreach ($collections as $collection) {
            // https://socialclub.rockstargames.com/gtav/VehiclesAjax
            $response = Http::get(config('services.rockstar.socialclub.endpoint') . "?slot=Freemode&category=$collection[slug]&_=" . Carbon::now()->timestamp);
            $cdn_client = new Client([
                'base_uri' => config('services.rockstar.cdn.endpoint'),
                'timeout' => 2
            ]);

            if (!$response->ok()) {
                $this->command->error("API connection error\n");
                return;
            }

            $body = $response->body();
            $regex = Regex::match('/settings.VehiclesJson = (.*);/', $body);

            if (!$regex->hasMatch()) {
                $this->command->error("API data error\n");
                return;
            }

            $match = json_decode($regex->group(1), true);
            foreach ($match['VehicleCollections'] as $vehicle_collection) {
                if ($vehicle_collection['Url'] !== $collection['slug']) continue;

                $this->command->info("Seeding vehicle collection $collection[slug]...");

                $i = 0;
                foreach ($vehicle_collection['Vehicles'] as $vehicle) {
                    $new_vehicle = Vehicle::updateOrCreate([
                        'slug' => $vehicle['Url'],
                        'vehicle_collection_id' => $collection['id']
                    ], [
                        'name' => $vehicle['Name'],
                        'type' => $vehicle['Type'],
                        'conditional' => $vehicle['Conditional'] ?? null,
                        'speed' => $vehicle['Speed'],
                        'acceleration' => $vehicle['Acceleration'],
                        'braking' => $vehicle['Braking'],
                        'handling' => $vehicle['Handling'],
                        'top_speed' => $vehicle['TopSpeed'],
                        'top_acceleration' => $vehicle['TopAcceleration'],
                        'top_braking' => $vehicle['TopBraking'],
                        'top_handling' => $vehicle['TopHandling'],
                        'for_sale' => $vehicle['ForSale'],
                        'cost' => $vehicle['Cost'],
                        'website' => $vehicle['Website'] ?? null,
                        'seats' => $vehicle['Seats'],
                        'personal' => $vehicle['Personal'],
                        'premium' => $vehicle['Premium'],
                        'moddable' => $vehicle['Moddable'],
                        'super_moddable' => $vehicle['SuperModdable'],
                        'sellable' => $vehicle['Sellable'],
                        'sell_price' => $vehicle['SellPrice'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    if (!$new_vehicle) {
                        $this->command->error("Vehicle error: can't update or create " . ($vehicle['Name'] ?? "Unknow vehicle") . "\n");
                    }

                    // Download image if vehicle was just created.
                    if ($new_vehicle && $new_vehicle->wasRecentlyCreated) {
                        $i++;
                        $this->saveVehicleImage($cdn_client, $new_vehicle);
                    }
                }

                $this->command->info($i . " vehicles added.");
            }
        }
    }

    /**
     * @param $name
     * @return bool
     */
    function createDirectory($name)
    {
        $file = new Filesystem();
        if ($file->isDirectory(storage_path($name))) {
            return false;
        } else {
            $file->makeDirectory(storage_path($name));
            return true;
        }
    }

    function saveVehicleImage(Client $client, Vehicle $vehicle) {
        $file_name = "$vehicle->slug.jpg";
        $this->createDirectory('app/public/vehicles');

        $client->request('GET', "/sc/images/games/GTAV/vehicles/screens/mp/main/$file_name", [
            'sink' => storage_path("app/public/vehicles/$file_name")
        ]);
    }
}
