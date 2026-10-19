<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    protected $fillable = [
        'user_id', 'client_id', 'invoice_number', 
        'issue_date', 'due_date', 'total_amount', 'status', 'items'
    ];

    protected $casts = [
        'items' => 'array',
    ];

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function client(): BelongsTo {
        return $this->belongsTo(Client::class);
    }
}
