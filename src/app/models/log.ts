export interface AppLog {
  id: number;
  level: string;
  message: string;
  category: string;
  threadName: string;
  timestamp: string;
  collectedAt: string;
  serverId: number;
  serverName: string;
}

export interface LogPage {
  content: AppLog[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}