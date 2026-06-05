export type UserRole = 'ADMIN' | 'USER';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  productsCount?: number;
}

export interface AdminProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: number;
  category?: Category;
  createdAt?: string;
  sold?: number;
}

export interface OrderItem {
  id: number;
  productId: number;
  product?: AdminProduct;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  userId: number;
  user?: AdminUser;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  monthlyOrders: number;
  lowStockProducts: number;
  topProducts: AdminProduct[];
  recentOrders: Order[];
}

export interface MonthlyMetric {
  label: string;
  value: number;
}

export interface CategoryMetric {
  category: string;
  value: number;
}
