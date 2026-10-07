import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
@Component({ standalone: true, selector: 'app-payment-success', imports: [RouterLink], templateUrl: './payment-success.component.html' })
export class PaymentSuccessComponent implements OnInit {
  private productService = inject(ProductService);
  statusMessage = '';
  hasError = false;
  ngOnInit(): void {
    const order = JSON.parse(sessionStorage.getItem('last-order') || 'null');
    this.hasError = !order;
    this.statusMessage = order ? 'Order #' + order.id + ' saved. Payment is due on delivery.' : 'No confirmed order was found. Return to your cart to place an order.';
    this.productService.clearCache();
  }
}
