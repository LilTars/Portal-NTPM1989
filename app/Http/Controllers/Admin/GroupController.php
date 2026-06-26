<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Group;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GroupController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->string('search'));

        $groups = Group::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Groups/Index', [
            'groups' => $groups,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Groups/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:groups,name'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $data['is_active'] = $request->boolean('is_active');

        Group::create($data);

        return redirect()->route('admin.groups.index')->with('success', 'Group created successfully.');
    }

    public function edit(Group $group)
    {
        return Inertia::render('Admin/Groups/Edit', [
            'group' => $group,
        ]);
    }

    public function update(Request $request, Group $group): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:groups,name,' . $group->id],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $data['is_active'] = $request->boolean('is_active');

        $group->update($data);

        return redirect()->route('admin.groups.index')->with('success', 'Group updated successfully.');
    }

    public function destroy(Group $group): RedirectResponse
    {
        if ($group->portals()->exists()) {
            return redirect()->route('admin.groups.index')->with('error', 'Cannot delete group that still has portals.');
        }

        $group->delete();

        return redirect()->route('admin.groups.index')->with('success', 'Group deleted successfully.');
    }

    public function toggleStatus(Request $request, Group $group): RedirectResponse
    {
        $group->update(['is_active' => $request->boolean('is_active')]);

        return redirect()->route('admin.groups.index')->with('success', 'Group status updated.');
    }
}
