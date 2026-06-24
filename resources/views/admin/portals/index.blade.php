@extends('admin.layouts.app')

@section('content')
<div class="flex flex-col gap-6">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
            <h1 class="text-3xl font-semibold">Manage Portals</h1>
            <p class="text-sm text-slate-400">Create, edit, and activate the portal cards shown on the public site.</p>
        </div>
        <a href="{{ route('admin.portals.create') }}" class="inline-flex items-center gap-2 rounded-2xl bg-[#E50914] px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600">
            <i class="fa-solid fa-plus"></i>
            New Portal
        </a>
    </div>

    <div class="overflow-x-auto rounded-3xl border border-white/10 bg-[#111111] p-4">
        <table class="min-w-full text-left text-sm text-slate-200">
            <thead>
                <tr class="border-b border-white/10 text-slate-400">
                    <th class="px-4 py-3">Thumbnail</th>
                    <th class="px-4 py-3">Name</th>
                    <th class="px-4 py-3">URL</th>
                    <th class="px-4 py-3">Status</th>
                    <th class="px-4 py-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($portals as $portal)
                    <tr class="border-b border-white/10">
                        <td class="px-4 py-4">
                            <div class="h-16 w-28 overflow-hidden rounded-2xl bg-slate-800">
                                @if($portal->image_path)
                                    <img src="{{ asset('storage/' . $portal->image_path) }}" alt="{{ $portal->name }}" class="h-full w-full object-cover" />
                                @else
                                    <div class="flex h-full items-center justify-center text-xs uppercase tracking-[0.2em] text-slate-500">No image</div>
                                @endif
                            </div>
                        </td>
                        <td class="px-4 py-4 font-medium text-white">{{ $portal->name }}</td>
                        <td class="px-4 py-4 text-slate-300">{{ $portal->url }}</td>
                        <td class="px-4 py-4">
                            <form action="{{ route('admin.portals.status', $portal) }}" method="POST">
                                @csrf
                                @method('PUT')
                                <label class="inline-flex cursor-pointer items-center gap-3">
                                    <input type="hidden" name="is_active" value="0">
                                    <input type="checkbox" name="is_active" value="1" class="peer sr-only" {{ $portal->is_active ? 'checked' : '' }} onchange="this.form.submit()" />
                                    <span class="block h-6 w-11 rounded-full bg-slate-700 transition peer-checked:bg-[#E50914]"></span>
                                    <span class="text-sm text-slate-300">{{ $portal->is_active ? 'Active' : 'Inactive' }}</span>
                                </label>
                            </form>
                        </td>
                        <td class="px-4 py-4 space-x-2">
                            <a href="{{ route('admin.portals.edit', $portal) }}" class="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">
                                <i class="fa-solid fa-pen"></i>
                                Edit
                            </a>
                            <form action="{{ route('admin.portals.destroy', $portal) }}" method="POST" class="inline-block" onsubmit="return confirm('Delete this portal?');">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="inline-flex items-center gap-2 rounded-2xl bg-red-600/20 px-4 py-2 text-sm text-red-200 transition hover:bg-red-600/30">
                                    <i class="fa-solid fa-trash"></i>
                                    Delete
                                </button>
                            </form>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>
@endsection
