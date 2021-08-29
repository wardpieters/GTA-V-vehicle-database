<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VehicleSearchRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'q' => 'present|max:255',
            'game_update' => 'present|array',
            'game_update.*' => [
                'integer',
                Rule::exists('game_updates', 'id')
            ],
            'website' => 'present|array',
            'website.*' => [
                'integer',
                Rule::exists('websites', 'id')
            ],
            'type' => 'present|array',
            'type.*' => [
                'integer',
                Rule::exists('vehicle_types', 'id')
            ],
        ];
    }
}
