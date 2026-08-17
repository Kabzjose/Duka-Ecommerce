'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { adminApi } from '@/lib/admin';
import { Button } from '@/components/ui/Button';
import { ApiError } from '@/lib/api';
import type { Booking, AdminUser } from '@/lib/types';

const NEXT_STATUS: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PICKED_UP', 'CANCELLED'],
  PICKED_UP: ['IN_TRANSIT', 'CANCELLED'],
  IN_TRANSIT: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
  AWAITING_PAYMENT: [],
};

export default function AdminBookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [riders, setRiders] = useState<AdminUser[]>([]);
  const [selectedRiderId, setSelectedRiderId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!accessToken || !id) return;
    const res = await adminApi.getBooking(accessToken, id);
    setBooking(res.booking);
  }, [accessToken, id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!accessToken) return;
    adminApi.listUsers(accessToken, 'RIDER').then((res) => setRiders(res.items.filter((r) => r.isActive)));
  }, [accessToken]);

  async function handleAssign() {
    if (!accessToken || !id || !selectedRiderId) return;
    setError(null);
    setBusy(true);
    try {
      await adminApi.assignRider(accessToken, id, selectedRiderId);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to assign rider');
    } finally {
      setBusy(false);
    }
  }

  async function handleStatusChange(status: string) {
    if (!accessToken || !id) return;
    setError(null);
    setBusy(true);
    try {
      await adminApi.updateBookingStatus(accessToken, id, status);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update status');
    } finally {
      setBusy(false);
    }
  }

  if (!booking) return <div className="p-8 text-muted">Loading...</div>;

  const nextOptions = NEXT_STATUS[booking.status] ?? [];

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-display text-2xl font-semibold mb-1">Booking #{booking.id.slice(0, 8).toUpperCase()}</h1>
      <p className="text-sm text-muted mb-6">
        <span className="px-2 py-1 rounded bg-brand-light text-brand-dark font-medium text-xs">{booking.status}</span>
      </p>

      <div className="border border-border rounded p-5 mb-6 text-sm">
        <p className="mb-1"><span className="text-muted">Recipient:</span> {booking.recipientName} · {booking.recipientPhone}</p>
        <p className="mb-1"><span className="text-muted">Pickup:</span> {booking.pickupAddress}</p>
        <p className="mb-1"><span className="text-muted">Dropoff:</span> {booking.dropoffAddress}</p>
        <p className="mb-1"><span className="text-muted">Delivery Fee:</span> KES {booking.price.toLocaleString('en-KE')}</p>
        {booking.order && (
          <>
            <p className="mb-1"><span className="text-muted">Products Total:</span> KES {booking.order.productsTotal.toLocaleString('en-KE')}</p>
            <p><span className="text-muted">Order Total:</span> KES {booking.order.totalAmount.toLocaleString('en-KE')}</p>
          </>
        )}
      </div>

      {error && <p className="text-sm text-danger mb-4">{error}</p>}

      {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
        <div className="border border-border rounded p-5 mb-6">
          <h2 className="text-sm font-medium mb-3">Assign Rider</h2>
          <div className="flex gap-2">
            <select
              value={selectedRiderId}
              onChange={(e) => setSelectedRiderId(e.target.value)}
              className="flex-1 rounded border border-border bg-white/60 px-3 py-2 text-sm"
            >
              <option value="">{booking.rider ? `Currently: ${booking.rider.name}` : 'Select a rider'}</option>
              {riders.map((r) => (
                <option key={r.id} value={r.id}>{r.name} — {r.phone}</option>
              ))}
            </select>
            <Button onClick={handleAssign} isLoading={busy} disabled={!selectedRiderId}>
              Assign
            </Button>
          </div>
        </div>
      )}

      {nextOptions.length > 0 && (
        <div className="border border-border rounded p-5">
          <h2 className="text-sm font-medium mb-3">Update Status</h2>
          <div className="flex gap-2 flex-wrap">
            {nextOptions.map((s) => (
              <Button
                key={s}
                variant={s === 'CANCELLED' ? 'danger' : 'primary'}
                size="sm"
                onClick={() => handleStatusChange(s)}
                isLoading={busy}
              >
                Mark as {s}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
