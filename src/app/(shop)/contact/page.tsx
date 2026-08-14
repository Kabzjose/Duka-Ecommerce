'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, Phone, Clock } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 grid md:grid-cols-2 gap-10">
      <div>
        <h1 className="font-display text-2xl font-semibold mb-6">Contact Us</h1>
        {submitted ? (
          <p className="text-sm text-brand">Thanks — we&apos;ll get back to you within 1 business day.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Message</label>
              <textarea required rows={4} className="rounded border border-border bg-white/60 px-3 py-2 text-sm" value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
            </div>
            <Button type="submit" className="w-fit">Send Message</Button>
          </form>
        )}
      </div>
      <div className="flex flex-col gap-4 text-sm">
        <div className="flex gap-3"><Mail className="h-4 w-4 mt-0.5 text-muted" /><span>support@duka.co.ke</span></div>
        <div className="flex gap-3"><Phone className="h-4 w-4 mt-0.5 text-muted" /><span>0700 123 456</span></div>
        <div className="flex gap-3"><Clock className="h-4 w-4 mt-0.5 text-muted" /><span>Mon–Sat, 8am–6pm EAT</span></div>
      </div>
    </div>
  );
}
