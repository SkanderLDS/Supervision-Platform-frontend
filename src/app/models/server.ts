export interface Server {
  id: number;
  name: string;
  host: string;
  sshPort: number;
  sshUsername: string;
  type: string;
  environment: string;
  status: string;
  serverHomePath: string;
  managementPort: number;
  lastCheckedAt: string;
  createdAt: string;
  active: boolean;
}

export interface ServerRequest {
  name: string;
  host: string;
  sshPort: number;
  sshUsername: string;
  sshPassword: string;
  port: number;
  type: string;
  version: string;
  environment: string;
  serverHomePath: string;
  managementPort: number;
  managementUsername: string;
  managementPassword: string;
}