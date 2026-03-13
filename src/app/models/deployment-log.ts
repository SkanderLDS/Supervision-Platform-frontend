export interface DeploymentLog {
  id: number;
  action: string;
  status: string;
  version: string;
  message: string;
  level: string;
  timestamp: string;
  applicationId: number;
  applicationName: string;
  isRollback: boolean;
}