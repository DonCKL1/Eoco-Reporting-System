<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WantedPerson extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'alias',
        'image_path',
        'case_reference',
        'wanted_since',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'wanted_since' => 'date',
    ];
}
