<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class State
 * 
 * Represents a state (column) in the business board.
 */
class State extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     * 
     * @var array<string>
     */
    protected $fillable = ['name'];

    /**
     * Get all businesses associated with this state.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function businesses()
    {
        return $this->hasMany(Business::class);
    }
}
