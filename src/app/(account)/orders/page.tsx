'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Price } from '@/components/ui/Price';
import type { Order, PaginatedResponse } from '@/lib/types';

const STATUS_LABELS: Record<string, string> = {
  AWAITING_PAYMENT: 'Awaiting Payment',
  PAID: 'Processing',
  CANCELLED: 'Cancelled',
};

const DELIVERY_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Preparing',
  CONFIRMED: 'Rider Assigned',
  PICKED_UP: 'Picked Up',
  IN_TRANSIT: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export default function OrdersPage() {
  const { accessToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    api.get<PaginatedResponse<Order>>('/orders', accessToken)
      .then((res) => setOrders(res.items))
      .finally(() => setIsLoading(false));
  }, [accessToken]);

  if (isLoading) return <div className="mx-auto max-w-4xl px-4 py-16 text-center text-muted">Loading orders...</div>;

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="font-medium mb-2">No orders yet</p>
        <p className="text-sm text-muted">Your order history will show up here.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-display text-2xl font-semibold mb-6">Order History</h1>
      <div className="divide-y divide-border border-t border-b border-border">
        {orders.map((order) => {
          const displayStatus = order.booking?.status
            ? DELIVERY_STATUS_LABELS[order.booking.status] ?? order.booking.status
            : STATUS_LABELS[order.status] ?? order.status;

          return (
            <Link key={order.id} href={`/orders/${order.id}`} className="flex items-center justify-between py-4 hover:bg-black/[0.02] px-2 -mx-2 rounded">
              <div>
                <p className="text-sm font-medium">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-xs text-muted mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString('en-KE', { dateStyle: 'medium' })} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs px-2 py-1 rounded bg-brand-light text-brand-dark font-medium">{displayStatus}</span>
                <Price amount={order.totalAmount} size="sm" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}