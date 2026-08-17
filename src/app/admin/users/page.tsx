'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { adminApi } from '@/lib/admin';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ApiError } from '@/lib/api';
import type { AdminUser } from '@/lib/types';

const ROLES = ['', 'CUSTOMER', 'RIDER', 'ADMIN', 'BUSINESS'];

export default function AdminUsersPage() {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'RIDER' as 'RIDER' | 'ADMIN' });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    if (!accessToken) return;
    const res = await adminApi.listUsers(accessToken, roleFilter || undefined);
    setUsers(res.items);
  }

  useEffect(() => {
    load();
  }, [accessToken, roleFilter]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setError(null);
    setBusy(true);
    try {
      await adminApi.createUser(accessToken, form);
      setForm({ name: '', email: '', phone: '', password: '', role: 'RIDER' });
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create user');
    } finally {
      setBusy(false);
    }
  }

  async function handleDeactivate(id: string) {
    if (!accessToken) return;
    await adminApi.deactivateUser(accessToken, id);
    await load();
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">Users & Riders</h1>
        <Button size="sm" onClick={() => setShowForm((s) => !s)}>New Rider/Admin</Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="border border-border rounded p-5 mb-6 grid grid-cols-2 gap-3 max-w-xl">
          <Input label="Name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          <Input label="Phone" placeholder="0712345678" required value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          <Input label="Password" type="password" required value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as 'RIDER' | 'ADMIN' }))}
              className="rounded border border-border bg-white/60 px-3 py-2 text-sm"
            >
              <option value="RIDER">Rider</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="col-span-2 flex items-center gap-3">
            <Button type="submit" isLoading={busy}>Create</Button>
            {error && <p className="text-sm text-danger">{error}</p>}
          </div>
        </form>
      )}

      <div className="flex gap-2 mb-4">
        {ROLES.map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-3 py-1.5 rounded text-sm border ${
              roleFilter === r ? 'bg-ink text-white border-ink' : 'border-border text-muted hover:border-ink'
            }`}
          >
            {r || 'All'}
          </button>
        ))}
      </div>

      <div className="border border-border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/[0.02] text-left text-xs text-muted">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3 text-muted">{u.email}</td>
                <td className="px-4 py-3 text-muted">{u.phone}</td>
                <td className="px-4 py-3">{u.role}</td>
                <td className="px-4 py-3">{u.isActive ? 'Active' : 'Deactivated'}</td>
                <td className="px-4 py-3">
                  {u.isActive && (
                    <button onClick={() => handleDeactivate(u.id)} className="text-xs text-danger hover:underline">
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
