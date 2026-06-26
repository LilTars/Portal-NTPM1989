<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\Portal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PortalController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->string('search'));
        $groupId = trim((string) $request->string('group_id'));

        $groups = Group::query()->orderBy('name')->get(['id', 'name']);

        $portals = Portal::query()
            ->with('group:id,name')
            ->when($groupId !== '', function ($query) use ($groupId) {
                $query->where('group_id', $groupId);
            })
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($nested) use ($search) {
                    $nested->where('name', 'like', "%{$search}%")
                        ->orWhere('url', 'like', "%{$search}%")
                        ->orWhereHas('group', function ($groupQuery) use ($search) {
                            $groupQuery->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Portals/Index', [
            'portals' => $portals,
            'groups' => $groups,
            'filters' => [
                'search' => $search,
                'group_id' => $groupId,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Portals/Create', [
            'groups' => Group::query()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'is_active']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'group_id' => [
                'required',
                Rule::exists('groups', 'id')->where(fn ($query) => $query->where('is_active', true)),
            ],
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
            'groups' => Group::query()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'is_active']),
        ]);
    }

    public function update(Request $request, Portal $portal): RedirectResponse
    {
        $data = $request->validate([
            'group_id' => [
                'required',
                Rule::exists('groups', 'id')->where(fn ($query) => $query->where('is_active', true)),
            ],
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
