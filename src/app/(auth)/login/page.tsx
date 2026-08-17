'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ApiError } from '@/lib/api';
import { useFormValidation } from '@/hooks/useFormValidation';
import { loginSchema } from '@/lib/validation';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    validateForm,
    setError,
  } = useFormValidation(loginSchema, {
    email: '',
    password: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { isValid, data } = validateForm();
    if (!isValid || !data) return;

    setIsLoading(true);
    try {
      const loggedUser = await login(data.email, data.password);
      if (loggedUser.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('form', err instanceof ApiError ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="border border-border rounded p-6">
      <h1 className="font-display text-xl font-semibold mb-1">Welcome back</h1>
      <p className="text-sm text-muted mb-6">Log in to your Duka account</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
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
          label="Password"
          type="password"
          required
          value={values.password}
          onChange={(e) => handleChange('password', e.target.value)}
          onBlur={() => handleBlur('password')}
          error={errors.password}
        />
        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center gap-2 text-muted">
            <input type="checkbox" className="rounded" /> Remember me
          </label>
          <Link href="/forgot-password" className="text-brand hover:underline">
            Forgot password?
          </Link>
        </div>
        {errors.form && <p className="text-sm text-danger">{errors.form}</p>}
        <Button type="submit" isLoading={isLoading} className="w-full">
          Log In
        </Button>
      </form>
      <p className="text-sm text-muted text-center mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-brand hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
