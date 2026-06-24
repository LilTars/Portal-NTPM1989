<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class SimpleAuthFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_user_screen_can_be_rendered(): void
    {
        $response = $this->get('/register-user');

        $response->assertStatus(200);
    }

    public function test_new_user_can_register_with_custom_route(): void
    {
        $response = $this->post('/register-user', [
            'name' => 'Test User',
            'username' => 'testuser',
            'password' => 'password123',
        ]);

        $response->assertRedirect(route('login', absolute: false));
        $this->assertDatabaseHas('users', [
            'username' => 'testuser',
            'role' => 'user',
            'is_active' => true,
        ]);
    }

    public function test_user_can_login_with_username_and_logout(): void
    {
        $user = User::factory()->create([
            'username' => 'johnsmith',
            'email' => 'john@example.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'is_active' => true,
        ]);

        $response = $this->post('/login', [
            'login' => $user->username,
            'password' => 'password123',
        ]);

        $this->assertAuthenticatedAs($user);
        $response->assertRedirect(route('home', absolute: false));

        $logout = $this->post('/logout');
        $this->assertGuest();
        $logout->assertRedirect(route('login', absolute: false));
    }
}
