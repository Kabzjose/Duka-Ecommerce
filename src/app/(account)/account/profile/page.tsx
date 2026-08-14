'use client';

import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
  const { user } = useAuth();
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display text-2xl font-semibold mb-6">Profile</h1>
      <div className="flex flex-col gap-4 max-w-md">
        <Input label="Full name" defaultValue={user?.name} disabled />
        <Input label="Email" defaultValue={user?.email} disabled />
        <Input label="Phone" defaultValue={user?.phone} disabled />
        <p className="text-xs text-muted">Profile editing is coming soon.</p>
        <Button disabled className="w-fit">Save Changes</Button>
      </div>
    </div>
  );
}
