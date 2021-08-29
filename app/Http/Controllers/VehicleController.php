<?php

namespace App\Http\Controllers;

use App\Http\Resources\VehicleResource;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class VehicleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse|AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $query = $request->json()->get('q');
        $query_game_update = array_values($request->json()->get('game_update') ?? []) ?? [];

        $vehicles = Vehicle::with(['type', 'websites'])
            ->when(!empty($query), function ($q) use ($request, $query) {
                return $q->where(function ($q) use ($query) {
                    $q->where('name', 'LIKE', "%$query%");
                    $q->orWhere('slug', 'LIKE', "%$query%");
                });
            })
            ->when(!empty($request->json()->get('type')), function ($q) use ($request) {
                return $q->where('vehicle_type_id', '=', $request->input('type'));
            })
            ->when(!empty($query_game_update), function ($q) use ($request, $query_game_update) {
                return $q->whereIn('game_update_id', $query_game_update);
            })
            ->when(!empty($request->json()->get('website')), function ($q) use ($request) {
                $q->whereHas('websites', function ($query) use ($request) {
                    $query->where('websites.id', $request->input('website'));
                });
            })
            ->limit(100)
            ->orderBy('name')
            ->get();

        if ($vehicles->count() == 0) {
            return response()->json(['data' => [], 'error' => ['message' => "No results were found."]]);
        }

        return VehicleResource::collection($vehicles);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return VehicleResource
     */
    public function show($id): VehicleResource
    {
        $vehicle = Vehicle::with(['type', 'websites'])->where('slug', '=', $id)->first();

        if (!$vehicle) throw new ModelNotFoundException();

        return new VehicleResource($vehicle);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param int $id
     * @return Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return Response
     */
    public function destroy($id)
    {
        //
    }

    function dq($query){
        $sql = $query->toSql();
        foreach($query->getBindings() as $key => $binding){
            $sql = preg_replace('/\?/', "'$binding'", $sql, 1);
        }
        dd($sql);
    }
}
