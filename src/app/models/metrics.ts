export interface ServerMetrics {
  id: number;
  serverId: number;
  serverName: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  collectedAt: string;
}