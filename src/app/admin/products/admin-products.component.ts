import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AdminProduct, Category } from '../../core/models/admin.model';
import { AdminProductService } from '../../core/services/admin-product.service';
import { CategoryService } from '../../core/services/category.service';
import { TndCurrencyPipe } from '../../shared/pipes/tnd-currency.pipe';

@Component({
  standalone: true,
  selector: 'app-admin-products',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TndCurrencyPipe],
  templateUrl: './admin-products.component.html',
})
export class AdminProductsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  uploading = false;
  private productService = inject(AdminProductService);
  private categoryService = inject(CategoryService);

  products: AdminProduct[] = [];
  categories: Category[] = [];
  searchTerm = '';
  categoryFilter: number | 'all' = 'all';
  editingProduct: AdminProduct | null = null;
  showForm = false;
  message = '';

  productForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', Validators.required],
    price: [1, [Validators.required, Validators.min(1)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    imageUrl: ['', Validators.required],
    categoryId: [null as number | null, Validators.required],
  });

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe((categories) => {
      this.categories = categories;
    });
  }

  loadProducts(): void {
    this.productService.search(this.searchTerm, this.categoryFilter).subscribe((products) => {
      this.products = products;
    });
  }

  openCreateForm(): void {
    this.editingProduct = null;
    this.productForm.reset({ price: 1, stock: 0, categoryId: null, name: '', description: '', imageUrl: '' });
    this.showForm = true;
    this.message = '';
  }

  editProduct(product: AdminProduct): void {
    this.editingProduct = product;
    this.productForm.setValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
      categoryId: product.categoryId,
    });
    this.showForm = true;
    this.message = '';
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const value = this.productForm.getRawValue();
    const payload = {
      name: value.name || '',
      description: value.description || '',
      price: Number(value.price),
      stock: Number(value.stock),
      imageUrl: value.imageUrl || '',
      categoryId: Number(value.categoryId),
      sold: this.editingProduct?.sold || 0,
    };

    const request$ = this.editingProduct
      ? this.productService.update({ ...this.editingProduct, ...payload })
      : this.productService.create(payload);

    request$.subscribe(() => {
      this.message = this.editingProduct ? 'Product updated successfully.' : 'Product created successfully.';
      this.showForm = false;
      this.loadProducts();
      this.loadCategories();
    });
  }

  deleteProduct(product: AdminProduct): void {
    if (!confirm(`Delete "${product.name}"?`)) {
      return;
    }

    this.productService.delete(product.id).subscribe(() => {
      this.message = 'Product deleted successfully.';
      this.loadProducts();
      this.loadCategories();
    });
  }

  uploadImage(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024 || !['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      this.message = 'Choose a PNG, JPEG or WebP image under 2 MB.';
      return;
    }
    this.uploading = true;
    const reader = new FileReader();
    reader.onerror = () => { this.uploading = false; this.message = 'Unable to read this image.'; };
    reader.onload = () => this.http.post<{url:string}>(environment.apiUrl + '/images', {data: reader.result}).subscribe({
      next: result => { this.productForm.patchValue({imageUrl: result.url}); this.uploading = false; this.message = 'Image uploaded.'; },
      error: err => { this.uploading = false; this.message = err?.error?.message || 'Image upload failed.'; }
    });
    reader.readAsDataURL(file);
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingProduct = null;
  }
}
