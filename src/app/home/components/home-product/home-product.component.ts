import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Product } from '../../../shared/models/product';
import { TndCurrencyPipe } from '../../../shared/pipes/tnd-currency.pipe';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home-product',
  imports: [CommonModule, TndCurrencyPipe, RouterLink],
  templateUrl: './home-product.component.html',
})
export class HomeProductComponent {
  @Input({ required: true }) product!: Product;
}
