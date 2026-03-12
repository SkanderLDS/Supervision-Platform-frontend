import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user';
import { AuthService } from '../../core/services/auth';
import { User } from '../../models/user';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class UsersComponent implements OnInit {

  users: User[] = [];
  loading = false;
  activeTab: 'users' | 'audit' = 'users';
  auditLogs: any[] = [];
  loadingAudit = false;

  showRoleForm = false;
  selectedUser: User | null = null;
  newRole = 'VIEWER';
  saving = false;
  errorMessage = '';

  constructor(
    private userService: UserService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  loadAuditLogs(): void {
    this.loadingAudit = true;
    this.userService.getAuditLogs().subscribe({
      next: (logs) => {
        this.auditLogs = logs;
        this.loadingAudit = false;
      },
      error: () => { this.loadingAudit = false; }
    });
  }

  switchTab(tab: 'users' | 'audit'): void {
    this.activeTab = tab;
    if (tab === 'audit' && this.auditLogs.length === 0) {
      this.loadAuditLogs();
    }
  }

  openRoleForm(user: User): void {
    this.selectedUser = user;
    this.newRole = user.roles?.[0] || 'VIEWER';
    this.errorMessage = '';
    this.showRoleForm = true;
  }

  assignRole(): void {
    if (!this.selectedUser) return;
    this.saving = true;
    this.userService.assignRole(this.selectedUser.id, this.newRole).subscribe({
      next: () => {
        this.saving = false;
        this.showRoleForm = false;
        this.loadUsers();
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err.error?.message || 'Failed to assign role.';
      }
    });
  }

  deleteUser(user: User): void {
    if (!confirm(`Delete user "${user.username}"?`)) return;
    this.userService.delete(user.id).subscribe({
      next: () => this.loadUsers()
    });
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'ADMIN': return 'role-admin';
      case 'MANAGER': return 'role-manager';
      default: return 'role-viewer';
    }
  }
}