import { api } from './api';
import type { Booking, PaginatedResponse } from './types';

export const riderApi = {
  listDeliveries: (token: string, status?: string, page = 1, limit = 20) => {
    const query = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) query.set('status', status);
    return api.get<PaginatedResponse<Booking>>(`/bookings?${query}`, token);
  },

  getBooking: (token: string, id: string) => api.get<{ booking: Booking }>(`/bookings/${id}`, token),

  updateBookingStatus: (token: string, bookingId: string, status: string, note?: string) =>
    api.patch<{ booking: Booking }>(`/bookings/${bookingId}/status`, { status, note }, token),
};
