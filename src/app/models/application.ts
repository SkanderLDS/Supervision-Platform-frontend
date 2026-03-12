export interface Application {
  id: number;
  name: string;
  currentVersion: string;
  runtimeName: string;
  artifactName: string;
  type: string;
  contextPath: string;
  status: string;
  lastDeployedAt: string;
  createdAt: string;
  server: ServerSummary;
}

export interface ServerSummary {
  id: number;
  name: string;
  type: string;
  status: string;
}

export interface ApplicationRequest {
  name: string;
  currentVersion: string;
  runtimeName: string;
  artifactName: string;
  type: string;
  contextPath: string;
  serverId: number;
}

export interface ApplicationVersion {
  id: number;
  version: string;
  type: string;
  status: string;
  artifactPath: string;
  applicationId: number;
  applicationName: string;
  deployedAt: string;
  createdAt: string;
}