import { UserRole } from '../models/admin.model';

export const PERMISSIONS: Record<UserRole, string[]> = {
  ADMIN: [
    'VIEW_DASHBOARD',
    'MANAGE_PRODUCTS',
    'MANAGE_CATEGORIES',
    'MANAGE_ORDERS',
    'MANAGE_USERS',
  ],
  USER: ['VIEW_PRODUCTS', 'MANAGE_CART', 'MANAGE_FAVORITES', 'PLACE_ORDER'],
};
