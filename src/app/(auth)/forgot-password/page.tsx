'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="border border-border rounded p-6 text-center">
        <h1 className="font-display text-lg font-semibold mb-2">Check your email</h1>
        <p className="text-sm text-muted">If an account exists for {email}, we&apos;ve sent password reset instructions.</p>
        <Link href="/login" className="text-sm text-brand hover:underline block mt-4">Back to login</Link>
      </div>
    );
  }

  return (
    <div className="border border-border rounded p-6">
      <h1 className="font-display text-xl font-semibold mb-1">Reset your password</h1>
      <p className="text-sm text-muted mb-6">Enter your email and we&apos;ll send you a reset link.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit" className="w-full">Send Reset Link</Button>
      </form>
      <Link href="/login" className="text-sm text-brand hover:underline block text-center mt-6">Back to login</Link>
    </div>
  );
}
