import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServerService } from '../../core/services/server';
import { Server, ServerRequest } from '../../models/server';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-servers',
  imports: [CommonModule, FormsModule],
  templateUrl: './servers.html',
  styleUrl: './servers.css'
})
export class ServersComponent implements OnInit {

  servers: Server[] = [];
  loading = true;
  showForm = false;
  editingServer: Server | null = null;
  saving = false;
  errorMessage = '';

  form: ServerRequest = this.emptyForm();

  constructor(private serverService: ServerService, public authService: AuthService) {}

  ngOnInit(): void {
    this.loadServers();
  }

  loadServers(): void {
    this.serverService.getAll().subscribe({
      next: (servers) => {
        this.servers = servers;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  openAddForm(): void {
    this.editingServer = null;
    this.form = this.emptyForm();
    this.errorMessage = '';
    this.showForm = true;
  }

  openEditForm(server: Server): void {
  this.editingServer = server;
  this.form = {
    name: server.name,
    host: server.host,
    sshPort: server.sshPort,
    sshUsername: server.sshUsername,
    sshPassword: '',
    port: 8080,
    version: '23',
    type: server.type,
    environment: server.environment,
    serverHomePath: server.serverHomePath,
    managementPort: server.managementPort,
    managementUsername: '',
    managementPassword: ''
  };
  this.errorMessage = '';
  this.showForm = true;
}

  closeForm(): void {
    this.showForm = false;
    this.editingServer = null;
    this.errorMessage = '';
  }

  save(): void {
    this.saving = true;
    this.errorMessage = '';

    const request = this.editingServer
      ? this.serverService.update(this.editingServer.id, this.form)
      : this.serverService.create(this.form);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.closeForm();
        this.loadServers();
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err.error?.message || 'Failed to save server.';
      }
    });
  }

  delete(server: Server): void {
    if (!confirm(`Delete server "${server.name}"?`)) return;
    this.serverService.delete(server.id).subscribe({
      next: () => this.loadServers()
    });
  }

  checkConnectivity(server: Server): void {
    this.serverService.checkGlobal(server.id).subscribe({
      next: () => this.loadServers()
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'UP': return 'status-up';
      case 'DOWN': return 'status-down';
      default: return 'status-unknown';
    }
  }

  emptyForm(): ServerRequest {
  return {
    name: '', host: '', sshPort: 22, sshUsername: '',
    sshPassword: '', port: 8080, version: '23',
    type: 'WILDFLY', environment: 'DEV',
    serverHomePath: '/opt/wildfly', managementPort: 9990,
    managementUsername: 'admin', managementPassword: ''
  };
}
}