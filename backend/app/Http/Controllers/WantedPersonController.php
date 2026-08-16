<?php

namespace App\Http\Controllers;

use App\Models\WantedPerson;
use Illuminate\Http\Request;

class WantedPersonController extends Controller
{
    /**
     * Public index - Returns only active wanted persons.
     */
    public function index()
    {
        $persons = WantedPerson::where('is_active', true)->get();
        return response()->json([
            'success' => true,
            'data' => $persons
        ]);
    }

    /**
     * Admin index - Returns all wanted persons.
     */
    public function adminIndex()
    {
        $persons = WantedPerson::all();
        return response()->json([
            'success' => true,
            'data' => $persons
        ]);
    }

    /**
     * Admin store
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'alias' => 'nullable|string|max:255',
            'image_path' => 'required|string',
            'case_reference' => 'nullable|string|max:255',
            'wanted_since' => 'nullable|date',
            'is_active' => 'boolean'
        ]);

        $person = WantedPerson::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Wanted person added successfully.',
            'data' => $person
        ], 201);
    }

    /**
     * Admin update
     */
    public function update(Request $request, WantedPerson $wantedPerson)
    {
        $validated = $request->validate([
            'full_name' => 'string|max:255',
            'alias' => 'nullable|string|max:255',
            'image_path' => 'string',
            'case_reference' => 'nullable|string|max:255',
            'wanted_since' => 'nullable|date',
            'is_active' => 'boolean'
        ]);

        $wantedPerson->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Wanted person updated successfully.',
            'data' => $wantedPerson
        ]);
    }

    /**
     * Admin destroy
     */
    public function destroy(WantedPerson $wantedPerson)
    {
        $wantedPerson->delete();

        return response()->json([
            'success' => true,
            'message' => 'Wanted person deleted successfully.'
        ]);
    }
}
