import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent implements OnInit, OnDestroy {

  unresolvedCount = 0;
  private pollInterval: any;

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUnresolvedCount();
    this.pollInterval = setInterval(() => this.loadUnresolvedCount(), 30000);
  }

  ngOnDestroy(): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  loadUnresolvedCount(): void {
    this.http.get<any[]>('http://localhost:8080/api/alerts/unresolved').subscribe({
      next: (alerts) => this.unresolvedCount = alerts.length,
      error: () => this.unresolvedCount = 0
    });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}