import type { PaginatedResponse, Product, CategoryCount } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export async function getProducts(params: { category?: string; search?: string; page?: number; limit?: number } = {}) {
  const query = new URLSearchParams();
  if (params.category) query.set('category', params.category);
  if (params.search) query.set('search', params.search);
  query.set('page', String(params.page ?? 1));
  query.set('limit', String(params.limit ?? 20));

  const res = await fetch(`${API_BASE_URL}/products?${query}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to load products');
  return res.json() as Promise<PaginatedResponse<Product>>;
}

export async function getProduct(id: string) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.product as Product;
}

export async function getCategories() {
  const res = await fetch(`${API_BASE_URL}/products/categories`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error('Failed to load categories');
  const data = await res.json();
  return data.categories as CategoryCount[];
}