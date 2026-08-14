import type { PaginatedResponse, Product, CategoryCount } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'demo-1',
    name: 'Everyday Wireless Earbuds',
    description: 'Compact earbuds with balanced sound for daily listening.',
    price: 3499,
    stockQuantity: 18,
    imageUrl: null,
    category: 'Electronics',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'demo-2',
    name: 'Cotton Canvas Tote',
    description: 'Durable tote bag for errands, work, and market runs.',
    price: 1299,
    stockQuantity: 32,
    imageUrl: null,
    category: 'Accessories',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'demo-3',
    name: 'Minimal Desk Notebook',
    description: 'A5 ruled notebook with smooth paper and lay-flat binding.',
    price: 699,
    stockQuantity: 45,
    imageUrl: null,
    category: 'Stationery',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'demo-4',
    name: 'Ceramic Pour-Over Set',
    description: 'Simple ceramic dripper and server for slow mornings.',
    price: 2199,
    stockQuantity: 12,
    imageUrl: null,
    category: 'Home & Living',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

function fallbackProducts(params: { category?: string; search?: string; sort?: string; page?: number; limit?: number }) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const search = params.search?.toLowerCase();
  let filtered = FALLBACK_PRODUCTS.filter((product) => {
    const matchesCategory = !params.category || product.category === params.category;
    const matchesSearch =
      !search ||
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });

  if (params.sort === 'price_asc') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (params.sort === 'price_desc') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (params.sort === 'newest') {
    filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return {
    items,
    total: filtered.length,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
  } satisfies PaginatedResponse<Product>;
}

function fallbackCategories() {
  const counts = new Map<string, number>();
  for (const product of FALLBACK_PRODUCTS) {
    counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
  }

  return Array.from(counts, ([category, count]) => ({ category, count }));
}

export async function getProducts(params: { category?: string; search?: string; sort?: string; page?: number; limit?: number } = {}) {
  const query = new URLSearchParams();
  if (params.category) query.set('category', params.category);
  if (params.search) query.set('search', params.search);
  if (params.sort) query.set('sort', params.sort);
  query.set('page', String(params.page ?? 1));
  query.set('limit', String(params.limit ?? 20));

  try {
    const res = await fetch(`${API_BASE_URL}/products?${query}`, { next: { revalidate: 60 } });
    if (!res.ok) return fallbackProducts(params);
    return res.json() as Promise<PaginatedResponse<Product>>;
  } catch {
    return fallbackProducts(params);
  }
}

export async function getProduct(id: string) {
  const fallback = FALLBACK_PRODUCTS.find((product) => product.id === id) ?? null;

  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return fallback;
    const data = await res.json();
    return data.product as Product;
  } catch {
    return fallback;
  }
}

export async function getCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/products/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return fallbackCategories();
    const data = await res.json();
    return data.categories as CategoryCount[];
  } catch {
    return fallbackCategories();
  }
}
