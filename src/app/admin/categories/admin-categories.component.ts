import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../core/models/admin.model';
import { CategoryService } from '../../core/services/category.service';

@Component({
  standalone: true,
  selector: 'app-admin-categories',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-categories.component.html',
})
export class AdminCategoriesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  categories: Category[] = [];
  editingCategory: Category | null = null;
  message = '';

  categoryForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
  });

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe((categories) => {
      this.categories = categories;
    });
  }

  editCategory(category: Category): void {
    this.editingCategory = category;
    this.categoryForm.setValue({
      name: category.name,
      description: category.description || '',
    });
    this.message = '';
  }

  saveCategory(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const value = this.categoryForm.getRawValue();
    const payload = {
      name: value.name || '',
      description: value.description || '',
    };

    const request$ = this.editingCategory
      ? this.categoryService.update({ ...this.editingCategory, ...payload })
      : this.categoryService.create(payload);

    request$.subscribe(() => {
      this.message = this.editingCategory ? 'Category updated successfully.' : 'Category created successfully.';
      this.resetForm();
      this.loadCategories();
    });
  }

  deleteCategory(category: Category): void {
    if ((category.productsCount || 0) > 0) {
      this.message = 'Cannot delete a category that still contains products.';
      return;
    }

    if (!confirm(`Delete category "${category.name}"?`)) {
      return;
    }

    this.categoryService.delete(category.id).subscribe(() => {
      this.message = 'Category deleted successfully.';
      this.loadCategories();
    });
  }

  resetForm(): void {
    this.editingCategory = null;
    this.categoryForm.reset({ name: '', description: '' });
  }
}
