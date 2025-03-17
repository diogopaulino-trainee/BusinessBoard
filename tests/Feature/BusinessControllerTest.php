<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\BusinessType;
use App\Models\State;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class BusinessControllerTest extends TestCase
{
    public function test_can_create_business()
    {
        Log::info('Iniciando teste: Criar Business');

        $businessType = BusinessType::factory()->create();
        Log::info('BusinessType criado', ['id' => $businessType->id]);

        $user = User::factory()->create();
        Log::info('User criado', ['id' => $user->id]);

        $state = State::factory()->create();
        Log::info('State criado', ['id' => $state->id]);

        $payload = [
            'name' => 'Test Business',
            'business_type_id' => $businessType->id,
            'user_id' => $user->id,
            'state_id' => $state->id,
            'value' => 1000
        ];

        Log::info('📤 Enviando requisição para criar Business', $payload);
        $response = $this->postJson('/api/businesses', $payload);

        // Depuração (Descomentar se quiser ver a resposta no terminal)
        // dd($response->json());

        $response->assertStatus(201);
        Log::info('Business criado com sucesso', ['response' => $response->json()]);

        $this->assertDatabaseHas('businesses', ['name' => 'Test Business']);
        Log::info('O Business está presente na base de dados');
    }

    public function test_can_update_business()
    {
        Log::info('Iniciando teste: Atualizar Business');

        $business = Business::factory()->create();
        Log::info('Business original criado', ['id' => $business->id]);

        $newState = State::factory()->create();
        Log::info('Novo State criado', ['id' => $newState->id]);

        $payload = ['state_id' => $newState->id];

        Log::info('Enviando requisição para atualizar Business', ['business_id' => $business->id, 'payload' => $payload]);
        $response = $this->putJson("/api/businesses/{$business->id}", $payload);

        $response->assertStatus(200);
        Log::info('Business atualizado com sucesso', ['response' => $response->json()]);

        $this->assertDatabaseHas('businesses', ['id' => $business->id, 'state_id' => $newState->id]);
        Log::info('A atualização foi refletida na base de dados');
    }

    public function test_can_delete_business()
    {
        Log::info('Iniciando teste: Deletar Business');

        $business = Business::factory()->create();
        Log::info('Business criado', ['id' => $business->id]);

        Log::info('Enviando requisição para deletar Business', ['business_id' => $business->id]);
        $response = $this->deleteJson("/api/businesses/{$business->id}");

        $response->assertStatus(200);
        Log::info('Business deletado com sucesso');

        $this->assertDatabaseMissing('businesses', ['id' => $business->id]);
        Log::info('O Business não está mais na base de dados');
    }
}
