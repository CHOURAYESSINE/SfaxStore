import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../../shared/models/product';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface ApiProduct {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  imageUrl: string;
  categoryId: number;
  category?: {
    id: number;
    name: string;
    description?: string;
  };
  sold?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

  getProducts(): Observable<Product[]> {
    return this.http
      .get<ApiProduct[]>(this.apiUrl)
      .pipe(
        map((apiProducts) =>
          apiProducts.map((apiProduct) =>
            this.mapApiProductToProduct(apiProduct)
          )
        )
      );
  }

  getProduct(id: string): Observable<Product | undefined> {
    return this.http.get<ApiProduct>(`${this.apiUrl}/${id}`).pipe(
      map((apiProduct) => {
        if (apiProduct) {
          return this.mapApiProductToProduct(apiProduct);
        }
        return undefined;
      })
    );
  }

  private mapApiProductToProduct(apiProduct: ApiProduct): Product {
    const previousPrice = Math.round(apiProduct.price * 1.15 * 100) / 100;

    return {
      id: apiProduct.id.toString(),
      name: apiProduct.name,
      description: apiProduct.description,
      urlImg: apiProduct.imageUrl,
      reviews: apiProduct.sold || 0,
      price: apiProduct.price,
      previousPrice: previousPrice,
      stock: apiProduct.stock,
      categoryId: apiProduct.categoryId,
      categoryName: apiProduct.category?.name,
    };
  }
}
