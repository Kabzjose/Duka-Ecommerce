'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Price } from '@/components/ui/Price';
import { Button } from '@/components/ui/Button';
import { Trash2, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { cart, updateItem, removeItem, isLoading } = useCart();

  if (isLoading) return <div className="mx-auto max-w-4xl px-4 py-16 text-center text-muted">Loading cart...</div>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <ShoppingBag className="h-10 w-10 mx-auto text-muted mb-4" />
        <p className="font-medium mb-2">Your cart is empty</p>
        <p className="text-sm text-muted mb-6">Add some products to get started.</p>
        <Link href="/shop"><Button>Continue Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-display text-2xl font-semibold mb-6">Your Cart</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 divide-y divide-border border-t border-b border-border">
          {cart.items.map((item) => (
            <div key={item.productId} className="flex gap-4 py-4">
              <div className="h-20 w-20 bg-brand-light rounded relative shrink-0 overflow-hidden">
                {item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                {!item.inStock && <p className="text-xs text-danger mt-1">Limited stock available</p>}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-border rounded">
                    <button onClick={() => updateItem(item.productId, Math.max(1, item.quantity - 1))} className="px-2 py-1 text-sm">−</button>
                    <span className="px-2 text-sm font-mono">{item.quantity}</span>
                    <button onClick={() => updateItem(item.productId, item.quantity + 1)} className="px-2 py-1 text-sm">+</button>
                  </div>
                  <button onClick={() => removeItem(item.productId)} className="text-muted hover:text-danger" aria-label="Remove item">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <Price amount={item.lineTotal} size="sm" />
            </div>
          ))}
        </div>

        <div className="border border-border rounded p-5 h-fit">
          <h2 className="text-sm font-medium mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted">Subtotal</span>
            <span className="font-mono">KES {cart.total.toLocaleString('en-KE')}</span>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <span className="text-muted">Delivery</span>
            <span className="text-muted">Calculated at checkout</span>
          </div>
          <div className="border-t border-border pt-4 mb-5">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <Price amount={cart.total} size="md" />
            </div>
          </div>
          <Link href="/checkout"><Button className="w-full">Proceed to Checkout</Button></Link>
          <Link href="/shop" className="block text-center text-sm text-muted mt-3 hover:text-ink">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
