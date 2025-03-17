<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\BusinessType;
use App\Models\State;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BusinessController extends Controller
{
    public function index()
    {
        $businesses = Business::with(['businessType', 'user', 'state'])->get();
        Log::info('Businesses loaded:', $businesses->toArray());
        return response()->json($businesses);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'business_type_id' => 'required|exists:business_types,id',
            'user_id' => 'required|exists:users,id',
            'state_id' => 'required|exists:states,id',
            'value' => 'required|numeric|min:0',
        ]);

        $business = Business::create($request->all());

        $business->load('user');

        return response()->json($business, 201);
    }

    public function update(Request $request, Business $business)
    {
        Log::info('Dados recebidos para atualização:', $request->all());

        $validated = $request->validate([
            'state_id' => 'required|exists:states,id',
            'name' => 'nullable|string|max:255',
            'business_type_id' => 'nullable|exists:business_types,id',
            'user_id' => 'nullable|exists:users,id',
            'value' => 'nullable|numeric|min:0',
        ]);

        $business->update($validated);

        return response()->json($business->load('businessType', 'user', 'state'));
    }

    public function destroy(Business $business)
    {
        $business->delete();
        return response()->json(['message' => 'Negócio removido com sucesso']);
    }
}

