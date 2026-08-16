'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Loader2, XCircle } from 'lucide-react';

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { accessToken } = useAuth();
  const [status, setStatus] = useState<'checking' | 'failed'>('checking');
  const [attempts, setAttempts] = useState(0);

  const reference = searchParams.get('reference') ?? searchParams.get('trxref');

  useEffect(() => {
    if (!reference || !accessToken) return;

    let cancelled = false;

    async function pollForOrder() {
      // We don't have the orderId directly from Paystack's redirect — only the payment reference.
      // Poll a lookup endpoint that resolves reference -> order status.
      for (let i = 0; i < 15; i++) {
        if (cancelled) return;
        try {
          const res = await api.get<{ orderId: string; status: string }>(
            `/payments/paystack/status?reference=${reference}`,
            accessToken
          );
          if (res.status === 'PAID') {
            router.push(`/order-success?orderId=${res.orderId}`);
            return;
          }
          if (res.status === 'CANCELLED') {
            setStatus('failed');
            return;
          }
        } catch {
          // keep polling — order/payment record may still be settling right after redirect
        }
        setAttempts((a) => a + 1);
        await new Promise((r) => setTimeout(r, 2000));
      }
      setStatus('failed');
    }

    pollForOrder();
    return () => {
      cancelled = true;
    };
  }, [reference, accessToken, router]);

  if (!reference) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <XCircle className="h-10 w-10 text-danger mx-auto mb-4" />
        <p className="font-medium mb-2">No payment reference found</p>
        <p className="text-sm text-muted">Please return to checkout and try again.</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <XCircle className="h-10 w-10 text-danger mx-auto mb-4" />
        <p className="font-medium mb-2">We couldn&apos;t confirm your payment yet</p>
        <p className="text-sm text-muted">Check your Orders page in a few minutes, or contact support with reference {reference}.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-brand" />
      <p className="font-medium mb-1">Confirming your payment...</p>
      <p className="text-sm text-muted">This usually takes a few seconds.</p>
    </div>
  );
}