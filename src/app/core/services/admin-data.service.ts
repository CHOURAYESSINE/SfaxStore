import { Injectable } from '@angular/core';
import { AdminProduct, AdminUser, Category, Order } from '../models/admin.model';

const CATEGORIES_KEY = 'admin-categories';
const PRODUCTS_KEY = 'admin-products';
const USERS_KEY = 'admin-users';
const ORDERS_KEY = 'admin-orders';

@Injectable({
  providedIn: 'root',
})
export class AdminDataService {
  getCategories(): Category[] {
    return this.read(CATEGORIES_KEY, this.seedCategories());
  }

  saveCategories(categories: Category[]): void {
    this.write(CATEGORIES_KEY, categories);
  }

  getProducts(): AdminProduct[] {
    const categories = this.getCategories();
    return this.read(PRODUCTS_KEY, this.seedProducts()).map((product) => ({
      ...product,
      category: categories.find((category) => category.id === product.categoryId),
    }));
  }

  saveProducts(products: AdminProduct[]): void {
    this.write(
      PRODUCTS_KEY,
      products.map(({ category, ...product }) => product)
    );
  }

  getUsers(): AdminUser[] {
    return this.read(USERS_KEY, this.seedUsers());
  }

  saveUsers(users: AdminUser[]): void {
    this.write(USERS_KEY, users);
  }

  getOrders(): Order[] {
    const users = this.getUsers();
    const products = this.getProducts();
    return this.read(ORDERS_KEY, this.seedOrders()).map((order) => ({
      ...order,
      user: users.find((user) => user.id === order.userId),
      items: order.items.map((item) => ({
        ...item,
        product: products.find((product) => product.id === item.productId),
      })),
    }));
  }

  saveOrders(orders: Order[]): void {
    this.write(
      ORDERS_KEY,
      orders.map((order) => ({
        ...order,
        user: undefined,
        items: order.items.map(({ product, ...item }) => item),
      }))
    );
  }

  nextId(items: Array<{ id: number }>): number {
    return items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
  }

  private read<T>(key: string, fallback: T): T {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) {
        this.write(key, fallback);
        return fallback;
      }

      return JSON.parse(stored) as T;
    } catch {
      this.write(key, fallback);
      return fallback;
    }
  }

  private write<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  private seedCategories(): Category[] {
    return [
      { id: 1, name: 'Computers', description: 'Laptops, desktops and workstations' },
      { id: 2, name: 'Accessories', description: 'Keyboards, mice and useful peripherals' },
      { id: 3, name: 'Gaming', description: 'Gaming gear and performance devices' },
      { id: 4, name: 'Smart Home', description: 'Connected devices and home automation' },
    ];
  }

  private seedProducts(): AdminProduct[] {
    return [
      {
        id: 1,
        name: 'Lenovo ThinkPad E15',
        description: 'Business laptop with solid performance for students and professionals.',
        price: 2450,
        stock: 9,
        imageUrl: 'https://m.media-amazon.com/images/I/51O4bS147tL._AC_SL1000_.jpg',
        categoryId: 1,
        createdAt: '2026-01-10',
        sold: 34,
      },
      {
        id: 2,
        name: 'Mechanical RGB Keyboard',
        description: 'Responsive mechanical keyboard with customizable RGB lighting.',
        price: 180,
        stock: 18,
        imageUrl: 'https://m.media-amazon.com/images/I/51IQ2qI3cdL._AC_SL1000_.jpg',
        categoryId: 2,
        createdAt: '2026-01-18',
        sold: 71,
      },
      {
        id: 3,
        name: 'Gaming Mouse 16K DPI',
        description: 'High precision gaming mouse with programmable buttons.',
        price: 129,
        stock: 4,
        imageUrl: 'https://m.media-amazon.com/images/I/613Viv-hcsL._AC_SL1500_.jpg',
        categoryId: 3,
        createdAt: '2026-02-02',
        sold: 56,
      },
      {
        id: 4,
        name: 'Smart Speaker Mini',
        description: 'Compact smart speaker for music and home automation.',
        price: 210,
        stock: 2,
        imageUrl: 'https://m.media-amazon.com/images/I/71xoR4A6q-L._AC_SL1000_.jpg',
        categoryId: 4,
        createdAt: '2026-02-15',
        sold: 22,
      },
    ];
  }

  private seedUsers(): AdminUser[] {
    return [
      {
        id: 1,
        fullName: 'Admin SfaxStore',
        email: 'admin@sfaxstore.tn',
        role: 'ADMIN',
        active: true,
        createdAt: '2026-01-01',
      },
      {
        id: 2,
        fullName: 'Demo User',
        email: 'user@sfaxstore.tn',
        role: 'USER',
        active: true,
        createdAt: '2026-01-05',
      },
      {
        id: 3,
        fullName: 'Client Sfax',
        email: 'client@sfaxstore.tn',
        role: 'USER',
        active: true,
        createdAt: '2026-02-12',
      },
    ];
  }

  private seedOrders(): Order[] {
    return [
      {
        id: 1001,
        userId: 2,
        totalAmount: 2630,
        status: 'DELIVERED',
        createdAt: '2026-01-21',
        items: [
          { id: 1, productId: 1, quantity: 1, unitPrice: 2450 },
          { id: 2, productId: 2, quantity: 1, unitPrice: 180 },
        ],
      },
      {
        id: 1002,
        userId: 3,
        totalAmount: 339,
        status: 'SHIPPED',
        createdAt: '2026-02-18',
        items: [
          { id: 3, productId: 3, quantity: 1, unitPrice: 129 },
          { id: 4, productId: 4, quantity: 1, unitPrice: 210 },
        ],
      },
      {
        id: 1003,
        userId: 2,
        totalAmount: 360,
        status: 'PENDING',
        createdAt: '2026-06-01',
        items: [{ id: 5, productId: 2, quantity: 2, unitPrice: 180 }],
      },
    ];
  }
}
