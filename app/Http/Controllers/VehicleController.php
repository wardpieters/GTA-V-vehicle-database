<?php

namespace App\Http\Controllers;

use App\Http\Resources\VehicleResource;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class VehicleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse|AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $query = $request->get('q');

        if (!isset($query) || strlen($query) < 2) {
            return response()->json(['data' => [], 'error' => ['message' => "Please provide a search query."]]);
        }

        DB::enableQueryLog(); // Enable query log

        $vehicles = Vehicle::where(function ($q) use ($query) {
            $q->where('name', 'LIKE', "%$query%");
            $q->orWhere('slug', 'LIKE', "%$query%");
        })
            ->when(!empty($request->input('vehicle_type')), function ($q) use ($request) {
                return $q->where('vehicle_type_id', '=', $request->input('vehicle_type'));
            })->get();

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
     * @return Response
     */
    public function show($id)
    {
        //
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
