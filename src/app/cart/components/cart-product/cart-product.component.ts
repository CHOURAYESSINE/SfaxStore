import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CartProduct } from '../../../shared/models/cart-product';
import { TndCurrencyPipe } from '../../../shared/pipes/tnd-currency.pipe';
import { FavoritesService } from '../../../core/services/favorites.service';

@Component({
  standalone: true,
  selector: 'app-cart-product',
  imports: [TndCurrencyPipe],
  templateUrl: './cart-product.component.html',
})
export class CartProductComponent implements OnInit {
  private favoritesService = inject(FavoritesService);
  
  @Input({ required: true }) cartProduct!: CartProduct;
  total: number = 0;
  isFavorite: boolean = false;

  @Output() updateCartEvent = new EventEmitter<void>();

  ngOnInit(): void {
    this.updateTotal();
    this.isFavorite = this.favoritesService.isFavorite(this.cartProduct.product.id);
  }
  
  toggleFavorite(): void {
    this.isFavorite = this.favoritesService.toggleFavorite(this.cartProduct.product.id);
  }

  updateQantity(num: number) {
    let result = this.cartProduct.quantity + num;
    const stock = this.cartProduct.product.stock;

    if (result < 1) {
      result = 1;
    }

    if (result > stock) {
      result = stock;
    }

    this.cartProduct.quantity = result;
    this.updateTotal();
    this.updateCart();
    this.updateCartEvent.emit();
  }

  removeProduct() {
    const cartProducts: CartProduct[] = JSON.parse(
      localStorage.getItem('cart-products') as string
    );
    const filteredCartProducts = cartProducts.filter(
      ({ product }) => product.id !== this.cartProduct.product.id
    );
    localStorage.setItem('cart-products', JSON.stringify(filteredCartProducts));
    this.updateCartEvent.emit();
  }

  private updateTotal() {
    this.total = this.cartProduct.product.price * this.cartProduct.quantity;
  }

  private updateCart() {
    const cartProducts: CartProduct[] = JSON.parse(
      localStorage.getItem('cart-products') as string
    );
    const filteredCartProducts = cartProducts.filter(
      ({ product }) => product.id !== this.cartProduct.product.id
    );
    const updatedCartProducts = [...filteredCartProducts, this.cartProduct];
    localStorage.setItem('cart-products', JSON.stringify(updatedCartProducts));
  }
}
