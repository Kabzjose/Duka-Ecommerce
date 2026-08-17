'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getOrder } from '@/lib/orders';
import { api } from '@/lib/api';
import { OrderTracker } from '@/components/orders/OrderTracker';
import { Price } from '@/components/ui/Price';
import type { Order, Booking } from '@/lib/types';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { accessToken, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!id || !accessToken) return;

    let cancelled = false;

    async function loadOrderAndBooking() {
      if(!id || !accessToken){
        console.error('Missing id or accessToken ');
        return;
      };
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
    return <div className="mx-auto max-w-4xl px-4 py-16 text-center text-muted">Checking your session...</div>;
  }
  if (!accessToken) {
    return <div className="mx-auto max-w-4xl px-4 py-16 text-center text-muted">Please log in to view this order.</div>;
  }
  if (order === undefined) {
    return <div className="mx-auto max-w-4xl px-4 py-16 text-center text-muted">Loading order...</div>;
  }
  if (order === null) {
    return <div className="mx-auto max-w-4xl px-4 py-16 text-center text-muted">Order not found.</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-display text-2xl font-semibold mb-1">Order #{order.id.slice(0, 8).toUpperCase()}</h1>
      <p className="text-sm text-muted mb-8">Placed {new Date(order.createdAt).toLocaleDateString('en-KE', { dateStyle: 'long' })}</p>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col gap-8">
          <div>
            <h2 className="text-sm font-medium mb-3">Items</h2>
            <div className="divide-y divide-border border-t border-b border-border">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between py-3 text-sm">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span className="font-mono">{(item.unitPrice * item.quantity).toLocaleString('en-KE')}</span>
                </div>
              ))}
            </div>
          </div>

          {order.bookingId && (
            <div>
              <h2 className="text-sm font-medium mb-3">Delivery Tracking</h2>
              {booking ? (
                <>
                  <OrderTracker currentStatus={booking.status} />
                  {booking.rider && (
                    <p className="text-xs text-muted mt-2">
                      Rider: {booking.rider.name} · {booking.rider.phone}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted">Loading delivery status...</p>
              )}
            </div>
          )}
        </div>

        <div className="border border-border rounded p-5 h-fit">
          <h2 className="text-sm font-medium mb-4">Summary</h2>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted">Products</span>
            <span className="font-mono">{order.productsTotal.toLocaleString('en-KE')}</span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-muted">Delivery</span>
            <span className="font-mono">{order.deliveryFee.toLocaleString('en-KE')}</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between font-medium">
            <span>Total</span>
            <Price amount={order.totalAmount} size="sm" />
          </div>
          <p className="text-xs text-muted mt-4">{order.recipientName} · {order.recipientPhone}</p>
          <p className="text-xs text-muted">{order.dropoffAddress}</p>
        </div>
      </div>
    </div>
  );
}
