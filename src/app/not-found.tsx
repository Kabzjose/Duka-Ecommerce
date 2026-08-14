import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="font-display text-5xl font-semibold mb-2">404</p>
      <p className="text-sm text-muted mb-6">This page doesn&apos;t exist.</p>
      <Link href="/shop"><Button>Back to Shop</Button></Link>
    </div>
  );
}
