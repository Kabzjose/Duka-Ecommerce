'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LayoutGrid, Package, Users, ShoppingBag, LogOut } from 'lucide-react';

const NAV = [
  { href: '/admin', label: 'Overview', icon: LayoutGrid },
  { href: '/admin/bookings', label: 'Bookings', icon: Package },
  { href: '/admin/users', label: 'Users & Riders', icon: Users },
  { href: '/admin/products', label: 'Products', icon: ShoppingBag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!user) return router.push('/login');
    if (user.role !== 'ADMIN') return router.push('/');
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'ADMIN') {
    return <div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 shrink-0 border-r border-border bg-white/40 flex flex-col">
        <Link href="/admin" className="font-display text-lg font-semibold px-5 py-5 border-b border-border">
          duka<span className="text-brand">.</span> admin
        </Link>
        <nav className="flex-1 flex flex-col gap-1 p-3">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-sm px-3 py-2 rounded ${
                  active ? 'bg-brand text-white' : 'hover:bg-black/[0.04]'
                }`}
              >
                <item.icon className="h-4 w-4" /> {item.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={logout} className="flex items-center gap-2 text-sm px-3 py-3 mx-3 mb-3 rounded hover:bg-black/[0.04] text-danger text-left">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
