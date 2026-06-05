import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SavePurchaseDto } from '../../shared/models/save-purchase';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/orders`;

  save(savePurchaseDto: SavePurchaseDto): Observable<{ id: number; totalAmount: number; status: string }> {
    return this.http.post<{ id: number; totalAmount: number; status: string }>(this.baseUrl, {
      userId: savePurchaseDto.userId || 2,
      giftCardDiscount: savePurchaseDto.giftCardDiscount || 0,
      items: savePurchaseDto.products.map((product) => ({
        productId: Number(product.id),
        quantity: product.quantity,
      })),
    });
  }
}
