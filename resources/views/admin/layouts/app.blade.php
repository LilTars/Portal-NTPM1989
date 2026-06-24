<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name', 'Admin Panel') }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-" crossorigin="anonymous" referrerpolicy="no-referrer" />
    @vite(['resources/css/app.css'])
    <style>
        body {
            font-family: 'Prompt', sans-serif;
            background: #0f0f0f;
            color: #f8fafc;
        }
    </style>
    @stack('head')
</head>
<body>
<div class="min-h-screen bg-[#111111]">
    <div class="flex min-h-screen flex-col lg:flex-row">
        <aside class="w-full border-b border-white/10 bg-[#121212] lg:w-72 lg:border-r lg:border-b-0">
            <div class="border-b border-white/10 px-6 py-5">
                <div class="flex items-center gap-3 text-xl font-semibold text-white">
                    <img src="{{ asset('images/โลโก้ร้านณัฐพงษ์.png') }}" alt="Logo" class="h-12 w-auto" />
                </div>
            </div>
            <nav class="px-6 py-8">
                <a href="{{ route('admin.dashboard') }}" class="mb-4 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white transition hover:bg-white/5">
                    <i class="fa-solid fa-chart-line text-[#E50914]"></i>
                    Dashboard
                </a>
                <a href="{{ route('admin.portals.index') }}" class="mb-4 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white transition hover:bg-white/5">
                    <i class="fa-solid fa-diagram-project text-[#E50914]"></i>
                    Manage Portals
                </a>
                <a href="{{ route('admin.users.index') }}" class="mb-4 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white transition hover:bg-white/5">
                    <i class="fa-solid fa-users text-[#E50914]"></i>
                    Manage Users
                </a>
                <form action="{{ route('logout') }}" method="POST" class="mt-6">
                    @csrf
                    <button type="submit" class="flex w-full items-center gap-3 rounded-2xl bg-[#E50914] px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-red-600">
                        <i class="fa-solid fa-right-from-bracket"></i>
                        Logout
                    </button>
                </form>
            </nav>
        </aside>

        <main class="flex-1 p-6 lg:p-10">
            @if(session('success'))
                <div class="mb-6 rounded-3xl bg-emerald-500/10 px-5 py-4 text-sm text-emerald-200 ring-1 ring-emerald-500/20">
                    {{ session('success') }}
                </div>
            @endif

            @if($errors->any())
                <div class="mb-6 rounded-3xl bg-red-500/10 px-5 py-4 text-sm text-red-200 ring-1 ring-red-500/20">
                    <ul class="list-disc space-y-1 pl-5">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            @yield('content')
        </main>
    </div>
</div>
@stack('scripts')
</body>
</html>
