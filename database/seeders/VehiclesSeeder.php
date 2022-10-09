<?php

namespace Database\Seeders;

use App\Models\GameUpdate;
use App\Models\Vehicle;
use App\Models\VehicleCollection;
use App\Models\VehicleType;
use App\Models\Website;
use Carbon\Carbon;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
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
            $regex = Regex::match('/VehiclesJson": {(.*)}/', $body);

            if (!$regex->hasMatch()) {
                $this->command->error("API data error\n");
                return;
            }

            $match = json_decode("{" . $regex->group(1) . "}", true);
            foreach ($match['VehicleCollections'] as $vehicle_collection) {
                if ($vehicle_collection['Url'] !== $collection['slug']) continue;

                $this->command->info("Seeding vehicle collection '$collection[slug]' ...");

                $i = 0;
                foreach ($vehicle_collection['Vehicles'] as $vehicle) {
                    $gameUpdate = null;
                    $vehicleType = null;

                    if(!empty($vehicle['Conditional'])) {
                        $gameUpdate = GameUpdate::firstOrCreate(
                            ['name' => $vehicle['Conditional']],
                            ['name' => $vehicle['Conditional']]
                        );
                    }

                    if(!empty($vehicle['Type'])) {
                        $vehicleType = VehicleType::firstOrCreate(
                            ['name' => $vehicle['Type']],
                            ['name' => $vehicle['Type']]
                        );
                    }

                    $new_vehicle = Vehicle::updateOrCreate([
                        'slug' => $vehicle['Url'],
                        'vehicle_collection_id' => $collection['id']
                    ], [
                        'name' => $vehicle['Name'],
                        'vehicle_type_id' => (!empty($vehicleType) ? $vehicleType->id : null),
                        'game_update_id' => (!empty($gameUpdate) ? $gameUpdate->id : null),
                        'speed' => $vehicle['Speed'],
                        'acceleration' => $vehicle['Acceleration'],
                        'braking' => $vehicle['Braking'],
                        'handling' => $vehicle['Handling'],
                        'top_speed' => $vehicle['TopSpeed'],
                        'top_acceleration' => $vehicle['TopAcceleration'],
                        'top_braking' => $vehicle['TopBraking'],
                        'top_handling' => $vehicle['TopHandling'],
                        'for_sale' => $vehicle['ForSale'],
                        'cost' => $this->formatPrice($vehicle['Cost']),
                        'seats' => $vehicle['Seats'],
                        'personal' => $vehicle['Personal'],
                        'premium' => $vehicle['Premium'],
                        'moddable' => $vehicle['Moddable'],
                        'super_moddable' => $vehicle['SuperModdable'],
                        'sellable' => $vehicle['Sellable'],
                        'sell_price' => $this->formatPrice($vehicle['SellPrice']),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    if (!$new_vehicle) {
                        $this->command->error("Vehicle error: can't update or create " . ($vehicle['Name'] ?? "Unknow vehicle") . "\n");
                    }

                    $websites = array_filter(explode(', ', $vehicle['Website'] ?? ""));
                    if (!empty($websites)) {
                        $website_ids = [];

                        foreach($websites as $new_website) {
                            $new_website = str_replace('www.', '', $new_website);

                            $website = Website::firstOrCreate(
                                ['name' => $new_website],
                                ['name' => $new_website]
                            );

                            $website_ids[] = $website->id;
                        }

                        $new_vehicle->websites()->sync($website_ids);
                    }

                    // Download image if vehicle was just created.
                    if ($new_vehicle && $new_vehicle->wasRecentlyCreated) {
                        $i++;
                        $vehicleImage = $this->saveVehicleImage($cdn_client, $new_vehicle);
                        $new_vehicle->update(['image_path' => empty($vehicleImage) ? "no-img.png" : $vehicleImage]);
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

    /**
     * @param Client $client
     * @param Vehicle $vehicle
     * @return false|string
     * @throws GuzzleException
     */
    function saveVehicleImage(Client $client, Vehicle $vehicle) {
        try {
            $this->createDirectory('app/public/vehicles');

            $file_name = "$vehicle->slug.jpg";
            $file_path = "vehicles/$file_name";
            $storage_path = storage_path("app/public/vehicles/$file_name");

            if (!file_exists($storage_path)) {
                $client->request('GET', "/sc/images/games/GTAV/vehicles/screens/mp/main/$file_name", [
                    'sink' => $storage_path
                ]);
            }

            return $file_path;
        } catch (\Exception $ignored) {
            return false;
        }
    }

    function formatPrice($price) {
        if (str_starts_with($price, 'FREE')) return 0.0;

        $new_price = (float) str_replace([',', '$', 'K', 'M', '*'], '', $price);

        if (str_ends_with($price, 'K') || str_ends_with($price, 'K*')) {
            $new_price *= 1000;
        } elseif (str_ends_with($price, 'M') || str_ends_with($price, 'M*')) {
            $new_price *= 1000000;
        }

        return $new_price;
    }
}
