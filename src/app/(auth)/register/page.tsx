'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ApiError } from '@/lib/api';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    if (form.password !== form.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }
    if (!/^\+254\d{9}$/.test(form.phone)) {
      setErrors({ phone: 'Use format +254712345678' });
      return;
    }

    setIsLoading(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      router.push('/');
    } catch (err) {
      if (err instanceof ApiError) {
        const fieldErrors: Record<string, string> = {};

        if (err.fields && typeof err.fields === 'object') {
          Object.entries(err.fields).forEach(([k, v]) => {
            fieldErrors[k] = Array.isArray(v) ? String(v[0]) : String(v);
          });
        }

        if (err.details && typeof err.details === 'object' && !err.fields) {
          Object.entries(err.details as Record<string, unknown>).forEach(([k, v]) => {
            if (Array.isArray(v)) {
              fieldErrors[k] = String(v[0]);
            } else if (typeof v === 'string') {
              fieldErrors[k] = v;
            }
          });
        }

        const msgLower = err.message.toLowerCase();
        if (msgLower.includes('phone') && !fieldErrors.phone) {
          fieldErrors.phone = err.message;
        } else if (msgLower.includes('email') && !fieldErrors.email) {
          fieldErrors.email = err.message;
        } else if (msgLower.includes('password') && !fieldErrors.password) {
          fieldErrors.password = err.message;
        }

        if (Object.keys(fieldErrors).length === 0) {
          fieldErrors.form = err.message;
        }

        setErrors(fieldErrors);
      } else {
        setErrors({ form: err instanceof Error ? err.message : 'Something went wrong' });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="border border-border rounded p-6">
      <h1 className="font-display text-xl font-semibold mb-1">Create your account</h1>
      <p className="text-sm text-muted mb-6">Start shopping with Duka</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Full name" required value={form.name} onChange={(e) => update('name', e.target.value)} />
        <Input label="Email" type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} error={errors.email} />
        <Input label="Phone" placeholder="0712345678" required value={form.phone} onChange={(e) => update('phone', e.target.value)} error={errors.phone} />
        <Input label="Password" type="password" required value={form.password} onChange={(e) => update('password', e.target.value)} error={errors.password} />
        <Input label="Confirm password" type="password" required value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} error={errors.confirmPassword} />
        {errors.form && <p className="text-sm text-danger">{errors.form}</p>}
        <Button type="submit" isLoading={isLoading} className="w-full">Create Account</Button>
      </form>
      <p className="text-sm text-muted text-center mt-6">
        Already have an account? <Link href="/login" className="text-brand hover:underline">Log in</Link>
      </p>
    </div>
  );
}
