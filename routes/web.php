<?php

use App\Http\Controllers\Admin\PortalController as AdminPortalController;
use App\Http\Controllers\Admin\GroupController as AdminGroupController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PortalController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PortalController::class, 'index'])->name('home');

Route::middleware('auth')->get('/dashboard', function () {
    $user = auth()->user();

    return $user && $user->role === 'admin'
        ? redirect()->route('admin.dashboard')
        : redirect()->route('home');
})->name('dashboard');

Route::middleware('guest')->group(function () {
    Route::get('login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('login', [AuthController::class, 'login'])->name('login.post');
    Route::get('register-user', [AuthController::class, 'showRegisterForm'])->name('register.simple');
    Route::post('register-user', [AuthController::class, 'register'])->name('register.simple.post');
});

Route::post('logout', [AuthController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', [AdminPortalController::class, 'index'])->name('dashboard');

        Route::resource('portals', AdminPortalController::class)->except(['show']);
        Route::put('portals/{portal}/status', [AdminPortalController::class, 'toggleStatus'])
            ->name('portals.status');

        Route::resource('groups', AdminGroupController::class)->except(['show']);
        Route::put('groups/{group}/status', [AdminGroupController::class, 'toggleStatus'])
            ->name('groups.status');

        Route::resource('users', AdminUserController::class)->except(['show']);
        Route::put('users/{user}/status', [AdminUserController::class, 'toggleStatus'])
            ->name('users.status');
    });
