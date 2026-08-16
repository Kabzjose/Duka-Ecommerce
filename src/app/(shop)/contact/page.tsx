'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Mail, Phone, Clock } from 'lucide-react';
import { useFormValidation } from '@/hooks/useFormValidation';
import { contactSchema } from '@/lib/validation';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const { values, errors, handleChange, handleBlur, validateForm } = useFormValidation(
    contactSchema,
    { name: '', email: '', message: '' }
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { isValid } = validateForm();
    if (!isValid) return;
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 grid md:grid-cols-2 gap-10">
      <div>
        <h1 className="font-display text-2xl font-semibold mb-6">Contact Us</h1>
        {submitted ? (
          <p className="text-sm text-brand">Thanks — we&apos;ll get back to you within 1 business day.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <Input
              label="Name"
              required
              value={values.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              error={errors.name}
            />
            <Input
              label="Email"
              type="email"
              required
              value={values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              error={errors.email}
            />
            <Textarea
              label="Message"
              required
              rows={4}
              value={values.message}
              onChange={(e) => handleChange('message', e.target.value)}
              onBlur={() => handleBlur('message')}
              error={errors.message}
            />
            <Button type="submit" className="w-fit">
              Send Message
            </Button>
          </form>
        )}
      </div>
      <div className="flex flex-col gap-4 text-sm">
        <div className="flex gap-3">
          <Mail className="h-4 w-4 mt-0.5 text-muted" />
          <span>support@duka.co.ke</span>
        </div>
        <div className="flex gap-3">
          <Phone className="h-4 w-4 mt-0.5 text-muted" />
          <span>0700 123 456</span>
        </div>
        <div className="flex gap-3">
          <Clock className="h-4 w-4 mt-0.5 text-muted" />
          <span>Mon–Sat, 8am–6pm EAT</span>
        </div>
      </div>
    </div>
  );
}
