'use client';

import Link from 'next/link';
import { Search, User, Heart, ShoppingBag, Menu, X, Shield, Bike, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { AnnouncementBar } from './AnnouncementBar';

const NAV_LINKS = [
  { href: '/shop', label: 'Shop All' },
  { href: '/categories', label: 'Categories' },
  { href: '/deals', label: 'Hot Deals' },
];

export function Header() {
  const { user } = useAuth();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <AnnouncementBar />
      <header className={`sticky top-0 z-40 bg-surface/95 backdrop-blur-md transition-shadow duration-200 border-b border-border ${
        scrolled ? 'shadow-subtle' : ''
      }`}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-20 items-center justify-between gap-4 md:gap-8">
            {/* Mobile menu trigger */}
            <button
              className="md:hidden p-2 text-ink hover:text-brand transition-colors"
              aria-label="Toggle navigation menu"
              onClick={() => setMobileMenuOpen((o) => !o)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Brand Logo */}
            <Link href="/" className="group flex items-center gap-1.5 shrink-0">
              <span className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-ink group-hover:text-brand transition-colors">
                DUKA<span className="text-brand">.</span>
              </span>
            </Link>

            {/* Main Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-brand relative py-1 ${
                      active ? 'text-brand font-semibold' : 'text-ink/80'
                    }`}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-full" />
                    )}
                  </Link>
                );
              })}
              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="text-xs font-semibold text-brand bg-brand-light px-2.5 py-1 rounded-md hover:bg-brand hover:text-white transition-all flex items-center gap-1.5 border border-brand/20"
                >
                  <Shield className="h-3.5 w-3.5" /> Admin Portal
                </Link>
              )}
              {user?.role === 'RIDER' && (
                <Link
                  href="/rider"
                  className="text-xs font-semibold text-brand bg-brand-light px-2.5 py-1 rounded-md hover:bg-brand hover:text-white transition-all flex items-center gap-1.5 border border-brand/20"
                >
                  <Bike className="h-3.5 w-3.5" /> Rider Portal
                </Link>
              )}
            </nav>

            {/* Desktop Integrated Search */}
            <div className="hidden md:flex items-center flex-1 max-w-md">
              <form action="/search" className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
                <input
                  name="q"
                  type="search"
                  placeholder="Search products, categories, brands..."
                  className="w-full rounded-lg border border-border bg-bg/70 py-2.5 pl-10 pr-10 text-sm text-ink placeholder:text-muted/60 transition-all duration-150 focus:bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 shadow-subtle"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-muted/60 border border-border rounded px-1.5 py-0.5 hidden lg:block">
                  ⌘K
                </span>
              </form>
            </div>

            {/* Actions: Account, Wishlist, Cart */}
            <div className="flex items-center gap-1 sm:gap-2">
              {user?.role === 'ADMIN' && (
                <Link href="/admin" className="p-2 lg:hidden text-brand font-semibold text-xs flex items-center gap-1 bg-brand-light rounded-md border border-brand/20" aria-label="Admin Portal">
                  <Shield className="h-4 w-4" />
                </Link>
              )}
              {user?.role === 'RIDER' && (
                <Link href="/rider" className="p-2 lg:hidden text-brand font-semibold text-xs flex items-center gap-1 bg-brand-light rounded-md border border-brand/20" aria-label="Rider Portal">
                  <Bike className="h-4 w-4" />
                </Link>
              )}

              <Link
                href={user ? '/account' : '/login'}
                className="p-2.5 text-ink hover:text-brand hover:bg-bg rounded-lg transition-colors flex items-center gap-2"
                aria-label="Account"
              >
                <User className="h-5 w-5" />
                <span className="hidden xl:inline text-xs font-semibold">
                  {user ? user.name.split(' ')[0] : 'Sign In'}
                </span>
              </Link>

              <Link
                href="/wishlist"
                className="p-2.5 text-ink hover:text-brand hover:bg-bg rounded-lg transition-colors hidden sm:flex items-center"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
              </Link>

              <Link
                href="/cart"
                className="p-2.5 bg-brand text-white hover:bg-brand-dark rounded-lg transition-all flex items-center gap-2 shadow-sm font-medium text-xs ml-1"
                aria-label="Shopping Cart"
              >
                <div className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white shadow-sm animate-pulse">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline font-semibold">Cart</span>
              </Link>
            </div>
          </div>

          {/* Mobile search bar trigger */}
          <div className="pb-3 md:hidden">
            <form action="/search" className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
              <input
                name="q"
                type="search"
                placeholder="Search products..."
                className="w-full rounded-lg border border-border bg-bg py-2 pl-10 pr-3 text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-brand"
              />
            </form>
          </div>
        </div>

        {/* Mobile Navigation Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-surface px-4 py-5 shadow-dropdown animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-1">
              <Link
                href="/"
                className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium hover:bg-bg"
              >
                Home <ChevronRight className="h-4 w-4 text-muted" />
              </Link>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium hover:bg-bg"
                >
                  {link.label} <ChevronRight className="h-4 w-4 text-muted" />
                </Link>
              ))}
              <hr className="my-2 border-border" />
              <Link
                href={user ? '/account' : '/login'}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium hover:bg-bg"
              >
                {user ? `Account (${user.name})` : 'Sign In / Register'} <ChevronRight className="h-4 w-4 text-muted" />
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium hover:bg-bg"
              >
                Saved Wishlist <ChevronRight className="h-4 w-4 text-muted" />
              </Link>
              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-bold text-brand bg-brand-light"
                >
                  Admin Portal <Shield className="h-4 w-4" />
                </Link>
              )}
              {user?.role === 'RIDER' && (
                <Link
                  href="/rider"
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-bold text-brand bg-brand-light"
                >
                  Rider Portal <Bike className="h-4 w-4" />
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}