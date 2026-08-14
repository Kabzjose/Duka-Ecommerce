'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getOrder } from '@/lib/orders';
import { OrderTracker } from '@/components/orders/OrderTracker';
import { Price } from '@/components/ui/Price';
import type { Order } from '@/lib/types';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useAuth();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    if (id && accessToken) getOrder(id, accessToken).then(setOrder);
  }, [id, accessToken]);

  if (order === undefined) return <div className="mx-auto max-w-4xl px-4 py-16 text-center text-muted">Loading...</div>;
  if (order === null) return <div className="mx-auto max-w-4xl px-4 py-16 text-center text-muted">Order not found.</div>;

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
              <OrderTracker currentStatus="PENDING" />
              <p className="text-xs text-muted mt-2">Live tracking available once your delivery is picked up.</p>
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
