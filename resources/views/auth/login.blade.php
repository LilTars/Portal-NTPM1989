@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-[#141414] text-white">
    <div class="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
        <div class="w-full rounded-3xl border border-white/10 bg-[#121212] p-10 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:max-w-xl">
            <div class="mb-8 text-center">
                <div class="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#E50914]/10 text-3xl text-[#E50914]">
                    <i class="fa-brands fa-netflix"></i>
                </div>
                <h1 class="mt-5 text-3xl font-semibold">Admin Login</h1>
                <p class="mt-2 text-sm text-slate-400">Sign in to manage portals and users.</p>
            </div>

            <form action="{{ route('login.post') }}" method="POST" class="space-y-6">
                @csrf

                <div>
                    <label class="mb-2 block text-sm font-medium text-white/80">Email</label>
                    <input type="email" name="email" value="{{ old('email') }}" required autofocus class="w-full rounded-2xl border border-white/10 bg-[#1c1c1c] px-4 py-3 text-white outline-none transition focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]/30" />
                    @error('email')
                        <span class="mt-2 block text-sm text-red-500">{{ $message }}</span>
                    @enderror
                </div>

                <div>
                    <label class="mb-2 block text-sm font-medium text-white/80">Password</label>
                    <input type="password" name="password" required class="w-full rounded-2xl border border-white/10 bg-[#1c1c1c] px-4 py-3 text-white outline-none transition focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]/30" />
                    @error('password')
                        <span class="mt-2 block text-sm text-red-500">{{ $message }}</span>
                    @enderror
                </div>

                <button type="submit" class="w-full rounded-2xl bg-[#E50914] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-red-600">Login</button>
            </form>

            @if($errors->any())
                <div class="mt-6 rounded-2xl bg-red-600/10 p-4 text-sm text-red-200">
                    <ul class="list-disc space-y-1 pl-5">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif
        </div>
    </div>
</div>
@endsection
