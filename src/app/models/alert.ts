export interface Alert {
  id: number;
  message: string;
  level: string;
  resolved: boolean;
  createdAt: string;
  resolvedAt: string;
  serverId: number;
  serverName: string;
  applicationId: number;
  applicationName: string;
}

export interface AlertRule {
  id: number;
  name: string;
  type: string;
  threshold: number;
  level: string;
  enabled: boolean;
  createdAt: string;
  serverId: number;
  serverName: string;
}

export interface AlertRuleRequest {
  name: string;
  type: string;
  threshold: number;
  level: string;
  serverId: number;
  emailNotification: boolean;
  notificationEmail: string;
}