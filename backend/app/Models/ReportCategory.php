<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReportCategory extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'description',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    /**
     * All reports that belong to this category.
     */
    public function reports(): HasMany
    {
        return $this->hasMany(Report::class, 'category_id');
    }
}
