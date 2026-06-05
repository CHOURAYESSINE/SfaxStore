import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartProduct } from '../../shared/models/cart-product';
import { PurchaseService } from '../../core/services/purchase.service';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-payment-success',
  imports: [RouterLink],
  templateUrl: './payment-success.component.html',
})
export class PaymentSuccessComponent implements OnInit {
  private readonly purchaseService = inject(PurchaseService);
  private readonly productService = inject(ProductService);

  statusMessage = 'Saving your order in the backend...';
  hasError = false;

  ngOnInit(): void {
    const cartProductsJson = localStorage.getItem('cart-products');
    
    // Handle case where cart is already cleared (page refresh after checkout)
    if (!cartProductsJson) {
      this.statusMessage = 'Order already processed.';
      return;
    }

    const cartProducts: CartProduct[] = JSON.parse(cartProductsJson);
    
    if (!cartProducts || cartProducts.length === 0) {
      this.statusMessage = 'No products found in the cart.';
      return;
    }

    const mappedProducts = cartProducts.map(({ quantity, product }) => {
      return {
        id: product.id,
        quantity,
      };
    });

    const total = cartProducts.reduce((acc, current) => {
      return acc + current.product.price * current.quantity;
    }, 0);
    const appliedGiftCard = JSON.parse(localStorage.getItem('applied-gift-card') || 'null');
    const giftCardDiscount = appliedGiftCard?.amount || 0;

    this.purchaseService.save({ total, products: mappedProducts, userId: 2, giftCardDiscount }).subscribe({
      next: () => {
        localStorage.removeItem('cart-products');
        localStorage.removeItem('applied-gift-card');
        this.productService.clearCache();
        this.statusMessage = 'Order saved successfully. Backend stock has been updated.';
      },
      error: (err) => {
        this.hasError = true;
        this.statusMessage = err?.error || 'Failed to save the order. Please check the backend stock and try again.';
      },
    });
  }
}
