// src/components/home/NewsletterForm.tsx
'use client';

import { Button } from '@/components/ui/Button';

export function NewsletterForm() {
  return (
    <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        placeholder="you@example.com"
        required
        className="flex-1 rounded border border-border bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
      />
      <Button type="submit">Subscribe</Button>
    </form>
  );
}