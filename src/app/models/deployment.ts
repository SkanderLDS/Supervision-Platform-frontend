export interface DeploymentLog {
  id: number;
  action: string;
  status: string;
  message: string;
  performedAt: string;
  applicationId: number;
  applicationName: string;
  serverId: number;
  serverName: string;
}