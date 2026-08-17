'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Price } from '@/components/ui/Price';
import { Button } from '@/components/ui/Button';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, Minus, Plus } from 'lucide-react';

export default function CartPage() {
  const { cart, updateItem, removeItem, isLoading } = useCart();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-muted font-mono text-sm">
        Loading your shopping cart...
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="p-4 rounded-full bg-brand-light text-brand w-fit mx-auto mb-4">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h2 className="font-display text-2xl font-extrabold text-ink mb-2">Your Cart is Empty</h2>
        <p className="text-sm text-muted mb-8 leading-relaxed">
          Looks like you haven&apos;t added any products to your shopping cart yet.
        </p>
        <Link href="/shop">
          <Button size="lg" className="w-full gap-2">
            Explore Products <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand">Checkout Journey</span>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink mt-1">
          Shopping Cart ({cart.items.reduce((acc, item) => acc + item.quantity, 0)})
        </h1>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-subtle divide-y divide-border-subtle">
            {cart.items.map((item) => (
              <div key={item.productId} className="p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-center flex-1 min-w-0">
                  <div className="relative h-20 w-20 rounded-xl bg-bg border border-border-subtle shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted text-[10px] font-mono">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.productId}`} className="font-bold text-sm text-ink hover:text-brand transition-colors line-clamp-1">
                      {item.name}
                    </Link>
                    {!item.inStock && (
                      <p className="text-xs font-semibold text-danger mt-0.5">Limited stock available</p>
                    )}
                    <p className="text-xs font-mono text-muted mt-1">
                      KES {item.price.toLocaleString('en-KE')} each
                    </p>
                  </div>
                </div>

                {/* Controls: Stepper & Remove */}
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-border-subtle">
                  <div className="flex items-center border border-border rounded-lg bg-bg overflow-hidden shadow-subtle">
                    <button
                      onClick={() => updateItem(item.productId, Math.max(1, item.quantity - 1))}
                      className="p-2 hover:bg-surface text-ink transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold font-mono text-ink min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateItem(item.productId, item.quantity + 1)}
                      className="p-2 hover:bg-surface text-ink transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <Price amount={item.lineTotal} size="sm" />

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-2 text-muted hover:text-danger hover:bg-danger-light rounded-lg transition-colors cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-brand-light/50 border border-brand/20 flex items-center gap-3 text-xs text-brand-dark">
            <Truck className="h-5 w-5 text-brand shrink-0" />
            <span>Orders over <strong>KES 5,000</strong> qualify for <strong>FREE Express Delivery</strong> across Kenya!</span>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sticky top-28 space-y-6">
            <h2 className="font-display text-lg font-extrabold text-ink pb-4 border-b border-border-subtle">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted font-sans">
                <span>Subtotal</span>
                <span className="font-mono text-ink font-semibold">KES {cart.total.toLocaleString('en-KE')}</span>
              </div>
              <div className="flex justify-between text-muted font-sans">
                <span>Estimated Shipping</span>
                <span className="text-brand font-semibold text-xs bg-brand-light px-2 py-0.5 rounded">
                  Calculated at Checkout
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-border-subtle flex items-baseline justify-between">
              <span className="font-bold text-base text-ink">Total</span>
              <Price amount={cart.total} size="lg" />
            </div>

            <Link href="/checkout" className="block">
              <Button size="lg" className="w-full font-bold gap-2 py-4 shadow-md bg-brand hover:bg-brand-dark">
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <div className="pt-4 border-t border-border-subtle flex items-center justify-center gap-2 text-xs text-muted">
              <ShieldCheck className="h-4 w-4 text-brand" />
              <span>Encrypted 256-bit M-Pesa & Card Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
