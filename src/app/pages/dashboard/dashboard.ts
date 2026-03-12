import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ServerService } from '../../core/services/server';
import { SupervisionService } from '../../core/services/supervision';
import { Server } from '../../models/server';
import { ServerMetrics } from '../../models/metrics';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  servers: Server[] = [];
  totalServers = 0;
  serversUp = 0;
  serversDown = 0;
  loading = true;

  selectedServerId: number | null = null;
  metrics: ServerMetrics | null = null;
  metricsHistory: ServerMetrics[] = [];
  loadingMetrics = false;

  cpuChart: Chart | null = null;
  ramChart: Chart | null = null;
  diskChart: Chart | null = null;

  constructor(
    private serverService: ServerService,
    private supervisionService: SupervisionService
  ) {}

  ngOnInit(): void {
    this.loadServers();
  }

  loadServers(): void {
    this.serverService.getAll().subscribe({
      next: (servers) => {
        this.servers = servers;
        this.totalServers = servers.length;
        this.serversUp = servers.filter(s => s.status === 'UP').length;
        this.serversDown = servers.filter(s => s.status === 'DOWN').length;
        this.loading = false;
        if (servers.length > 0) {
          this.selectServer(servers[0].id);
        }
      },
      error: () => { this.loading = false; }
    });
  }

  selectServer(serverId: number): void {
    this.selectedServerId = serverId;
    this.loadMetrics(serverId);
  }

  loadMetrics(serverId: number): void {
    this.loadingMetrics = true;
    this.supervisionService.getLatestMetrics(serverId).subscribe({
      next: (metrics) => {
        this.metrics = metrics;
        this.loadingMetrics = false;
        this.loadMetricsHistory(serverId);
      },
      error: () => { this.loadingMetrics = false; }
    });
  }

  loadMetricsHistory(serverId: number): void {
    this.supervisionService.getMetricsHistory(serverId).subscribe({
      next: (history) => {
        this.metricsHistory = history.slice(-10);
        setTimeout(() => this.renderCharts(), 100);
      }
    });
  }

  supervise(serverId: number): void {
    this.supervisionService.superviseServer(serverId).subscribe({
      next: () => {
        this.loadServers();
        if (this.selectedServerId === serverId) {
          this.loadMetrics(serverId);
        }
      }
    });
  }

  renderCharts(): void {
    const labels = this.metricsHistory.map((m, i) => `#${i + 1}`);
    const cpuData = this.metricsHistory.map(m => m.cpuUsage);
    const ramData = this.metricsHistory.map(m => m.memoryUsage);
    const diskData = this.metricsHistory.map(m => m.diskUsage);

    this.createChart('cpuChart', labels, cpuData, '#d4001a', 'CPU Usage %');
    this.createChart('ramChart', labels, ramData, '#0a2240', 'RAM Usage %');
    this.createChart('diskChart', labels, diskData, '#f59e0b', 'Disk Usage %');
  }

  createChart(canvasId: string, labels: string[], data: number[], color: string, label: string): void {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();

    new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label,
          data,
          borderColor: color,
          backgroundColor: color + '18',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: color,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            min: 0,
            max: 100,
            grid: { color: '#f0f2f5' },
            ticks: { font: { size: 11 }, callback: (v) => v + '%' }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 11 } }
          }
        }
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'UP': return 'status-up';
      case 'DOWN': return 'status-down';
      default: return 'status-unknown';
    }
  }

  getMetricClass(value: number): string {
    if (value >= 90) return 'metric-critical';
    if (value >= 75) return 'metric-warn';
    return 'metric-ok';
  }

  getSelectedServer(): Server | undefined {
    return this.servers.find(s => s.id === this.selectedServerId);
  }
}