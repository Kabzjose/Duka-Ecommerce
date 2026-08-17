'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { riderApi } from '@/lib/rider';
import { Button } from '@/components/ui/Button';
import { ApiError } from '@/lib/api';
import type { Booking } from '@/lib/types';
import { MapPin, Phone, User, Package } from 'lucide-react';

const STATUS_TRANSITIONS: Record<string, { label: string; nextStatus: string }> = {
  CONFIRMED: { label: 'Mark as Picked Up', nextStatus: 'PICKED_UP' },
  PICKED_UP: { label: 'Mark as In Transit', nextStatus: 'IN_TRANSIT' },
  IN_TRANSIT: { label: 'Mark as Delivered', nextStatus: 'DELIVERED' },
};

const FILTERS = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Completed', value: 'DELIVERED' },
  { label: 'All', value: '' },
];

export default function RiderDeliveriesPage() {
  const { accessToken } = useAuth();
  const [deliveries, setDeliveries] = useState<Booking[]>([]);
  const [filter, setFilter] = useState('ACTIVE');
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setIsLoading(true);
    try {
      const res = await riderApi.listDeliveries(accessToken);
      let items = res.items;
      if (filter === 'ACTIVE') {
        items = items.filter((b) => ['CONFIRMED', 'PICKED_UP', 'IN_TRANSIT'].includes(b.status));
      } else if (filter === 'DELIVERED') {
        items = items.filter((b) => b.status === 'DELIVERED' || b.status === 'CANCELLED');
      }
      setDeliveries(items);
    } catch {
      setDeliveries([]);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleStatusUpdate(bookingId: string, nextStatus: string) {
    if (!accessToken) return;
    setError(null);
    setBusyId(bookingId);
    try {
      await riderApi.updateBookingStatus(accessToken, bookingId, nextStatus);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update status');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-display text-2xl font-semibold mb-2">My Deliveries</h1>
      <p className="text-sm text-muted mb-6">View and update your assigned delivery tasks</p>

      <div className="flex gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded text-sm border ${
              filter === f.value ? 'bg-ink text-white border-ink' : 'border-border text-muted hover:border-ink'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-danger mb-4">{error}</p>}

      {isLoading ? (
        <p className="text-sm text-muted">Loading deliveries...</p>
      ) : deliveries.length === 0 ? (
        <div className="border border-border rounded p-8 text-center text-muted">
          <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium">No deliveries found</p>
          <p className="text-xs mt-1">Assigned orders will appear here once an admin assigns them to you.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {deliveries.map((b) => {
            const transition = STATUS_TRANSITIONS[b.status];
            return (
              <div key={b.id} className="border border-border rounded p-5 bg-white/40 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-semibold text-muted">#{b.id.slice(0, 8).toUpperCase()}</span>
                    <h2 className="font-medium text-sm mt-0.5">{b.recipientName}</h2>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-brand-light text-brand-dark font-medium">
                    {b.status}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-2 text-xs text-ink/80 border-t border-border pt-3 mt-1">
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-muted shrink-0" />
                    <span>{b.recipientPhone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-muted shrink-0" />
                    <span>Price: KES {b.price.toLocaleString('en-KE')}</span>
                  </div>
                  <div className="flex items-start gap-1.5 sm:col-span-2">
                    <MapPin className="h-3.5 w-3.5 text-muted shrink-0 mt-0.5" />
                    <span><strong className="text-muted">Pickup:</strong> {b.pickupAddress}</span>
                  </div>
                  <div className="flex items-start gap-1.5 sm:col-span-2">
                    <MapPin className="h-3.5 w-3.5 text-muted shrink-0 mt-0.5 text-brand" />
                    <span><strong className="text-muted">Dropoff:</strong> {b.dropoffAddress}</span>
                  </div>
                </div>

                {transition && (
                  <div className="pt-2 border-t border-border flex justify-end">
                    <Button
                      size="sm"
                      isLoading={busyId === b.id}
                      onClick={() => handleStatusUpdate(b.id, transition.nextStatus)}
                    >
                      {transition.label}
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
