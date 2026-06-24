<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Portal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PortalController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->string('search'));

        $portals = Portal::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('url', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Portals/Index', [
            'portals' => $portals,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Portals/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'url' => ['required', 'url', 'max:255'],
            'image' => ['nullable', 'image', 'max:2048'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('portals', 'public');
        }

        $data['is_active'] = $request->boolean('is_active');

        Portal::create($data);

        return redirect()->route('admin.portals.index')->with('success', 'Portal created successfully.');
    }

    public function edit(Portal $portal)
    {
        return Inertia::render('Admin/Portals/Edit', [
            'portal' => $portal,
        ]);
    }

    public function update(Request $request, Portal $portal): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'url' => ['required', 'url', 'max:255'],
            'image' => ['nullable', 'image', 'max:2048'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if ($request->hasFile('image')) {
            if ($portal->image_path) {
                Storage::disk('public')->delete($portal->image_path);
            }
            $data['image_path'] = $request->file('image')->store('portals', 'public');
        }

        $data['is_active'] = $request->boolean('is_active');

        $portal->update($data);

        return redirect()->route('admin.portals.index')->with('success', 'Portal updated successfully.');
    }

    public function destroy(Portal $portal): RedirectResponse
    {
        if ($portal->image_path) {
            Storage::disk('public')->delete($portal->image_path);
        }

        $portal->delete();

        return redirect()->route('admin.portals.index')->with('success', 'Portal deleted successfully.');
    }

    public function toggleStatus(Request $request, Portal $portal): RedirectResponse
    {
        $portal->update(['is_active' => $request->boolean('is_active')]);

        return redirect()->route('admin.portals.index')->with('success', 'Portal status updated.');
    }
}
