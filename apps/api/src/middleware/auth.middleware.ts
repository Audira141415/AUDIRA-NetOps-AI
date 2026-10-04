// Authentication & RBAC Middleware

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthTokenPayload, PermissionCode } from '@audira/types';
import { ROLE_PERMISSIONS_MAP } from '@audira/security';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_at_least_32_characters_long_audira';

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

export function authenticateJwt(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      code: 'AUTH_FAILED',
      message: 'Missing or malformed Authorization header with Bearer token',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ success: false, code: 'AUTH_FAILED', message: 'Token missing' });
    return;
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as unknown as AuthTokenPayload;
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      code: 'AUTH_FAILED',
      message: 'Invalid or expired access token',
      timestamp: new Date().toISOString(),
    });
  }
}

export function requirePermission(permission: PermissionCode) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, code: 'AUTH_FAILED', message: 'Authentication required' });
      return;
    }

    // Check direct or role-inherited permissions
    const userPerms = new Set(user.permissions || []);
    for (const role of user.roles || []) {
      const perms = ROLE_PERMISSIONS_MAP[role] || [];
      perms.forEach(p => userPerms.add(p));
    }

    if (!userPerms.has(permission)) {
      res.status(403).json({
        success: false,
        code: 'PERMISSION_DENIED',
        message: `Forbidden: '${permission}' permission is required.`,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    next();
  };
}
