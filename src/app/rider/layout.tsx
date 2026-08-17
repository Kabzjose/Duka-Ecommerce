'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Bike, LogOut, Package } from 'lucide-react';

const NAV = [
  { href: '/rider', label: 'My Deliveries', icon: Package },
];

export default function RiderLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!user) return router.push('/login');
    if (user.role !== 'RIDER') return router.push('/');
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'RIDER') {
    return <div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 shrink-0 border-r border-border bg-white/40 flex flex-col">
        <Link href="/rider" className="font-display text-lg font-semibold px-5 py-5 border-b border-border flex items-center gap-2">
          <Bike className="h-5 w-5 text-brand" /> duka<span className="text-brand">.</span> rider
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
        <div className="p-3 border-t border-border">
          <p className="text-xs font-medium px-3 truncate">{user.name}</p>
          <p className="text-[11px] text-muted px-3 mb-2 truncate">{user.phone}</p>
          <button onClick={logout} className="w-full flex items-center gap-2 text-sm px-3 py-2 rounded hover:bg-black/[0.04] text-danger text-left">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
