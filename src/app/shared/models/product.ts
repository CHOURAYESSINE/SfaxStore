export interface Product {
  id: string;
  name: string;
  description: string;
  urlImg: string;
  reviews: number;
  price: number;
  previousPrice: number | null;
  stock: number;
  categoryId: number;
  categoryName?: string;
}
