<?php

namespace App\Http\Controllers;

use App\Models\Portal;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLoginForm()
    {
        return Inertia::render('Welcome', [
            'portals' => Portal::active()->latest()->get(),
            'showLoginModal' => true,
        ]);
    }

    public function showRegisterForm()
    {
        return Inertia::render('Auth/RegisterSimple');
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:100', 'unique:users,username'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        User::create([
            'name' => $data['name'],
            'username' => $data['username'],
            'email' => $data['username'].'@local.app',
            'password' => Hash::make($data['password']),
            'role' => 'user',
            'is_active' => true,
        ]);

        return redirect()->route('login')->with('status', 'Account created. Please log in.');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'login' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $login = $credentials['login'];
        $field = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        $user = User::where($field, $login)->first();

        if ($user && ! $user->is_active) {
            return back()->withErrors([
                'login' => 'Your account is inactive. Please contact the administrator.',
            ])->onlyInput('login');
        }

        if (! $user || ! Auth::attempt([$field => $login, 'password' => $credentials['password']], $request->boolean('remember'))) {
            return back()->withErrors([
                'login' => 'The provided credentials are incorrect.',
            ])->onlyInput('login');
        }

        $request->session()->regenerate();

        return redirect()->intended($user && $user->role === 'admin' ? route('admin.dashboard') : route('home'));
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
