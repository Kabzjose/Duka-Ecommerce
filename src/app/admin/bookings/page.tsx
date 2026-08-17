'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { adminApi } from '@/lib/admin';
import type { Booking } from '@/lib/types';

const STATUSES = ['', 'AWAITING_PAYMENT', 'PENDING', 'CONFIRMED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];

export default function AdminBookingsPage() {
  const { accessToken } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    setIsLoading(true);
    adminApi
      .listBookings(accessToken, statusFilter || undefined)
      .then((res) => setBookings(res.items))
      .finally(() => setIsLoading(false));
  }, [accessToken, statusFilter]);

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-semibold mb-6">Bookings</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded text-sm border ${
              statusFilter === s ? 'bg-ink text-white border-ink' : 'border-border text-muted hover:border-ink'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-sm text-muted">No bookings found.</p>
      ) : (
        <div className="border border-border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-black/[0.02] text-left text-xs text-muted">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Recipient</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Rider</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td className="px-4 py-3 font-mono text-xs">{b.id.slice(0, 8)}</td>
                  <td className="px-4 py-3">{b.recipientName}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded bg-brand-light text-brand-dark font-medium">{b.status}</span>
                  </td>
                  <td className="px-4 py-3 text-muted">{b.rider?.name ?? '—'}</td>
                  <td className="px-4 py-3 font-mono">{b.price.toLocaleString('en-KE')}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/bookings/${b.id}`} className="text-brand text-xs font-medium hover:underline">
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
