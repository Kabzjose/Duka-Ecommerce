import Link from 'next/link';

const FOOTER_SECTIONS = [
  { title: 'Shop', links: [
    { href: '/shop', label: 'All Products' },
    { href: '/categories', label: 'Categories' },
    { href: '/deals', label: 'Deals' },
  ]},
  { title: 'Customer Service', links: [
    { href: '/contact', label: 'Contact Us' },
    { href: '/faq', label: 'FAQ' },
    { href: '/returns', label: 'Returns' },
    { href: '/shipping', label: 'Shipping' },
  ]},
  { title: 'Account', links: [
    { href: '/account', label: 'My Account' },
    { href: '/orders', label: 'Order History' },
    { href: '/wishlist', label: 'Wishlist' },
  ]},
  { title: 'About', links: [
    { href: '/about', label: 'About Duka' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms & Conditions' },
  ]},
];

export function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-lg font-semibold">
              duka<span className="text-brand">.</span>
            </span>
            <p className="mt-2 text-sm text-muted">Quality products, fair prices, delivered to your door.</p>
          </div>
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-medium mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted hover:text-ink transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between gap-4 text-xs text-muted">
          <span>© {new Date().getFullYear()} Duka. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-ink">Privacy</Link>
            <Link href="/terms" className="hover:text-ink">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}