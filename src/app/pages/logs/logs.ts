import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogService } from '../../core/services/log';
import { ServerService } from '../../core/services/server';
import { AppLog } from '../../models/log';
import { Server } from '../../models/server';

@Component({
  selector: 'app-logs',
  imports: [CommonModule, FormsModule],
  templateUrl: './logs.html',
  styleUrl: './logs.css'
})
export class LogsComponent implements OnInit {

  servers: Server[] = [];
  logs: AppLog[] = [];
  loading = false;

  selectedServerId: number | null = null;
  filterLevel = '';
  filterApp = '';
  filterKeyword = '';
  currentPage = 0;
  pageSize = 20;
  totalPages = 0;
  totalElements = 0;

  constructor(
    private logService: LogService,
    private serverService: ServerService
  ) {}

  ngOnInit(): void {
    this.serverService.getAll().subscribe({
      next: (servers) => {
        this.servers = servers;
        if (servers.length > 0) {
          this.selectedServerId = servers[0].id;
          this.search();
        }
      }
    });
  }

  collectLogs(): void {
    if (!this.selectedServerId) return;
    this.loading = true;
    this.logService.collectLogs(this.selectedServerId).subscribe({
      next: () => { this.search(); },
      error: () => { this.loading = false; }
    });
  }

  search(): void {
  if (!this.selectedServerId) return;
  this.loading = true;
  this.logService.searchLogs(
    this.selectedServerId,
    this.filterLevel || undefined,
    undefined,
    undefined,
    this.filterKeyword || undefined,
    this.filterApp || undefined,
    this.currentPage,
    this.pageSize
  ).subscribe({
    next: (page) => {
      this.logs = page.content;
      this.totalPages = page.totalPages;
      this.totalElements = page.totalElements;
      this.loading = false;
    },
    error: () => { this.loading = false; }
  });
}

  resetFilters(): void {
    this.filterLevel = '';
    this.filterApp = '';
    this.filterKeyword = '';
    this.currentPage = 0;
    this.search();
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.search();
  }

  getLevelClass(level: string): string {
    switch (level) {
      case 'ERROR': return 'level-error';
      case 'WARN': return 'level-warn';
      case 'INFO': return 'level-info';
      case 'DEBUG': return 'level-debug';
      default: return 'level-default';
    }
  }

  getPages(): number[] {
    const pages = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages - 1, this.currentPage + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }
}