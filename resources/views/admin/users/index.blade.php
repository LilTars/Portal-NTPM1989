@extends('admin.layouts.app')

@section('content')
<div class="flex flex-col gap-6">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
            <h1 class="text-3xl font-semibold">Manage Users</h1>
            <p class="text-sm text-slate-400">Create, edit, and manage application users and roles.</p>
        </div>
        <a href="{{ route('admin.users.create') }}" class="inline-flex items-center gap-2 rounded-2xl bg-[#E50914] px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600">
            <i class="fa-solid fa-user-plus"></i>
            New User
        </a>
    </div>

    <div class="overflow-x-auto rounded-3xl border border-white/10 bg-[#111111] p-4">
        <table class="min-w-full text-left text-sm text-slate-200">
            <thead>
                <tr class="border-b border-white/10 text-slate-400">
                    <th class="px-4 py-3">Name</th>
                    <th class="px-4 py-3">Email</th>
                    <th class="px-4 py-3">Role</th>
                    <th class="px-4 py-3">Status</th>
                    <th class="px-4 py-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($users as $user)
                    <tr class="border-b border-white/10">
                        <td class="px-4 py-4 font-medium text-white">{{ $user->name }}</td>
                        <td class="px-4 py-4 text-slate-300">{{ $user->email }}</td>
                        <td class="px-4 py-4 text-slate-300">{{ ucfirst($user->role) }}</td>
                        <td class="px-4 py-4">
                            <form action="{{ route('admin.users.status', $user) }}" method="POST">
                                @csrf
                                @method('PUT')
                                <label class="inline-flex cursor-pointer items-center gap-3">
                                    <input type="hidden" name="is_active" value="0">
                                    <input type="checkbox" name="is_active" value="1" class="peer sr-only" {{ $user->is_active ? 'checked' : '' }} onchange="this.form.submit()" />
                                    <span class="block h-6 w-11 rounded-full bg-slate-700 transition peer-checked:bg-[#E50914]"></span>
                                    <span class="text-sm text-slate-300">{{ $user->is_active ? 'Active' : 'Inactive' }}</span>
                                </label>
                            </form>
                        </td>
                        <td class="px-4 py-4 space-x-2">
                            <a href="{{ route('admin.users.edit', $user) }}" class="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">
                                <i class="fa-solid fa-pen"></i>
                                Edit
                            </a>
                            @if(auth()->id() !== $user->id)
                                <form action="{{ route('admin.users.destroy', $user) }}" method="POST" class="inline-block" onsubmit="return confirm('Delete this user?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="inline-flex items-center gap-2 rounded-2xl bg-red-600/20 px-4 py-2 text-sm text-red-200 transition hover:bg-red-600/30">
                                        <i class="fa-solid fa-trash"></i>
                                        Delete
                                    </button>
                                </form>
                            @endif
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>
@endsection
