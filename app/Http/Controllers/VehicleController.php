<?php

namespace App\Http\Controllers;

use App\Http\Requests\VehicleSearchRequest;
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
    public function index(VehicleSearchRequest $request)
    {
        $query = $request->input('q');
        $query_game_update = $request->input('game_update');
        $query_website = $request->input('website');
        $query_type = $request->input('type');

        $vehicles = Vehicle::with(['type', 'websites'])
            ->when(!empty($query), function ($q) use ($request, $query) {
                return $q->where(function ($q) use ($query) {
                    $q->where('name', 'LIKE', "%$query%");
                    $q->orWhere('slug', 'LIKE', "%$query%");
                });
            })
            ->when(!empty($query_type), function ($q) use ($query_type) {
                return $q->whereIn('vehicle_type_id', $query_type);
            })
            ->when(!empty($query_game_update), function ($q) use ($query_game_update) {
                return $q->whereIn('game_update_id', $query_game_update);
            })
            ->when(!empty($query_website), function ($q) use ($query_website) {
                $q->whereHas('websites', function ($query) use ($query_website) {
                    $query->whereIn('websites.id', $query_website);
                });
            })
            ->limit(100)
            ->orderBy('name')
            ->paginate(40);

        return VehicleResource::collection($vehicles)->response()->getData(true);
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
