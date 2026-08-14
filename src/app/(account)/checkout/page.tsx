import { CheckoutFlow } from '@/components/checkout/CheckoutFlow';

async function getZones() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
  try {
    const res = await fetch(`${API_BASE_URL}/pricing/zones`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.zones ?? []) as { id: string; name: string }[];
  } catch {
    return [];
  }
}

export default async function CheckoutPage() {
  const zones = await getZones();
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-display text-2xl font-semibold mb-8">Checkout</h1>
      <CheckoutFlow zones={zones} />
    </div>
  );
}
