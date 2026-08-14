'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getOrder } from '@/lib/orders';
import { Price } from '@/components/ui/Price';
import { Button } from '@/components/ui/Button';
import { CheckCircle2 } from 'lucide-react';
import type { Order } from '@/lib/types';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { accessToken } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId && accessToken) {
      getOrder(orderId, accessToken).then(setOrder);
    }
  }, [orderId, accessToken]);

  if (!orderId) return null;

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <CheckCircle2 className="h-12 w-12 text-brand mx-auto mb-4" />
      <h1 className="font-display text-2xl font-semibold mb-1">Order confirmed</h1>
      <p className="text-sm text-muted mb-8">Order #{orderId.slice(0, 8).toUpperCase()}</p>

      {order && (
        <div className="border border-border rounded p-5 text-left text-sm mb-8">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between py-1.5">
              <span className="text-muted">{item.product.name} × {item.quantity}</span>
              <span className="font-mono">{(item.unitPrice * item.quantity).toLocaleString('en-KE')}</span>
            </div>
          ))}
          <div className="border-t border-border mt-3 pt-3 flex justify-between font-medium">
            <span>Total</span>
            <Price amount={order.totalAmount} size="sm" />
          </div>
          <p className="text-muted mt-3">Delivering to: {order.dropoffAddress}</p>
          <p className="text-muted">Estimated delivery: Same day, based on zone</p>
        </div>
      )}

      <div className="flex gap-3 justify-center">
        <Link href="/orders"><Button>Track Order</Button></Link>
        <Link href="/shop"><Button variant="secondary">Continue Shopping</Button></Link>
      </div>
    </div>
  );
}
