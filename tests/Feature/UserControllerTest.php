<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    public function test_can_create_user()
    {
        Log::info('Iniciando teste: Criar User');

        Mail::fake();
        Log::info('Simulação de envio de email ativada');

        User::where('email', 'john@example.com')->delete();
        Log::info('Removido qualquer User existente com email john@example.com');

        $payload = [
            'name' => 'John Doe',
            'email' => 'john@example.com'
        ];

        Log::info('Enviando requisição para criar User', $payload);
        $response = $this->postJson('/api/users', $payload);

        if ($response->status() !== 201) {
            Log::error('Erro ao criar User', ['response' => $response->json()]);
        }

        $response->assertStatus(201);
        Log::info('User criado com sucesso', ['response' => $response->json()]);

        $this->assertDatabaseHas('users', ['email' => 'john@example.com']);
        Log::info('Verificação concluída: O User está na base de dados');
    }

    public function test_cannot_create_duplicate_user()
    {
        Log::info('Iniciando teste: Impedir criação de User duplicado');

        User::where('email', 'john@example.com')->delete();
        Log::info('Utilizador anterior com email john@example.com removido');

        User::factory()->create(['email' => 'john@example.com']);
        Log::info('User original criado', ['email' => 'john@example.com']);

        $payload = [
            'name' => 'John Doe',
            'email' => 'john@example.com'
        ];

        Log::info('Enviando requisição para criar User duplicado', $payload);
        $response = $this->postJson('/api/users', $payload);

        if ($response->status() !== 422) {
            Log::error('O sistema permitiu a criação de um User duplicado', ['response' => $response->json()]);
        }

        $response->assertStatus(422);
        Log::info('A criação do User duplicado foi impedida corretamente');
    }
}
