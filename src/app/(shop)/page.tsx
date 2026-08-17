import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { getProducts, getCategories } from '@/lib/products';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductGridSkeleton } from '@/components/products/ProductCardSkeleton';
import { Button } from '@/components/ui/Button';
import { TrustBar } from '@/components/home/TrustBar';
import { NewsletterForm } from '@/components/home/NewsLetterForm';
import { ArrowRight, Sparkles, ShoppingBag, ShieldCheck, Tag, Zap, ChevronRight, LayoutGrid } from 'lucide-react';
import { Price } from '@/components/ui/Price';

async function HeroSpotlight() {
  const { items } = await getProducts({ limit: 1 });
  const featuredProduct = items[0];

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ink via-ink/95 to-brand-dark text-white p-6 sm:p-10 lg:p-12 shadow-card">
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
        {/* Left Campaign Column */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-brand-light backdrop-blur-md w-fit mb-4 border border-white/10">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>NEW SEASON ARRIVALS 2026</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
            Everything you need. <br />
            <span className="text-brand-light">Delivered fresh</span> to your door.
          </h1>

          <p className="mt-4 text-sm sm:text-base text-white/80 max-w-lg leading-relaxed font-sans">
            Shop Kenya’s finest collection of electronics, home essentials, and fashion with guaranteed quality and nationwide express shipping.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/shop">
              <Button size="lg" className="bg-brand hover:bg-brand/90 text-white font-bold gap-2 px-7 py-4 shadow-lg shadow-brand/20">
                Shop Collection <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/deals">
              <Button variant="ghost" size="lg" className="text-white hover:bg-white/10 border border-white/20 px-6 py-4">
                Explore Deals <Tag className="h-4 w-4 ml-1 text-accent" />
              </Button>
            </Link>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-6 text-xs text-white/70 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-brand-light" /> 100% Genuine Products
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-accent" /> Express Delivery Available
            </span>
          </div>
        </div>

        {/* Right Featured Product Spotlight Hero Card */}
        {featuredProduct && (
          <div className="lg:col-span-5">
            <div className="relative rounded-xl bg-white/10 p-5 backdrop-blur-md border border-white/20 shadow-2xl hover:border-white/40 transition-all duration-300 group">
              <div className="relative aspect-square rounded-lg bg-white overflow-hidden mb-4">
                {featuredProduct.imageUrl ? (
                  <Image
                    src={featuredProduct.imageUrl}
                    alt={featuredProduct.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-ink/40 text-sm">Product Preview</div>
                )}
                <span className="absolute top-3 left-3 bg-accent text-white font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
                  SPOTLIGHT ITEM
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-brand-light font-semibold">
                    {featuredProduct.category}
                  </span>
                  <h3 className="text-base font-bold text-white line-clamp-1 mt-0.5">
                    {featuredProduct.name}
                  </h3>
                  <div className="mt-1 text-white">
                    <Price amount={featuredProduct.price} size="sm" className="text-white" />
                  </div>
                </div>

                <Link href={`/product/${featuredProduct.id}`}>
                  <Button size="sm" className="bg-white text-ink hover:bg-brand-light hover:text-brand font-semibold whitespace-nowrap shrink-0">
                    View <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

async function FeaturedProducts() {
  const { items } = await getProducts({ limit: 8 });
  return <ProductGrid products={items} />;
}

async function CategoryStrip() {
  const categories = await getCategories();
  if (categories.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories.map((c, i) => (
        <Link
          key={c.category}
          href={`/categories/${encodeURIComponent(c.category)}`}
          className="group relative flex flex-col justify-between p-5 rounded-xl border border-border bg-surface hover:bg-brand-light/40 hover:border-brand/40 transition-all duration-200 shadow-subtle hover:shadow-card-hover"
        >
          <div className="p-3 rounded-lg bg-bg text-brand group-hover:bg-brand group-hover:text-white transition-colors w-fit mb-3">
            <LayoutGrid className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink group-hover:text-brand transition-colors line-clamp-1">
              {c.category}
            </h3>
            <p className="text-xs text-muted font-mono mt-1">{c.count} items</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted group-hover:text-brand group-hover:translate-x-1 transition-all absolute top-5 right-4" />
        </Link>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-12 py-6">
      <div className="mx-auto max-w-7xl px-4">
        {/* Hero Campaign Section */}
        <Suspense fallback={<div className="h-[480px] bg-ink/10 rounded-2xl animate-pulse" />}>
          <HeroSpotlight />
        </Suspense>
      </div>

      {/* Trust & Service Highlights */}
      <TrustBar />

      <div className="mx-auto max-w-7xl px-4 space-y-16">
        {/* Categories Section */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand">Explore Catalog</span>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-ink mt-1">
                Shop by Category
              </h2>
            </div>
            <Link href="/categories" className="text-xs font-bold uppercase tracking-wider text-brand hover:underline flex items-center gap-1">
              All Categories <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <Suspense fallback={<div className="h-28 bg-border/30 rounded-xl animate-pulse" />}>
            <CategoryStrip />
          </Suspense>
        </section>

        {/* Featured Products Section */}
        <section className="pt-6 border-t border-border-subtle">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand">Handpicked Selection</span>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-ink mt-1">
                Featured Products
              </h2>
            </div>
            <Link href="/shop" className="text-xs font-bold uppercase tracking-wider text-brand hover:underline flex items-center gap-1">
              Explore All <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <Suspense fallback={<ProductGridSkeleton count={8} />}>
            <FeaturedProducts />
          </Suspense>
        </section>

        {/* Commercial Promotional Banner */}
        <section className="rounded-2xl bg-surface border border-border p-8 md:p-12 shadow-card relative overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block rounded bg-accent-light px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-accent-dark mb-3">
                LIMITED TIME OFFER
              </span>
              <h2 className="font-display text-2xl md:text-4xl font-extrabold tracking-tight text-ink">
                Upgrade Your Lifestyle with Authentic Goods
              </h2>
              <p className="mt-3 text-muted text-sm leading-relaxed">
                Enjoy special pricing on top electronics, home essentials, and everyday items. Verified sellers, guaranteed warranty, and instant checkout.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <Link href="/deals">
                  <Button className="bg-ink hover:bg-brand text-white font-bold gap-2">
                    View Deals <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="p-6 rounded-xl bg-brand-light border border-brand/20 max-w-sm text-center">
                <ShoppingBag className="h-12 w-12 text-brand mx-auto mb-3" />
                <h3 className="text-base font-bold text-ink">Fast Delivery Across Kenya</h3>
                <p className="text-xs text-muted mt-1">Order today and get your items delivered within 24–48 hours.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-12 px-6 sm:px-10 rounded-2xl bg-ink text-white shadow-card">
          <div className="max-w-xl mx-auto text-center">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-light">Stay Connected</span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
              Subscribe to Duka Member Perks
            </h2>
            <p className="mt-2 text-sm text-white/70">
              Get secret promotional codes, weekly deal alerts, and new stock drops sent straight to your inbox.
            </p>
            <div className="mt-6">
              <NewsletterForm />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
