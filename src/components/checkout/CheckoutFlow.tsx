'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { api, ApiError } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Price } from '@/components/ui/Price';
import { Check } from 'lucide-react';
import { useFormValidation } from '@/hooks/useFormValidation';
import {
  checkoutShippingSchema,
  checkoutPaymentMpesaSchema,
  checkoutPaymentCardSchema,
} from '@/lib/validation';

const STEPS = ['Shipping', 'Delivery', 'Payment', 'Review'] as const;

interface ZoneOption {
  id: string;
  name: string;
}

export function CheckoutFlow({ zones }: { zones: ZoneOption[] }) {
  const { accessToken } = useAuth();
  const { cart, refreshCart } = useCart();
  const router = useRouter();

  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingForm = useFormValidation(checkoutShippingSchema, {
    recipientName: '',
    recipientPhone: '',
    dropoffZoneId: '',
    dropoffAddress: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'MPESA' | 'CARD'>('MPESA');
  const [mpesaStage, setMpesaStage] = useState<'idle' | 'sending' | 'waiting'>('idle');

  const mpesaForm = useFormValidation(checkoutPaymentMpesaSchema, {
    payerPhone: '',
  });

  const cardForm = useFormValidation(checkoutPaymentCardSchema, {
    payerEmail: '',
  });

  const step = STEPS[stepIndex];

  function next() {
    setError(null);
    if (step === 'Shipping') {
      const { isValid } = shippingForm.validateForm();
      if (!isValid) return;
    }
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function back() {
    setError(null);
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  async function placeOrder() {
    setError(null);

    const shippingValidation = shippingForm.validateForm();
    if (!shippingValidation.isValid || !shippingValidation.data) {
      setStepIndex(0);
      return;
    }

    if (paymentMethod === 'MPESA') {
      const mpesaValidation = mpesaForm.validateForm();
      if (!mpesaValidation.isValid || !mpesaValidation.data) {
        setStepIndex(2);
        return;
      }
    } else {
      const cardValidation = cardForm.validateForm();
      if (!cardValidation.isValid || !cardValidation.data) {
        setStepIndex(2);
        return;
      }
    }

    setIsSubmitting(true);
    if (paymentMethod === 'MPESA') setMpesaStage('sending');

    try {
      const res = await api.post<{ order: { id: string }; payment: { authorizationUrl?: string } }>(
        '/checkout',
        {
          ...shippingForm.values,
          paymentMethod,
          ...(paymentMethod === 'MPESA'
            ? { payerPhone: mpesaForm.values.payerPhone }
            : { payerEmail: cardForm.values.payerEmail }),
        },
        accessToken
      );

      await refreshCart();

      if (paymentMethod === 'CARD' && res.payment.authorizationUrl) {
        window.location.href = res.payment.authorizationUrl;
        return;
      }

      setMpesaStage('waiting');
      pollOrderStatus(res.order.id);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Checkout failed');
      setIsSubmitting(false);
      setMpesaStage('idle');
    }
  }

  async function pollOrderStatus(orderId: string) {
    const maxAttempts = 20;
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      try {
        const res = await api.get<{ order: { status: string } }>(`/orders/${orderId}`, accessToken);
        if (res.order.status === 'PAID') {
          router.push(`/order-success?orderId=${orderId}`);
          return;
        }
        if (res.order.status === 'CANCELLED') {
          setError('Payment failed or was cancelled. Please try again.');
          setIsSubmitting(false);
          setMpesaStage('idle');
          return;
        }
      } catch {
        // keep polling
      }
    }
    setError('Payment is taking longer than expected. Check your Orders page shortly.');
    setIsSubmitting(false);
    setMpesaStage('idle');
  }

  if (!cart || cart.items.length === 0) {
    return <p className="text-center text-muted py-16">Your cart is empty.</p>;
  }

  return (
    <div className="grid md:grid-cols-3 gap-10">
      <div className="md:col-span-2">
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                  i < stepIndex
                    ? 'bg-brand text-white'
                    : i === stepIndex
                    ? 'border-2 border-brand text-brand'
                    : 'border border-border text-muted'
                }`}
              >
                {i < stepIndex ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i === stepIndex ? 'font-medium' : 'text-muted'}`}>
                {s}
              </span>
              {i < STEPS.length - 1 && <div className="flex-1 h-px bg-border" />}
            </div>
          ))}
        </div>

        {step === 'Shipping' && (
          <div className="flex flex-col gap-4">
            <Input
              label="Recipient name"
              required
              value={shippingForm.values.recipientName}
              onChange={(e) => shippingForm.handleChange('recipientName', e.target.value)}
              onBlur={() => shippingForm.handleBlur('recipientName')}
              error={shippingForm.errors.recipientName}
            />
            <Input
              label="Recipient phone"
              placeholder="0712345678"
              required
              value={shippingForm.values.recipientPhone}
              onChange={(e) => shippingForm.handleChange('recipientPhone', e.target.value)}
              onBlur={() => shippingForm.handleBlur('recipientPhone')}
              error={shippingForm.errors.recipientPhone}
            />
            <Select
              label="Delivery zone"
              required
              value={shippingForm.values.dropoffZoneId}
              onChange={(e) => shippingForm.handleChange('dropoffZoneId', e.target.value)}
              onBlur={() => shippingForm.handleBlur('dropoffZoneId')}
              error={shippingForm.errors.dropoffZoneId}
            >
              <option value="">Select a zone</option>
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </Select>
            <Input
              label="Delivery address"
              placeholder="Street, building, apartment (min 5 characters)"
              required
              value={shippingForm.values.dropoffAddress}
              onChange={(e) => shippingForm.handleChange('dropoffAddress', e.target.value)}
              onBlur={() => shippingForm.handleBlur('dropoffAddress')}
              error={shippingForm.errors.dropoffAddress}
            />
          </div>
        )}

        {step === 'Delivery' && (
          <div className="flex flex-col gap-3">
            <label className="flex items-center justify-between border border-brand bg-brand-light rounded p-4 cursor-pointer">
              <div>
                <p className="text-sm font-medium">Standard Delivery</p>
                <p className="text-xs text-muted">Delivered based on zone pricing</p>
              </div>
              <input type="radio" checked readOnly />
            </label>
            <p className="text-xs text-muted">
              Express delivery isn&apos;t available yet — all orders use standard zone-based delivery.
            </p>
          </div>
        )}

        {step === 'Payment' && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('MPESA')}
                className={`flex-1 border rounded p-4 text-sm font-medium ${
                  paymentMethod === 'MPESA' ? 'border-brand bg-brand-light' : 'border-border'
                }`}
              >
                M-Pesa
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`flex-1 border rounded p-4 text-sm font-medium ${
                  paymentMethod === 'CARD' ? 'border-brand bg-brand-light' : 'border-border'
                }`}
              >
                Card
              </button>
            </div>

            {paymentMethod === 'MPESA' && mpesaStage === 'idle' && (
              <Input
                label="M-Pesa phone number"
                placeholder="0712345678"
                required
                value={mpesaForm.values.payerPhone}
                onChange={(e) => mpesaForm.handleChange('payerPhone', e.target.value)}
                onBlur={() => mpesaForm.handleBlur('payerPhone')}
                error={mpesaForm.errors.payerPhone}
              />
            )}
            {paymentMethod === 'MPESA' && mpesaStage === 'sending' && (
              <p className="text-sm text-muted py-4">Sending payment request...</p>
            )}
            {paymentMethod === 'MPESA' && mpesaStage === 'waiting' && (
              <p className="text-sm text-brand py-4">Check your phone and enter your M-Pesa PIN.</p>
            )}
            {paymentMethod === 'CARD' && (
              <Input
                label="Email for receipt"
                type="email"
                required
                value={cardForm.values.payerEmail}
                onChange={(e) => cardForm.handleChange('payerEmail', e.target.value)}
                onBlur={() => cardForm.handleBlur('payerEmail')}
                error={cardForm.errors.payerEmail}
              />
            )}
          </div>
        )}

        {step === 'Review' && (
          <div className="flex flex-col gap-4 text-sm">
            <div className="border border-border rounded p-4">
              <p className="font-medium mb-1">Shipping to</p>
              <p className="text-muted">
                {shippingForm.values.recipientName} · {shippingForm.values.recipientPhone}
              </p>
              <p className="text-muted">{shippingForm.values.dropoffAddress}</p>
            </div>
            <div className="border border-border rounded p-4">
              <p className="font-medium mb-1">Payment method</p>
              <p className="text-muted">
                {paymentMethod === 'MPESA'
                  ? `M-Pesa — ${mpesaForm.values.payerPhone}`
                  : `Card — ${cardForm.values.payerEmail}`}
              </p>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-danger mt-4">{error}</p>}

        <div className="flex gap-3 mt-8">
          {stepIndex > 0 && (
            <Button variant="secondary" onClick={back} disabled={isSubmitting}>
              Back
            </Button>
          )}
          {step !== 'Review' ? (
            <Button onClick={next}>Continue</Button>
          ) : (
            <Button onClick={placeOrder} isLoading={isSubmitting}>
              Place Order
            </Button>
          )}
        </div>
      </div>

      <div className="border border-border rounded p-5 h-fit">
        <h2 className="text-sm font-medium mb-4">Order Summary</h2>
        {cart.items.map((item) => (
          <div key={item.productId} className="flex justify-between text-sm mb-2">
            <span className="text-muted truncate pr-2">
              {item.name} × {item.quantity}
            </span>
            <span className="font-mono shrink-0">{item.lineTotal.toLocaleString('en-KE')}</span>
          </div>
        ))}
        <div className="border-t border-border pt-3 mt-3">
          <div className="flex justify-between font-medium">
            <span>Products Total</span>
            <Price amount={cart.total} size="sm" />
          </div>
          <p className="text-xs text-muted mt-1">Delivery fee calculated at order placement</p>
        </div>
      </div>
    </div>
  );
}
