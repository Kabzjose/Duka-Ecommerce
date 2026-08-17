'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Price } from '@/components/ui/Price';
import type { Order, PaginatedResponse } from '@/lib/types';
import { Package, ChevronRight, Clock } from 'lucide-react';

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

  if (isLoading) {
    return <div className="mx-auto max-w-4xl px-4 py-20 text-center text-muted font-mono text-sm">Loading order history...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="p-4 rounded-full bg-brand-light text-brand w-fit mx-auto mb-4">
          <Package className="h-10 w-10" />
        </div>
        <h2 className="font-display text-2xl font-extrabold text-ink mb-2">No Orders Placed Yet</h2>
        <p className="text-sm text-muted mb-6">Your past purchase orders and delivery tracking will appear here.</p>
        <Link href="/shop" className="text-sm font-bold text-brand hover:underline">
          Start Shopping Catalog &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand">Account Portal</span>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink mt-1">
          Order History ({orders.length})
        </h1>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const displayStatus = order.booking?.status
            ? DELIVERY_STATUS_LABELS[order.booking.status] ?? order.booking.status
            : STATUS_LABELS[order.status] ?? order.status;

          return (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="group block rounded-2xl border border-border bg-surface p-5 shadow-subtle hover:border-brand/40 hover:shadow-card-hover transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-ink">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-light text-brand-dark">
                      {displayStatus}
                    </span>
                  </div>
                  <p className="text-xs text-muted font-mono mt-1 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(order.createdAt).toLocaleDateString('en-KE', { dateStyle: 'medium' })} • {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-border-subtle">
                  <Price amount={order.totalAmount} size="sm" />
                  <span className="text-xs font-bold text-brand group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    View Details <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}