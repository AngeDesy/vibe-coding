<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Invoices/Index', [
            'invoices' => $request->user()->invoices()->with('client')->latest()->get(),
            'clients' => $request->user()->clients()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'issue_date' => 'required|date',
            'due_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        $totalAmount = collect($validated['items'])->sum(fn($i) => $i['quantity'] * $i['price']);
        $invoiceNumber = 'FAC-' . date('Y') . '-' . str_pad(Invoice::count() + 1, 4, '0', STR_PAD_LEFT);

        $request->user()->invoices()->create([
            'client_id' => $validated['client_id'],
            'invoice_number' => $invoiceNumber,
            'issue_date' => $validated['issue_date'],
            'due_date' => $validated['due_date'],
            'total_amount' => $totalAmount,
            'items' => $validated['items'],
            'status' => 'pending',
        ]);

        return redirect()->back();
    }
}
