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
import { Check, ShieldCheck, CreditCard, PhoneCall, Truck, MapPin } from 'lucide-react';
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
  const [orderPlaced, setOrderPlaced] = useState(false);
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
      setOrderPlaced(false);
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
    return (
      <div className="py-20 text-center border border-border-subtle rounded-2xl bg-surface p-8 max-w-md mx-auto">
        <p className="text-base font-bold text-ink mb-2">Your cart is empty</p>
        <p className="text-xs text-muted mb-6">Add products to your cart before proceeding to checkout.</p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-12 gap-10">
      <div className="lg:col-span-8 space-y-8">
        {/* Step Progress Header */}
        <div className="flex items-center justify-between gap-2 p-4 rounded-xl bg-surface border border-border shadow-subtle">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                  i < stepIndex
                    ? 'bg-brand text-white shadow-sm'
                    : i === stepIndex
                    ? 'border-2 border-brand bg-brand-light text-brand'
                    : 'border border-border bg-bg text-muted'
                }`}
              >
                {i < stepIndex ? <Check className="h-4 w-4 stroke-[3]" /> : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i === stepIndex ? 'font-bold text-ink' : 'text-muted'}`}>
                {s}
              </span>
              {i < STEPS.length - 1 && <div className="flex-1 h-0.5 bg-border-subtle" />}
            </div>
          ))}
        </div>

        {/* Step Content Card */}
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-card space-y-6">
          {step === 'Shipping' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-border-subtle">
                <h3 className="font-display text-lg font-bold text-ink">Shipping Details</h3>
                <p className="text-xs text-muted">Who should receive this delivery?</p>
              </div>

              <Input
                label="Recipient full name"
                required
                value={shippingForm.values.recipientName}
                onChange={(e) => shippingForm.handleChange('recipientName', e.target.value)}
                onBlur={() => shippingForm.handleBlur('recipientName')}
                error={shippingForm.errors.recipientName}
              />
              <Input
                label="Recipient phone number"
                placeholder="0712345678"
                required
                value={shippingForm.values.recipientPhone}
                onChange={(e) => shippingForm.handleChange('recipientPhone', e.target.value)}
                onBlur={() => shippingForm.handleBlur('recipientPhone')}
                error={shippingForm.errors.recipientPhone}
              />
              <Select
                label="Delivery Zone"
                required
                value={shippingForm.values.dropoffZoneId}
                onChange={(e) => shippingForm.handleChange('dropoffZoneId', e.target.value)}
                onBlur={() => shippingForm.handleBlur('dropoffZoneId')}
                error={shippingForm.errors.dropoffZoneId}
              >
                <option value="">Select your location zone</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </Select>
              <Input
                label="Exact Dropoff Address"
                placeholder="Street name, building, house/apartment number"
                required
                value={shippingForm.values.dropoffAddress}
                onChange={(e) => shippingForm.handleChange('dropoffAddress', e.target.value)}
                onBlur={() => shippingForm.handleBlur('dropoffAddress')}
                error={shippingForm.errors.dropoffAddress}
              />
            </div>
          )}

          {step === 'Delivery' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-border-subtle">
                <h3 className="font-display text-lg font-bold text-ink">Delivery Method</h3>
                <p className="text-xs text-muted">Standard delivery options available for your location</p>
              </div>

              <div className="p-4 rounded-xl border-2 border-brand bg-brand-light/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-brand" />
                  <div>
                    <p className="text-sm font-bold text-ink">Standard Express Courier</p>
                    <p className="text-xs text-muted">Calculated automatically based on selected zone</p>
                  </div>
                </div>
                <input type="radio" checked readOnly className="accent-brand h-4 w-4" />
              </div>
            </div>
          )}

          {step === 'Payment' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-border-subtle">
                <h3 className="font-display text-lg font-bold text-ink">Payment Method</h3>
                <p className="text-xs text-muted">Select how you wish to complete payment</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('MPESA')}
                  className={`p-4 rounded-xl border-2 font-bold text-sm flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    paymentMethod === 'MPESA'
                      ? 'border-brand bg-brand-light text-brand-dark shadow-sm'
                      : 'border-border bg-bg text-muted hover:border-ink/30'
                  }`}
                >
                  <PhoneCall className="h-5 w-5 text-brand" />
                  <span>M-Pesa STK Push</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-4 rounded-xl border-2 font-bold text-sm flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    paymentMethod === 'CARD'
                      ? 'border-brand bg-brand-light text-brand-dark shadow-sm'
                      : 'border-border bg-bg text-muted hover:border-ink/30'
                  }`}
                >
                  <CreditCard className="h-5 w-5 text-brand" />
                  <span>Card (Visa/Mastercard)</span>
                </button>
              </div>

              {paymentMethod === 'MPESA' && mpesaStage === 'idle' && (
                <div className="pt-2">
                  <Input
                    label="M-Pesa Phone Number"
                    placeholder="0712345678"
                    required
                    value={mpesaForm.values.payerPhone}
                    onChange={(e) => mpesaForm.handleChange('payerPhone', e.target.value)}
                    onBlur={() => mpesaForm.handleBlur('payerPhone')}
                    error={mpesaForm.errors.payerPhone}
                    hint="You will receive an instant M-Pesa STK prompt on this phone."
                  />
                </div>
              )}

              {paymentMethod === 'MPESA' && mpesaStage === 'sending' && (
                <div className="py-8 text-center text-muted font-mono text-xs">
                  Initiating M-Pesa STK push prompt...
                </div>
              )}

              {paymentMethod === 'MPESA' && mpesaStage === 'waiting' && (
                <div className="py-8 text-center bg-brand-light rounded-xl p-6 border border-brand/30">
                  <p className="text-sm font-bold text-brand mb-1">STK Push Sent!</p>
                  <p className="text-xs text-muted">
                    Check your phone screen and enter your M-Pesa PIN. We will automatically confirm your order once paid.
                  </p>
                </div>
              )}

              {paymentMethod === 'CARD' && (
                <div className="pt-2">
                  <Input
                    label="Email Address for Receipt"
                    type="email"
                    required
                    value={cardForm.values.payerEmail}
                    onChange={(e) => cardForm.handleChange('payerEmail', e.target.value)}
                    onBlur={() => cardForm.handleBlur('payerEmail')}
                    error={cardForm.errors.payerEmail}
                  />
                </div>
              )}
            </div>
          )}

          {step === 'Review' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-border-subtle">
                <h3 className="font-display text-lg font-bold text-ink">Review Order</h3>
                <p className="text-xs text-muted">Verify shipping & payment details before placing order</p>
              </div>

              <div className="p-4 rounded-xl bg-bg border border-border-subtle space-y-1 text-xs">
                <p className="font-bold text-ink flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-brand" /> Shipping Address
                </p>
                <p className="text-muted">{shippingForm.values.recipientName} • {shippingForm.values.recipientPhone}</p>
                <p className="text-ink font-mono mt-1">{shippingForm.values.dropoffAddress}</p>
              </div>

              <div className="p-4 rounded-xl bg-bg border border-border-subtle space-y-1 text-xs">
                <p className="font-bold text-ink flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-brand" /> Payment Details
                </p>
                <p className="text-muted">
                  {paymentMethod === 'MPESA'
                    ? `M-Pesa STK Push — ${mpesaForm.values.payerPhone}`
                    : `Card Authorization — ${cardForm.values.payerEmail}`}
                </p>
              </div>
            </div>
          )}

          {error && (
            <p className="text-xs font-medium text-danger bg-danger-light p-3 rounded-lg border border-danger/20">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-4 border-t border-border-subtle">
            {stepIndex > 0 && (
              <Button variant="secondary" onClick={back} disabled={isSubmitting}>
                Back
              </Button>
            )}
            {step !== 'Review' ? (
              <Button onClick={next} className="ml-auto">Continue</Button>
            ) : (
              <Button onClick={placeOrder} isLoading={isSubmitting} className="ml-auto bg-brand hover:bg-brand-dark">
                Place Order Now
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Summary Sidebar */}
      <div className="lg:col-span-4">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sticky top-28 space-y-4">
          <h3 className="font-display text-base font-bold text-ink pb-3 border-b border-border-subtle">
            Cart Summary ({cart.items.length})
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.items.map((item) => (
              <div key={item.productId} className="flex justify-between items-center text-xs">
                <span className="text-ink line-clamp-1 pr-2">
                  {item.name} <strong className="text-muted font-mono">× {item.quantity}</strong>
                </span>
                <span className="font-mono text-ink font-semibold shrink-0">
                  KES {item.lineTotal.toLocaleString('en-KE')}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border-subtle space-y-2">
            <div className="flex justify-between text-xs text-muted">
              <span>Products Total</span>
              <Price amount={cart.total} size="xs" />
            </div>
            <p className="text-[11px] text-muted">Delivery fee calculated at order placement.</p>
          </div>

          <div className="pt-3 border-t border-border-subtle flex items-center justify-center gap-2 text-xs text-muted">
            <ShieldCheck className="h-4 w-4 text-brand" />
            <span>Encrypted Checkout Protocol</span>
          </div>
        </div>
      </div>
    </div>
  );
}
