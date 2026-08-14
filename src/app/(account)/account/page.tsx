'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LayoutGrid, Package, Heart, MapPin, User as UserIcon, Settings, LogOut } from 'lucide-react';

const SIDEBAR_LINKS = [
  { href: '/account', label: 'Overview', icon: LayoutGrid },
  { href: '/orders', label: 'Orders', icon: Package },
  { href: '/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/profile', label: 'Profile', icon: UserIcon },
  { href: '/account/settings', label: 'Settings', icon: Settings },
];

export default function AccountOverviewPage() {
  const { user, logout } = useAuth();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <nav className="flex flex-col gap-1">
            {SIDEBAR_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="flex items-center gap-2 text-sm px-3 py-2 rounded hover:bg-black/[0.03]">
                <link.icon className="h-4 w-4" /> {link.label}
              </Link>
            ))}
            <button onClick={logout} className="flex items-center gap-2 text-sm px-3 py-2 rounded hover:bg-black/[0.03] text-danger text-left">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </nav>
        </aside>

        <div className="md:col-span-3">
          <h1 className="font-display text-2xl font-semibold mb-1">Welcome, {user?.name}</h1>
          <p className="text-sm text-muted mb-6">{user?.email}</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border border-border rounded p-5">
              <p className="text-sm text-muted mb-1">Account type</p>
              <p className="font-medium">{user?.role}</p>
            </div>
            <div className="border border-border rounded p-5">
              <p className="text-sm text-muted mb-1">Phone</p>
              <p className="font-medium">{user?.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
