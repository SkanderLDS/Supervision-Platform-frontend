import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServerService } from '../../core/services/server';
import { DeploymentService } from '../../core/services/deployment';
import { ApplicationService } from '../../core/services/application';
import { Server } from '../../models/server';
import { Application, ApplicationVersion } from '../../models/application';

@Component({
  selector: 'app-deployments',
  imports: [CommonModule, FormsModule],
  templateUrl: './deployments.html',
  styleUrl: './deployments.css'
})
export class DeploymentsComponent implements OnInit {

  servers: Server[] = [];
  applications: Application[] = [];
  versions: ApplicationVersion[] = [];

  selectedServerId: number | null = null;
  selectedAppId: number | null = null;

  showAppForm = false;
  showVersionForm = false;
  newAppName = '';
  newAppRuntimeName = '';
  newAppContextPath = '';
  newAppType = 'WAR';
  newVersionNumber = '';
  newVersionType = 'WAR';
  selectedFile: File | null = null;
  saving = false;
  errorMessage = '';

  constructor(
    private serverService: ServerService,
    private deploymentService: DeploymentService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.loadServers();
  }

  loadServers(): void {
    this.serverService.getAll().subscribe({
      next: (servers) => {
        this.servers = servers;
        if (servers.length > 0) {
          this.selectServer(servers[0].id);
        }
      }
    });
  }

  selectServer(serverId: number): void {
    this.selectedServerId = serverId;
    this.selectedAppId = null;
    this.versions = [];
    this.applicationService.getByServerId(serverId).subscribe({
      next: (apps) => {
        this.applications = apps;
        if (apps.length > 0) this.selectApp(apps[0].id);
      }
    });
  }

  selectApp(appId: number): void {
    this.selectedAppId = appId;
    this.loadVersions(appId);
  }

  loadVersions(appId: number): void {
    this.deploymentService.getVersions(appId).subscribe({
      next: (versions) => this.versions = versions
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  createApp(): void {
    if (!this.selectedServerId) return;
    this.saving = true;
    this.applicationService.create({
      name: this.newAppName,
      currentVersion: '1.0.0',
      runtimeName: this.newAppRuntimeName,
      artifactName: this.newAppRuntimeName,
      type: this.newAppType,
      contextPath: this.newAppContextPath,
      serverId: this.selectedServerId
    }).subscribe({
      next: (app) => {
        this.saving = false;
        this.showAppForm = false;
        this.selectServer(this.selectedServerId!);
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err.error?.message || 'Failed to create application.';
      }
    });
  }

  createVersion(): void {
    if (!this.selectedAppId) return;
    this.saving = true;
    this.deploymentService.createVersion(
      this.selectedAppId, this.newVersionNumber, this.newVersionType
    ).subscribe({
      next: () => {
        this.saving = false;
        this.showVersionForm = false;
        this.loadVersions(this.selectedAppId!);
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err.error?.message || 'Failed to create version.';
      }
    });
  }

  deploy(version: ApplicationVersion): void {
    if (!this.selectedFile) {
      alert('Please select a WAR/EAR file first.');
      return;
    }
    this.deploymentService.deploy(version.id, this.selectedFile).subscribe({
      next: () => this.loadVersions(this.selectedAppId!),
      error: (err) => alert(err.error?.message || 'Deployment failed.')
    });
  }

  start(version: ApplicationVersion): void {
    this.deploymentService.start(version.id).subscribe({
      next: () => this.loadVersions(this.selectedAppId!)
    });
  }

  stop(version: ApplicationVersion): void {
    this.deploymentService.stop(version.id).subscribe({
      next: () => this.loadVersions(this.selectedAppId!)
    });
  }

  restart(version: ApplicationVersion): void {
    this.deploymentService.restart(version.id).subscribe({
      next: () => this.loadVersions(this.selectedAppId!)
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'DEPLOYED': return 'status-deployed';
      case 'FAILED': return 'status-failed';
      case 'DEPLOYING': return 'status-deploying';
      default: return 'status-undeployed';
    }
  }

  getSelectedApp(): Application | undefined {
    return this.applications.find(a => a.id === this.selectedAppId);
  }
}