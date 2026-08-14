export type Role = 'CUSTOMER' | 'RIDER' | 'ADMIN' | 'BUSINESS';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string | null;
  category: string;
  isActive: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  lineTotal: number;
  inStock: boolean;
}

export interface Cart {
  cartId: string;
  items: CartItem[];
  total: number;
}

export type OrderStatus = 'AWAITING_PAYMENT' | 'PAID' | 'CANCELLED';

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product: Product;
}

export interface Order {
  id: string;
  status: OrderStatus;
  productsTotal: number;
  deliveryFee: number;
  totalAmount: number;
  recipientName: string;
  recipientPhone: string;
  dropoffAddress: string;
  bookingId: string | null;
  items: OrderItem[];
  createdAt: string;
}

export type BookingStatus =
  | 'AWAITING_PAYMENT'
  | 'PENDING'
  | 'CONFIRMED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED';

export interface Booking {
  id: string;
  status: BookingStatus;
  recipientName: string;
  recipientPhone: string;
  pickupAddress: string;
  dropoffAddress: string;
  price: number;
  rider: { id: string; name: string; phone: string } | null;
  createdAt: string;
}

export interface Zone {
  id: string;
  name: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface CategoryCount {
  category: string;
  count: number;
}