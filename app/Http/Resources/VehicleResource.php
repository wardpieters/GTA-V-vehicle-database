<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class VehicleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'name' => $this->name,
            'slug' => $this->slug,
            'type' => $this->type,
            'conditional' => $this->conditional,
            'speed' => $this->speed,
            'acceleration' => $this->acceleration,
            'braking' => $this->braking,
            'handling' => $this->handling,
            'top_speed' => $this->top_speed,
            'top_acceleration' => $this->top_acceleration,
            'top_braking' => $this->top_braking,
            'top_handling' => $this->top_handling,
            'for_sale' => $this->for_sale,
            'website' => $this->website,
            'cost' => $this->cost,
            'seats' => $this->seats,
            'personal' => $this->personal,
            'premium' => $this->premium,
            'moddable' => $this->moddable,
            'super_moddable' => $this->super_moddable,
            'sellable' => $this->sellable,
            'sell_price' => $this->sell_price,
            'image_url' => "/storage/vehicles/$this->slug.jpg"
        ];
    }
}
