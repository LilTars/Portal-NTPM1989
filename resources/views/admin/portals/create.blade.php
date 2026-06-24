@extends('admin.layouts.app')

@section('content')
<div class="space-y-6">
    <div>
        <h1 class="text-3xl font-semibold">Create Portal</h1>
        <p class="text-sm text-slate-400">Add a new portal to the public catalog.</p>
    </div>

    <form action="{{ route('admin.portals.store') }}" method="POST" enctype="multipart/form-data" class="space-y-6 rounded-3xl border border-white/10 bg-[#111111] p-6">
        @csrf

        <div class="grid gap-6 lg:grid-cols-2">
            <div>
                <label class="mb-2 block text-sm font-medium text-slate-300">Name</label>
                <input name="name" value="{{ old('name') }}" required class="w-full rounded-2xl border border-white/10 bg-[#121212] px-4 py-3 text-white outline-none transition focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]/20" />
            </div>
            <div>
                <label class="mb-2 block text-sm font-medium text-slate-300">URL</label>
                <input name="url" value="{{ old('url') }}" required class="w-full rounded-2xl border border-white/10 bg-[#121212] px-4 py-3 text-white outline-none transition focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]/20" />
            </div>
        </div>

        <div>
            <label class="mb-2 block text-sm font-medium text-slate-300">Description</label>
            <textarea name="description" rows="4" required class="w-full rounded-2xl border border-white/10 bg-[#121212] px-4 py-3 text-white outline-none transition focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]/20">{{ old('description') }}</textarea>
        </div>

        <div class="grid gap-6 lg:grid-cols-2">
            <div>
                <label class="mb-2 block text-sm font-medium text-slate-300">Image</label>
                <input type="file" name="image" accept="image/*" class="w-full rounded-2xl border border-white/10 bg-[#121212] px-4 py-3 text-white outline-none transition focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]/20" />
            </div>
            <div class="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#121212] p-4">
                <div>
                    <p class="text-sm font-medium text-white">Active</p>
                    <p class="text-xs text-slate-400">Enable this portal on the public page.</p>
                </div>
                <label class="inline-flex cursor-pointer items-center gap-3">
                    <input type="hidden" name="is_active" value="0">
                    <input type="checkbox" name="is_active" value="1" class="peer sr-only" checked />
                    <span class="block h-6 w-11 rounded-full bg-slate-700 transition peer-checked:bg-[#E50914]"></span>
                </label>
            </div>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <a href="{{ route('admin.portals.index') }}" class="inline-flex items-center justify-center rounded-2xl border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-[#E50914]">Cancel</a>
            <button type="submit" class="inline-flex items-center justify-center rounded-2xl bg-[#E50914] px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600">Create Portal</button>
        </div>
    </form>
</div>
@endsection
