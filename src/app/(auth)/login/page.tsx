'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ApiError } from '@/lib/api';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="border border-border rounded p-6">
      <h1 className="font-display text-xl font-semibold mb-1">Welcome back</h1>
      <p className="text-sm text-muted mb-6">Log in to your Duka account</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center gap-2 text-muted">
            <input type="checkbox" className="rounded" /> Remember me
          </label>
          <Link href="/forgot-password" className="text-brand hover:underline">Forgot password?</Link>
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" isLoading={isLoading} className="w-full">Log In</Button>
      </form>
      <p className="text-sm text-muted text-center mt-6">
        Don&apos;t have an account? <Link href="/register" className="text-brand hover:underline">Sign up</Link>
      </p>
    </div>
  );
}
