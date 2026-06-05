import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminUser, UserRole } from '../../core/models/admin.model';
import { UserService } from '../../core/services/user.service';

@Component({
  standalone: true,
  selector: 'app-admin-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
})
export class AdminUsersComponent implements OnInit {
  private userService = inject(UserService);

  users: AdminUser[] = [];
  roles: UserRole[] = ['USER', 'ADMIN'];
  message = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAll().subscribe((users) => {
      this.users = users;
    });
  }

  updateRole(user: AdminUser, role: UserRole): void {
    this.userService.updateRole(user.id, role).subscribe(() => {
      this.message = 'User role updated successfully.';
      this.loadUsers();
    });
  }

  toggleActive(user: AdminUser): void {
    this.userService.toggleActive(user.id).subscribe(() => {
      this.message = 'User status updated successfully.';
      this.loadUsers();
    });
  }

  deleteUser(user: AdminUser): void {
    if (!confirm(`Delete user "${user.fullName}"?`)) {
      return;
    }

    this.userService.delete(user.id).subscribe(() => {
      this.message = 'User deleted successfully.';
      this.loadUsers();
    });
  }
}
