'use client';

import Link from 'next/link';
import { Search, User, Heart, ShoppingBag, Menu, Shield, Bike } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/categories', label: 'Categories' },
  { href: '/deals', label: 'Deals' },
];

export function Header() {
  const { user } = useAuth();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-6">
          <Link href="/" className="font-display text-xl font-semibold tracking-tight shrink-0">
            duka<span className="text-brand">.</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink/80 hover:text-ink transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="text-sm font-medium text-brand hover:underline flex items-center gap-1"
              >
                <Shield className="h-4 w-4" /> Admin Panel
              </Link>
            )}
            {user?.role === 'RIDER' && (
              <Link
                href="/rider"
                className="text-sm font-medium text-brand hover:underline flex items-center gap-1"
              >
                <Bike className="h-4 w-4" /> Rider Panel
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center flex-1 max-w-sm">
            <form action="/search" className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                name="q"
                type="search"
                placeholder="Search products..."
                className="w-full rounded border border-border bg-white/60 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            </form>
          </div>

          <div className="flex items-center gap-1">
            <button className="md:hidden p-2" aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
            {user?.role === 'ADMIN' && (
              <Link href="/admin" className="p-2 text-brand font-medium text-xs flex items-center gap-1 border border-brand/30 rounded px-2.5 py-1" aria-label="Admin Panel">
                <Shield className="h-4 w-4" /> Admin
              </Link>
            )}
            {user?.role === 'RIDER' && (
              <Link href="/rider" className="p-2 text-brand font-medium text-xs flex items-center gap-1 border border-brand/30 rounded px-2.5 py-1" aria-label="Rider Panel">
                <Bike className="h-4 w-4" /> Rider
              </Link>
            )}
            <Link href={user ? '/account' : '/login'} className="p-2 hidden sm:block" aria-label="Account">
              <User className="h-5 w-5" />
            </Link>
            <Link href="/wishlist" className="p-2 hidden sm:block" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
            </Link>
            <Link href="/cart" className="p-2 relative" aria-label="Cart">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-medium text-white">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              className="md:hidden p-2"
              aria-label="Menu"
              onClick={() => setMobileMenuOpen((o) => !o)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-border px-4 py-3 flex flex-col gap-3">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium py-1">
              {link.label}
            </Link>
          ))}
          {user?.role === 'ADMIN' && (
            <Link href="/admin" className="text-sm font-medium py-1 text-brand font-semibold flex items-center gap-1">
              <Shield className="h-4 w-4" /> Admin Panel
            </Link>
          )}
          {user?.role === 'RIDER' && (
            <Link href="/rider" className="text-sm font-medium py-1 text-brand font-semibold flex items-center gap-1">
              <Bike className="h-4 w-4" /> Rider Panel
            </Link>
          )}
          <Link href={user ? '/account' : '/login'} className="text-sm font-medium py-1">
            {user ? 'My Account' : 'Login'}
          </Link>
          <Link href="/wishlist" className="text-sm font-medium py-1">
            Wishlist
          </Link>
        </nav>
      )}
    </header>
  );
}