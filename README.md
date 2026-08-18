# Duka — Frontend

Customer storefront and admin dashboard for **Duka**, an e-commerce platform with integrated delivery fulfillment, built on top of the Deliver Chap Chap backend API.

## Overview

Duka lets customers browse products, add them to a cart, and check out with M-Pesa or card payment. On successful payment, an order automatically becomes a delivery booking, fulfilled through the connected backend's rider/logistics system. Admins manage bookings, riders, users, and the product catalog through a dedicated `/admin` area.

## Tech Stack

- **Framework**: Next.js (App Router), TypeScript
- **Styling**: Tailwind CSS, custom design tokens (warm off-white background, deep green brand accent, monospace pricing)
- **State**: React Context (`AuthContext`, `CartContext`) — no external state library
- **Icons**: lucide-react
- **Fonts**: Inter, Inter Tight, IBM Plex Mono (via `next/font/google`)

## Architecture Notes

- **Real backend integration from day one** — no mocked data; all auth, products, cart, checkout, and orders are wired directly to the Express API.
- **Server Components by default** — product listing, category, and detail pages fetch data server-side for fast initial loads and SEO. Interactive pieces (cart, forms, auth-aware UI) are explicit Client Components (`'use client'`).
- **Auth**: access tokens live in memory only (React state, never `localStorage`); refresh tokens are httpOnly cookies handled entirely by the backend. A silent `/auth/refresh` call on load restores sessions across page reloads.
- **Route groups**:
  - `(shop)` — public storefront pages, shares the main header/footer layout
  - `(auth)` — login/register/forgot-password, minimal layout
  - `(account)` — logged-in customer pages (cart, checkout, orders, wishlist, account settings); guarded by a client-side auth check
  - `admin` — admin-only dashboard, separate sidebar shell, guarded by role check

## Project Structure

```text
duka-frontend/
├── src/
│   ├── app/
│   │   ├── (shop)/           # Public storefront routes (Home, Shop, Categories, Deals, Product Details)
│   │   ├── (auth)/           # Auth pages (Login, Register, Forgot Password)
│   │   ├── (account)/        # Protected customer account pages (Cart, Checkout, Orders, Wishlist)
│   │   ├── admin/            # Admin Dashboard (Bookings, Products, Users, Analytics)
│   │   ├── rider/            # Rider Portal (Assigned Deliveries & Live Status Updates)
│   │   ├── layout.tsx        # Root application layout & global providers
│   │   ├── not-found.tsx     # Custom 404 page
│   │   └── error.tsx         # Global error boundary
│   ├── components/
│   │   ├── layout/           # Header, AnnouncementBar, Footer
│   │   ├── home/             # TrustBar, NewsletterForm, HeroSpotlight
│   │   ├── products/         # ProductCard, ProductGrid, ProductFilters, AddToCartPanel
│   │   ├── checkout/         # Multi-step CheckoutFlow (M-Pesa & Card)
│   │   ├── orders/           # Live OrderTracker status timeline
│   │   └── ui/               # Button, Input, Select, Price, Pagination, Toast
│   ├── context/
│   │   ├── AuthContext.tsx   # Global authentication state & session refresh
│   │   └── CartContext.tsx   # Shopping cart state & API synchronization
│   ├── hooks/
│   │   └── useWishlist.ts    # Client-side wishlist state
│   └── lib/
│       ├── api.ts            # Authenticated API client wrapper
│       ├── products.ts       # Server Component data fetching helper
│       ├── orders.ts         # Customer order management helper
│       ├── rider.ts          # Rider delivery management helper
│       ├── admin.ts          # Admin portal API helper
│       └── types.ts          # TypeScript interfaces for API models
└── public/                   # Static assets & icons
```


### Prerequisites
- Node.js 22+
- pnpm 9+
- The backend API running locally or deployed (see backend README)

### Setup

```bash
pnpm install
cp .env.local.example .env.local   # or create manually, see below
pnpm dev
```

Runs at `http://localhost:3000`.

### Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Point this at your deployed backend URL in production.

### Scripts

```bash
pnpm dev      # start dev server
pnpm build    # production build
pnpm start    # run production build
```

## Key Flows

### Checkout
Multi-step flow (Shipping → Delivery → Payment → Review) in `components/checkout/CheckoutFlow.tsx`:
- **M-Pesa**: initiates STK Push, polls order status until payment confirms (webhook-driven on the backend), then redirects to order confirmation
- **Card (Paystack)**: redirects to Paystack's hosted checkout, returns to `/payment/callback`, which polls for payment confirmation before redirecting to order confirmation

### Order tracking
`/orders/:id` fetches both the order and its linked delivery booking, polling every 10s to reflect live delivery status (`Preparing → Rider Assigned → Picked Up → Out for Delivery → Delivered`).

### Admin dashboard (`/admin`)
- **Overview** — booking/revenue stats
- **Bookings** — filter by status, assign riders, progress delivery status
- **Users & Riders** — create rider/admin accounts, deactivate users
- **Products** — create products, adjust stock, deactivate listings

## Design System

- Colors: warm off-white background (`#FAF9F5`), near-black text, deep bottle green brand accent (`#1B5E43`), amber for discount/rating accents
- Typography: `Inter Tight` for headings, `Inter` for body, `IBM Plex Mono` for all price displays (consistent tabular pricing across the app)
- Minimal shadows, 1px hairline borders for card separation, 4–8px border radius (not heavily rounded)

## Known Limitations / Not Yet Implemented

- **Wishlist and saved addresses are localStorage-only** — not persisted to the backend, will not sync across devices
- **No discount/deals pricing** — `/deals` currently shows the full catalog; backend doesn't yet model sale prices
- **Profile editing is disabled** — no backend endpoint yet for updating user details
- **No form-level validation library** — client-side validation is manual per form; should mirror backend Zod schemas exactly (see backend's `src/modules/*/. schema.ts` and `src/lib/phone.ts` for exact accepted formats)
- **Live GPS map view not built** — the backend's Socket.io tracking channel exists, but the frontend doesn't yet render a live map; `/orders/:id` uses polling instead

## Deployment

Deployed on [Vercel] (or your chosen host). Ensure `NEXT_PUBLIC_API_URL` points to the production backend, and that the backend's CORS configuration explicitly allows this frontend's deployed origin (see backend's `app.ts`).