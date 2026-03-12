export interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
  createdAt: string;
}

export interface UserRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  roles: string[];
}

export interface AuditLog {
  id: number;
  action: string;
  userId: number;
  username: string;
  timestamp: string;
}