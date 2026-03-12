import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../core/services/alert';
import { SupervisionService } from '../../core/services/supervision';
import { ServerService } from '../../core/services/server';
import { Alert, AlertRule, AlertRuleRequest } from '../../models/alert';
import { Server } from '../../models/server';

@Component({
  selector: 'app-alerts',
  imports: [CommonModule, FormsModule],
  templateUrl: './alerts.html',
  styleUrl: './alerts.css'
})
export class AlertsComponent implements OnInit {

  servers: Server[] = [];
  alerts: Alert[] = [];
  alertRules: AlertRule[] = [];
  selectedServerId: number | null = null;
  loadingAlerts = false;
  loadingRules = false;
  activeTab: 'alerts' | 'rules' = 'alerts';

  showRuleForm = false;
  editingRule: AlertRule | null = null;
  savingRule = false;
  errorMessage = '';

  ruleForm: AlertRuleRequest = this.emptyRuleForm();

  constructor(
    private alertService: AlertService,
    private supervisionService: SupervisionService,
    private serverService: ServerService
  ) {}

  ngOnInit(): void {
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
    this.loadAlerts(serverId);
    this.loadRules(serverId);
  }

  loadAlerts(serverId: number): void {
    this.loadingAlerts = true;
    this.supervisionService.getAlerts(serverId).subscribe({
      next: (alerts) => {
        this.alerts = alerts;
        this.loadingAlerts = false;
      },
      error: () => { this.loadingAlerts = false; }
    });
  }

  loadRules(serverId: number): void {
    this.loadingRules = true;
    this.alertService.getRulesForServer(serverId).subscribe({
      next: (rules) => {
        this.alertRules = rules;
        this.loadingRules = false;
      },
      error: () => { this.loadingRules = false; }
    });
  }

  resolveAlert(alertId: number): void {
    this.supervisionService.resolveAlert(alertId).subscribe({
      next: () => this.loadAlerts(this.selectedServerId!)
    });
  }

  openAddRule(): void {
  this.editingRule = null;
  this.ruleForm = this.emptyRuleForm();
  this.ruleForm.serverId = this.selectedServerId!;
  this.errorMessage = '';
  this.showRuleForm = true;
}

openEditRule(rule: AlertRule): void {
  this.editingRule = rule;
  this.ruleForm = {
    name: rule.name,
    type: rule.type,
    threshold: rule.threshold,
    level: rule.level,
    serverId: this.selectedServerId!,
    emailNotification: false,
    notificationEmail: ''
  };
  this.errorMessage = '';
  this.showRuleForm = true;
}

  saveRule(): void {
    this.savingRule = true;
    this.errorMessage = '';
    const request = this.editingRule
      ? this.alertService.updateRule(this.editingRule.id, this.ruleForm)
      : this.alertService.createRule(this.ruleForm);

    request.subscribe({
      next: () => {
        this.savingRule = false;
        this.showRuleForm = false;
        this.loadRules(this.selectedServerId!);
      },
      error: (err) => {
        this.savingRule = false;
        this.errorMessage = err.error?.message || 'Failed to save rule.';
      }
    });
  }

  deleteRule(ruleId: number): void {
    if (!confirm('Delete this alert rule?')) return;
    this.alertService.deleteRule(ruleId).subscribe({
      next: () => this.loadRules(this.selectedServerId!)
    });
  }

  toggleRule(rule: AlertRule): void {
    const action = rule.enabled
      ? this.alertService.disableRule(rule.id)
      : this.alertService.enableRule(rule.id);
    action.subscribe({
      next: () => this.loadRules(this.selectedServerId!)
    });
  }

  getSeverityClass(severity: string): string {
    switch (severity) {
      case 'CRITICAL': return 'severity-critical';
      case 'HIGH': return 'severity-high';
      case 'MEDIUM': return 'severity-medium';
      default: return 'severity-low';
    }
  }

  getAlertTypeClass(type: string): string {
    switch (type) {
      case 'CPU_HIGH': return 'type-cpu';
      case 'MEMORY_HIGH': return 'type-memory';
      case 'DISK_HIGH': return 'type-disk';
      default: return 'type-default';
    }
  }

  emptyRuleForm(): AlertRuleRequest {
  return {
    name: '',
    type: 'CPU_USAGE',
    threshold: 80,
    level: 'HIGH',
    serverId: 0,
    emailNotification: false,
    notificationEmail: ''
  };
}
}