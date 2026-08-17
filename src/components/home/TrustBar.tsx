import { Truck, ShieldCheck, RotateCcw, Headset } from 'lucide-react';

const FEATURES = [
  {
    icon: Truck,
    title: 'Fast Nationwide Delivery',
    desc: 'Same-day delivery in Nairobi & express shipping countrywide',
  },
  {
    icon: ShieldCheck,
    title: '100% Secure Checkout',
    desc: 'Encrypted payments via M-Pesa & Visa/Mastercard',
  },
  {
    icon: RotateCcw,
    title: 'Easy 7-Day Returns',
    desc: 'Simple return policy if you are not completely satisfied',
  },
  {
    icon: Headset,
    title: 'Dedicated Customer Support',
    desc: 'Our team is here to assist you 7 days a week',
  },
];

export function TrustBar() {
  return (
    <section className="py-8 bg-surface border-y border-border-subtle shadow-subtle">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((item) => (
            <div key={item.title} className="flex items-start gap-3.5 group">
              <div className="p-2.5 rounded-lg bg-brand-light text-brand group-hover:bg-brand group-hover:text-white transition-colors duration-200 shrink-0">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink mb-0.5">{item.title}</h4>
                <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
