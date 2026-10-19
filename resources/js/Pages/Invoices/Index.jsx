import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function Index({ invoices, clients }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        client_id: '',
        issue_date: new Date().toISOString().slice(0, 10),
        due_date: '',
        items: [{ description: '', quantity: 1, price: 0 }]
    });

    const submit = (e) => {
        e.preventDefault();
        post('/invoices', {
            onSuccess: () => { setOpen(false); reset(); }
        });
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Mes Factures</h1>
                <button onClick={() => setOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
                    + Nouvelle Facture
                </button>
            </div>

            <div className="bg-white shadow rounded overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-3">N°</th>
                            <th className="p-3">Client</th>
                            <th className="p-3">Montant</th>
                            <th className="p-3">Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((inv) => (
                            <tr key={inv.id} className="border-b">
                                <td className="p-3 font-medium">{inv.invoice_number}</td>
                                <td className="p-3">{inv.client?.name}</td>
                                <td className="p-3">{inv.total_amount} FCFA</td>
                                <td className="p-3"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">{inv.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                    <form onSubmit={submit} className="bg-white p-6 rounded-lg max-w-lg w-full space-y-4">
                        <h2 className="text-xl font-bold">Créer une facture</h2>
                        
                        <div>
                            <label className="block text-sm font-medium">Client</label>
                            <select value={data.client_id} onChange={e => setData('client_id', e.target.value)} className="w-full border p-2 rounded mt-1">
                                <option value="">Choisir un client</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-medium">Date d'émission</label>
                                <input type="date" value={data.issue_date} onChange={e => setData('issue_date', e.target.value)} className="w-full border p-2 rounded mt-1" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Date d'échéance</label>
                                <input type="date" value={data.due_date} onChange={e => setData('due_date', e.target.value)} className="w-full border p-2 rounded mt-1" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Ligne de service</label>
                            <div className="flex gap-2">
                                <input type="text" placeholder="Description" value={data.items[0].description} onChange={e => setData('items', [{ ...data.items[0], description: e.target.value }])} className="flex-1 border p-2 rounded" />
                                <input type="number" placeholder="Qté" value={data.items[0].quantity} onChange={e => setData('items', [{ ...data.items[0], quantity: e.target.value }])} className="w-20 border p-2 rounded" />
                                <input type="number" placeholder="Prix" value={data.items[0].price} onChange={e => setData('items', [{ ...data.items[0], price: e.target.value }])} className="w-28 border p-2 rounded" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Annuler</button>
                            <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded">Enregistrer</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
