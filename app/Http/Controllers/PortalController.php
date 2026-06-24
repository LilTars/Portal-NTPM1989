<?php

namespace App\Http\Controllers;

use App\Models\Portal;
use Inertia\Inertia;

class PortalController extends Controller
{
    public function index()
    {
        $portals = Portal::active()->latest()->get();

        return Inertia::render('Welcome', [
            'portals' => $portals,
        ]);
    }
}
