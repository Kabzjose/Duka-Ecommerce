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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand">Secure Portal</span>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink mt-1">
          Complete Your Order
        </h1>
      </div>
      <CheckoutFlow zones={zones} />
    </div>
  );
}
