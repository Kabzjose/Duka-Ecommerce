'use client';

import { Sparkles, Truck, RefreshCw } from 'lucide-react';

export function AnnouncementBar() {
  return (
    <div className="bg-ink text-white text-xs py-2 px-4 border-b border-white/10">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-1.5 text-center sm:text-left font-medium">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded bg-brand px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider text-white">
            <Sparkles className="h-3 w-3" /> Special Offer
          </span>
          <span className="text-white/90">Free delivery nationwide on all orders over KES 5,000</span>
        </div>
        <div className="hidden md:flex items-center gap-5 text-white/70 text-[11px]">
          <span className="flex items-center gap-1">
            <Truck className="h-3.5 w-3.5 text-brand-light" /> Same-day delivery in Nairobi
          </span>
          <span className="flex items-center gap-1">
            <RefreshCw className="h-3.5 w-3.5 text-brand-light" /> 7-day hassle-free returns
          </span>
        </div>
      </div>
    </div>
  );
}
