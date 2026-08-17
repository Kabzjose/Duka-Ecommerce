import { api } from './api';
import type {
  AdminOverview,
  RiderWithPerformance,
  AdminUser,
  Booking,
  PaginatedResponse,
  Product,
} from './types';

export const adminApi = {
  getOverview: (token: string) => api.get<AdminOverview>('/admin/overview', token),

  listRidersPerformance: (token: string, page = 1, limit = 20) =>
    api.get<PaginatedResponse<RiderWithPerformance>>(`/admin/riders/performance?page=${page}&limit=${limit}`, token),

  listBookings: (token: string, status?: string, page = 1, limit = 20) => {
    const query = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) query.set('status', status);
    return api.get<PaginatedResponse<Booking>>(`/bookings?${query}`, token);
  },

  getBooking: (token: string, id: string) => api.get<{ booking: Booking }>(`/bookings/${id}`, token),

  assignRider: (token: string, bookingId: string, riderId: string) =>
    api.patch<{ booking: Booking }>(`/bookings/${bookingId}/assign-rider`, { riderId }, token),

  updateBookingStatus: (token: string, bookingId: string, status: string, note?: string) =>
    api.patch<{ booking: Booking }>(`/bookings/${bookingId}/status`, { status, note }, token),

  listUsers: (token: string, role?: string, page = 1, limit = 20) => {
    const query = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (role) query.set('role', role);
    return api.get<PaginatedResponse<AdminUser>>(`/users?${query}`, token);
  },

  createUser: (
    token: string,
    data: { name: string; email: string; phone: string; password: string; role: 'RIDER' | 'ADMIN' }
  ) => api.post<{ user: AdminUser }>('/users', data, token),

  deactivateUser: (token: string, id: string) => api.patch(`/users/${id}/deactivate`, {}, token),

  listProducts: (token: string, page = 1, limit = 50) =>
    api.get<PaginatedResponse<Product>>(`/products?page=${page}&limit=${limit}`, token),

  createProduct: (
    token: string,
    data: { name: string; description: string; price: number; stockQuantity: number; category: string; imageUrl?: string }
  ) => api.post<{ product: Product }>('/products', data, token),

  updateProduct: (token: string, id: string, data: Partial<Product>) =>
    api.patch<{ product: Product }>(`/products/${id}`, data, token),

  deactivateProduct: (token: string, id: string) => api.patch(`/products/${id}/deactivate`, {}, token),
};
