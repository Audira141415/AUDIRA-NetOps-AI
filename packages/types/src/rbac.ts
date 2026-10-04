// Enterprise Role-Based Access Control (RBAC) types

export type SystemRole =
  | 'SUPER_ADMIN'
  | 'NETWORK_ADMIN'
  | 'NETWORK_ENGINEER'
  | 'NOC_OPERATOR'
  | 'AI_OPERATOR'
  | 'AUDITOR'
  | 'VIEWER';

export type PermissionCode =
  | 'device.read'
  | 'device.write'
  | 'terminal.read'
  | 'terminal.write'
  | 'config.read'
  | 'config.write'
  | 'config.execute'
  | 'config.rollback'
  | 'ai.read'
  | 'ai.execute'
  | 'audit.read'
  | 'automation.execute';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles: SystemRole[];
  permissions: PermissionCode[];
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokenPayload {
  sub: string; // user id
  username: string;
  roles: SystemRole[];
  permissions: PermissionCode[];
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
