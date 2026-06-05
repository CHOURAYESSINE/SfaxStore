import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Product } from '../shared/models/product';
import { HomeProductComponent } from './components/home-product/home-product.component';
import { ProductService } from '../core/services/product.service';
import { Observable, switchMap, distinctUntilChanged, map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, HomeProductComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  productService = inject(ProductService);
  route = inject(ActivatedRoute);

  searchTerm = '';
  
  private readonly searchTerm$ = this.route.queryParamMap.pipe(
    map((params) => params.get('search')?.trim() || ''),
    distinctUntilChanged(),
    map((term) => {
      this.searchTerm = term;
      return term;
    })
  );

  products$: Observable<Product[]> = this.searchTerm$.pipe(
    switchMap((search) => {
      return search
        ? this.productService.searchProducts(search)
        : this.productService.getAll();
    })
  );
  
  products = toSignal(this.products$, { initialValue: [] });
}
