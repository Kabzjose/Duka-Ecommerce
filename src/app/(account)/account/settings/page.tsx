'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  const { logout } = useAuth();
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display text-2xl font-semibold mb-6">Settings</h1>
      <div className="border border-border rounded p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Log out</p>
          <p className="text-xs text-muted">Sign out of your Duka account on this device</p>
        </div>
        <Button variant="secondary" onClick={logout}>Logout</Button>
      </div>
    </div>
  );
}
