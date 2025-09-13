// Common types used across the application
export type UserRole = 'buyer' | 'seller';

export interface User {
  id: string;
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  shopId: string;
  category: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  shopId: string;
  shopName: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'accepted' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderStatusUpdate {
  status: string;
  timestamp: Date;
  message?: string;
  updatedBy: 'buyer' | 'seller' | 'system';
}

export interface OrderWithTracking extends Order {
  statusHistory: OrderStatusUpdate[];
  trackingNumber?: string;
  estimatedDelivery?: Date;
}

export interface SellerOrder extends Order {
  customerName: string;
  customerEmail: string;
  shopId: string;
  shopName: string;
}