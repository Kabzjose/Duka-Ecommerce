'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getOrder } from '@/lib/orders';
import { api } from '@/lib/api';
import { OrderTracker } from '@/components/orders/OrderTracker';
import { Price } from '@/components/ui/Price';
import type { Order, Booking } from '@/lib/types';
import { ChevronRight, Bike, MapPin, User, Package, Clock } from 'lucide-react';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { accessToken, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!id || !accessToken) return;

    let cancelled = false;

    async function loadOrderAndBooking() {
      if (!id || !accessToken) return;
      try {
        const orderData = await getOrder(id, accessToken);
        if (cancelled) return;
        setOrder(orderData);

        if (orderData?.bookingId) {
          try {
            const bookingRes = await api.get<{ booking: Booking }>(`/bookings/${orderData.bookingId}`, accessToken);
            if (!cancelled) setBooking(bookingRes.booking);
          } catch {
            // booking fetch failing shouldn't block showing the order itself
          }
        }
      } catch {
        if (!cancelled) setOrder(null);
      }
    }

    loadOrderAndBooking();
    const interval = setInterval(loadOrderAndBooking, 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [id, accessToken]);

  if (authLoading) {
    return <div className="mx-auto max-w-4xl px-4 py-20 text-center text-muted font-mono text-sm">Checking authentication...</div>;
  }
  if (!accessToken) {
    return <div className="mx-auto max-w-4xl px-4 py-20 text-center text-muted">Please log in to view this order.</div>;
  }
  if (order === undefined) {
    return <div className="mx-auto max-w-4xl px-4 py-20 text-center text-muted font-mono text-sm">Loading order details...</div>;
  }
  if (order === null) {
    return <div className="mx-auto max-w-4xl px-4 py-20 text-center text-muted">Order not found.</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-muted mb-6">
        <Link href="/account" className="hover:text-ink">Account</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/orders" className="hover:text-ink">Order History</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink font-bold font-mono">#{order.id.slice(0, 8).toUpperCase()}</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand">Order Confirmation</span>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink mt-0.5">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-xs text-muted font-mono mt-1 flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" /> Placed on {new Date(order.createdAt).toLocaleDateString('en-KE', { dateStyle: 'full' })}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Items & Delivery Tracker */}
        <div className="lg:col-span-7 space-y-8">
          {/* Order Items */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle">
            <h2 className="font-display text-base font-bold text-ink mb-4 pb-3 border-b border-border-subtle flex items-center gap-2">
              <Package className="h-4 w-4 text-brand" /> Purchased Items ({order.items.length})
            </h2>
            <div className="divide-y divide-border-subtle">
              {order.items.map((item) => (
                <div key={item.id} className="py-3.5 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-bold text-ink">{item.product.name}</p>
                    <p className="text-xs text-muted font-mono">
                      Quantity: {item.quantity} × KES {item.unitPrice.toLocaleString('en-KE')}
                    </p>
                  </div>
                  <Price amount={item.unitPrice * item.quantity} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Tracker Section */}
          {order.bookingId && (
            <div>
              {booking ? (
                <div className="space-y-4">
                  <OrderTracker currentStatus={booking.status} />
                  {booking.rider && (
                    <div className="p-4 rounded-xl bg-brand-light border border-brand/20 flex items-center gap-3 text-xs text-ink">
                      <Bike className="h-5 w-5 text-brand shrink-0" />
                      <div>
                        <p className="font-bold">Assigned Delivery Rider</p>
                        <p className="text-muted">{booking.rider.name} • {booking.rider.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted">Loading live delivery status...</p>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Order Summary & Shipping Address */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle space-y-4">
            <h2 className="font-display text-base font-bold text-ink pb-3 border-b border-border-subtle">
              Financial Breakdown
            </h2>
            <div className="space-y-2 text-sm text-muted">
              <div className="flex justify-between">
                <span>Products Subtotal</span>
                <span className="font-mono text-ink font-semibold">KES {order.productsTotal.toLocaleString('en-KE')}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-mono text-ink font-semibold">KES {order.deliveryFee.toLocaleString('en-KE')}</span>
              </div>
            </div>
            <div className="pt-3 border-t border-border-subtle flex justify-between items-baseline font-bold text-ink">
              <span>Total Paid</span>
              <Price amount={order.totalAmount} size="md" />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle space-y-3 text-xs">
            <h2 className="font-display text-base font-bold text-ink pb-3 border-b border-border-subtle flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand" /> Shipping Address
            </h2>
            <p className="font-bold text-ink flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-muted" /> {order.recipientName}
            </p>
            <p className="text-muted">{order.recipientPhone}</p>
            <p className="text-ink font-mono bg-bg p-2.5 rounded-lg border border-border-subtle">
              {order.dropoffAddress}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
