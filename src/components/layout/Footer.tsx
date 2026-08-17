import Link from 'next/link';
import { ArrowUpRight, Phone, Mail, MapPin } from 'lucide-react';

const FOOTER_SECTIONS = [
  {
    title: 'Shop Catalog',
    links: [
      { href: '/shop', label: 'All Products' },
      { href: '/categories', label: 'Browse Categories' },
      { href: '/deals', label: 'Exclusive Deals' },
      { href: '/shop?sort=newest', label: 'New Arrivals' },
    ],
  },
  {
    title: 'Customer Service',
    links: [
      { href: '/contact', label: 'Contact Us' },
      { href: '/faq', label: 'Help & FAQ' },
      { href: '/shipping', label: 'Shipping Information' },
      { href: '/returns', label: 'Returns & Exchange Policy' },
    ],
  },
  {
    title: 'Account Services',
    links: [
      { href: '/account', label: 'My Account' },
      { href: '/orders', label: 'Order History & Tracking' },
      { href: '/wishlist', label: 'Saved Wishlist' },
      { href: '/cart', label: 'Shopping Cart' },
    ],
  },
  {
    title: 'About Duka',
    links: [
      { href: '/about', label: 'About Us' },
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-ink text-white/90 border-t border-white/10 mt-20">
      {/* Top Footer Section */}
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-10 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-2 flex flex-col justify-between">
            <div>
              <Link href="/" className="inline-block font-display text-3xl font-extrabold tracking-tight text-white mb-4">
                DUKA<span className="text-brand-light">.</span>
              </Link>
              <p className="text-sm text-white/70 leading-relaxed max-w-sm mb-6">
                Kenya’s trusted e-commerce retail platform. Premium quality products, fair prices, and lightning-fast delivery right to your doorstep.
              </p>
            </div>
            
            <div className="flex flex-col gap-2 text-xs text-white/70">
              <span className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-brand-light" /> +254 700 000 000
              </span>
              <span className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-brand-light" /> support@duka.co.ke
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-brand-light" /> Nairobi, Kenya
              </span>
            </div>
          </div>

          {/* Navigation Links Columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="md:col-span-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-mono">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-white/70 hover:text-white transition-colors inline-flex items-center gap-1 group"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-brand-light" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment Methods & Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© {new Date().getFullYear()} Duka E-Commerce Ltd. All rights reserved.</p>
          
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase font-mono tracking-wider text-white/40">Secure Payments:</span>
            <span className="px-2 py-1 rounded bg-white/10 text-white font-semibold text-[11px]">M-PESA</span>
            <span className="px-2 py-1 rounded bg-white/10 text-white font-semibold text-[11px]">VISA</span>
            <span className="px-2 py-1 rounded bg-white/10 text-white font-semibold text-[11px]">MASTERCARD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
