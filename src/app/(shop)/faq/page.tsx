'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  { q: 'How do I track my order?', a: 'Go to Orders in your account and select an order to see live delivery status.' },
  { q: 'What payment methods do you accept?', a: 'We accept M-Pesa and card payments (via Paystack). Payment is required at checkout before your order is processed.' },
  { q: 'How is delivery pricing calculated?', a: 'Delivery fees are based on the pickup and drop-off zones, plus package weight for larger items.' },
  { q: 'Can I cancel my order?', a: 'Orders can be cancelled before a rider is assigned. Contact support once your delivery is in progress.' },
  { q: 'What if my M-Pesa payment fails?', a: 'If a payment fails or times out, your order is automatically cancelled and any reserved stock is released. You can simply check out again.' },
  { q: 'How do refunds work?', a: 'Refunds for cancelled or failed deliveries are processed back to your original payment method within 3–5 business days.' },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-2xl font-semibold mb-6">Frequently Asked Questions</h1>
      <div className="divide-y divide-border border-t border-b border-border">
        {FAQS.map((faq, i) => (
          <div key={i}>
            <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between py-4 text-left text-sm font-medium">
              {faq.q}
              <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
            </button>
            {openIndex === i && <p className="text-sm text-muted pb-4">{faq.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
