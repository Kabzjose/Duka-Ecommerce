'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { adminApi } from '@/lib/admin';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ApiError } from '@/lib/api';
import type { Product } from '@/lib/types';

export default function AdminProductsPage() {
  const { accessToken } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', stockQuantity: '', category: '', imageUrl: '' });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    if (!accessToken) return;
    const res = await adminApi.listProducts(accessToken);
    setProducts(res.items);
  }

  useEffect(() => {
    load();
  }, [accessToken]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setError(null);
    setBusy(true);
    try {
      await adminApi.createProduct(accessToken, {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity),
        category: form.category,
        ...(form.imageUrl && { imageUrl: form.imageUrl }),
      });
      setForm({ name: '', description: '', price: '', stockQuantity: '', category: '', imageUrl: '' });
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create product');
    } finally {
      setBusy(false);
    }
  }

  async function handleDeactivate(id: string) {
    if (!accessToken) return;
    await adminApi.deactivateProduct(accessToken, id);
    await load();
  }

  async function handleStockUpdate(id: string, stockQuantity: number) {
    if (!accessToken) return;
    await adminApi.updateProduct(accessToken, id, { stockQuantity });
    await load();
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">Products</h1>
        <Button size="sm" onClick={() => setShowForm((s) => !s)}>New Product</Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="border border-border rounded p-5 mb-6 grid grid-cols-2 gap-3 max-w-2xl">
          <Input label="Name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <Input label="Category" required value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
          <Input label="Price (KES)" type="number" required value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
          <Input label="Stock Quantity" type="number" required value={form.stockQuantity} onChange={(e) => setForm((f) => ({ ...f, stockQuantity: e.target.value }))} />
          <Input label="Image URL (optional)" value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} />
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium">Description</label>
            <textarea
              required
              rows={3}
              className="rounded border border-border bg-white/60 px-3 py-2 text-sm"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="col-span-2 flex items-center gap-3">
            <Button type="submit" isLoading={busy}>Create Product</Button>
            {error && <p className="text-sm text-danger">{error}</p>}
          </div>
        </form>
      )}

      <div className="border border-border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/[0.02] text-left text-xs text-muted">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3 text-muted">{p.category}</td>
                <td className="px-4 py-3 font-mono">{p.price.toLocaleString('en-KE')}</td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    defaultValue={p.stockQuantity}
                    onBlur={(e) => {
                      const val = Number(e.target.value);
                      if (val !== p.stockQuantity) handleStockUpdate(p.id, val);
                    }}
                    className="w-16 rounded border border-border px-2 py-1 text-sm font-mono"
                  />
                </td>
                <td className="px-4 py-3">{p.isActive ? 'Active' : 'Inactive'}</td>
                <td className="px-4 py-3">
                  {p.isActive && (
                    <button onClick={() => handleDeactivate(p.id)} className="text-xs text-danger hover:underline">
                      Deactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
