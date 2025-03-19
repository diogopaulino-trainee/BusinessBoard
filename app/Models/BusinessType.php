<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class BusinessType
 * 
 * Represents the type/category of a business.
 */
class BusinessType extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     * 
     * @var array<string>
     */
    protected $fillable = ['name'];

    /**
     * Get all businesses associated with this business type.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function businesses()
    {
        return $this->hasMany(Business::class);
    }
}
