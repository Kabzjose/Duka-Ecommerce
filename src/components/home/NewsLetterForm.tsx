'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useFormValidation } from '@/hooks/useFormValidation';
import { newsletterSchema } from '@/lib/validation';

export function NewsletterForm() {
  const [subscribed, setSubscribed] = useState(false);

  const { values, errors, handleChange, handleBlur, validateForm } = useFormValidation(
    newsletterSchema,
    { email: '' }
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { isValid } = validateForm();
    if (!isValid) return;
    setSubscribed(true);
  }

  if (subscribed) {
    return <p className="text-sm text-brand font-medium">Thank you for subscribing!</p>;
  }

  return (
    <div className="flex flex-col gap-1">
      <form className="flex gap-2" onSubmit={handleSubmit} noValidate>
        <input
          type="email"
          placeholder="you@example.com"
          required
          aria-label="Email for newsletter"
          className={`flex-1 rounded border bg-white/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 ${
            errors.email ? 'border-danger' : 'border-border'
          }`}
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
        />
        <Button type="submit">Subscribe</Button>
      </form>
      {errors.email && <p className="text-xs text-danger">{errors.email}</p>}
    </div>
  );
}