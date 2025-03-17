<?php

namespace Tests\Feature;

use App\Models\State;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class StateControllerTest extends TestCase
{
    public function test_can_create_state()
    {
        Log::info('Iniciando teste: Criar State');

        State::where('name', 'New State')->delete();
        Log::info('Estados anteriores com o mesmo nome foram removidos');

        $payload = ['name' => 'New State'];

        Log::info('Enviando requisição para criar State', $payload);
        $response = $this->postJson('/api/states', $payload);

        if ($response->status() !== 201) {
            Log::error('Erro ao criar State', ['response' => $response->json()]);
        }

        $response->assertStatus(201);
        Log::info('State criado com sucesso', ['response' => $response->json()]);

        $this->assertDatabaseHas('states', ['name' => 'New State']);
        Log::info('Verificação concluída: O State está na base de dados');
    }

    public function test_cannot_create_duplicate_state()
    {
        Log::info('Iniciando teste: Criar State duplicado');

        $state = State::factory()->create();
        Log::info('State original criado', ['id' => $state->id, 'name' => $state->name]);

        $payload = ['name' => $state->name];

        Log::info('Enviando requisição para criar State duplicado', $payload);
        $response = $this->postJson('/api/states', $payload);

        $response->assertStatus(422);
        Log::info('A criação do State duplicado foi impedida corretamente');
    }

    public function test_can_delete_state_without_businesses()
    {
        Log::info('Iniciando teste: Deletar State');

        $state = State::factory()->create();
        Log::info('State criado', ['id' => $state->id]);

        Log::info('Enviando requisição para deletar State', ['state_id' => $state->id]);
        $response = $this->deleteJson("/api/states/{$state->id}");

        $response->assertStatus(200);
        Log::info('State deletado com sucesso');

        $this->assertDatabaseMissing('states', ['id' => $state->id]);
        Log::info('Verificação concluída: O State não está mais na base de dados');
    }
}
