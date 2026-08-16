'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ApiError } from '@/lib/api';
import { useFormValidation } from '@/hooks/useFormValidation';
import { registerSchema } from '@/lib/validation';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    validateForm,
    setError,
    setErrors,
  } = useFormValidation(registerSchema, {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { isValid, data } = validateForm();
    if (!isValid || !data) return;

    setIsLoading(true);
    try {
      await register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
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
        setError('form', err instanceof Error ? err.message : 'Something went wrong');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="border border-border rounded p-6">
      <h1 className="font-display text-xl font-semibold mb-1">Create your account</h1>
      <p className="text-sm text-muted mb-6">Start shopping with Duka</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Full name"
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
        <Input
          label="Phone"
          placeholder="0712345678"
          required
          value={values.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          onBlur={() => handleBlur('phone')}
          error={errors.phone}
        />
        <Input
          label="Password"
          type="password"
          required
          value={values.password}
          onChange={(e) => handleChange('password', e.target.value)}
          onBlur={() => handleBlur('password')}
          error={errors.password}
        />
        <Input
          label="Confirm password"
          type="password"
          required
          value={values.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          onBlur={() => handleBlur('confirmPassword')}
          error={errors.confirmPassword}
        />
        {errors.form && <p className="text-sm text-danger">{errors.form}</p>}
        <Button type="submit" isLoading={isLoading} className="w-full">
          Create Account
        </Button>
      </form>
      <p className="text-sm text-muted text-center mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-brand hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
