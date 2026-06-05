import {AsyncPipe, CommonModule} from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  navItems = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Products', path: '/admin/products' },
    { label: 'Categories', path: '/admin/categories' },
    { label: 'Orders', path: '/admin/orders' },
    { label: 'Users', path: '/admin/users' },
  ];

  signOut(): void {
    this.authService.signOut();
    this.router.navigate(['/']);
  }
}
