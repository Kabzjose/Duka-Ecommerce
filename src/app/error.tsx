'use client';

import { Button } from '@/components/ui/Button';

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="font-medium mb-2">Something went wrong</p>
      <p className="text-sm text-muted mb-6">Please try again.</p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
