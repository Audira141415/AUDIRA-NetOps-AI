// Role-Based Access Control (RBAC) Guard & Hierarchy

import { PermissionCode, SystemRole, User } from '@audira/types';

// Default permissions map per role
export const ROLE_PERMISSIONS_MAP: Record<SystemRole, PermissionCode[]> = {
  SUPER_ADMIN: [
    'device.read',
    'device.write',
    'terminal.read',
    'terminal.write',
    'config.read',
    'config.write',
    'config.execute',
    'config.rollback',
    'ai.read',
    'ai.execute',
    'audit.read',
    'automation.execute',
  ],
  NETWORK_ADMIN: [
    'device.read',
    'device.write',
    'terminal.read',
    'terminal.write',
    'config.read',
    'config.write',
    'config.execute',
    'config.rollback',
    'ai.read',
    'ai.execute',
    'audit.read',
    'automation.execute',
  ],
  NETWORK_ENGINEER: [
    'device.read',
    'terminal.read',
    'terminal.write',
    'config.read',
    'config.write',
    'config.execute',
    'config.rollback',
    'ai.read',
    'ai.execute',
    'audit.read',
  ],
  NOC_OPERATOR: [
    'device.read',
    'terminal.read',
    'config.read',
    'ai.read',
    'audit.read',
  ],
  AI_OPERATOR: [
    'device.read',
    'config.read',
    'ai.read',
    'ai.execute',
  ],
  AUDITOR: [
    'device.read',
    'config.read',
    'audit.read',
  ],
  VIEWER: [
    'device.read',
    'config.read',
    'ai.read',
  ],
};

/**
 * Checks if a user has a specific permission.
 */
export function hasPermission(user: User, requiredPermission: PermissionCode): boolean {
  if (!user || !user.isActive) return false;

  // Check user's direct permissions
  if (user.permissions?.includes(requiredPermission)) {
    return true;
  }

  // Check permissions granted via roles
  for (const role of user.roles) {
    const rolePerms = ROLE_PERMISSIONS_MAP[role] || [];
    if (rolePerms.includes(requiredPermission)) {
      return true;
    }
  }

  return false;
}

/**
 * Asserts permission, throwing an error if unauthorized.
 */
export function assertPermission(user: User, requiredPermission: PermissionCode): void {
  if (!hasPermission(user, requiredPermission)) {
    throw new Error(`Permission denied: '${requiredPermission}' is required for this operation.`);
  }
}
