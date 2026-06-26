<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Inertia\Inertia;

class PortalController extends Controller
{
    public function index()
    {
        $groups = Group::query()
            ->active()
            ->whereHas('portals', fn ($query) => $query->active())
            ->with(['portals' => fn ($query) => $query->active()->latest()])
            ->orderBy('name')
            ->get();

        return Inertia::render('Welcome', [
            'groups' => $groups,
        ]);
    }
}
