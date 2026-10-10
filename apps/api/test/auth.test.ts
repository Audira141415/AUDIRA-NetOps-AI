import { describe, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';
import { authenticateJwt, requirePermission, AuthenticatedRequest } from '../src/middleware/auth.middleware.js';
import { AuthTokenPayload } from '@audira/types';

const TEST_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_at_least_32_characters_long_audira';

describe('Auth Middleware', () => {
  it('should reject requests without Authorization header', () => {
    let responseStatus = 0;
    let responseBody: any = null;

    const req = { headers: {} } as AuthenticatedRequest;
    const res = {
      status: (s: number) => {
        responseStatus = s;
        return {
          json: (b: any) => {
            responseBody = b;
          },
        };
      },
    } as any;

    let nextCalled = false;
    authenticateJwt(req, res, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(false);
    expect(responseStatus).toBe(401);
    expect(responseBody.code).toBe('AUTH_FAILED');
  });

  it('should accept valid JWT bearer tokens and populate req.user', () => {
    const payload: AuthTokenPayload = {
      sub: 'test-user-uuid',
      username: 'noc_admin',
      roles: ['NETWORK_ADMIN'],
      permissions: ['device.read', 'device.write'],
    };
    const token = jwt.sign(payload, TEST_SECRET, { expiresIn: '1h' });

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as AuthenticatedRequest;

    const res = {} as any;
    let nextCalled = false;

    authenticateJwt(req, res, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(true);
    expect(req.user?.username).toBe('noc_admin');
    expect(req.user?.roles).toContain('NETWORK_ADMIN');
  });

  it('should enforce RBAC permissions correctly', () => {
    const req = {
      user: {
        sub: '1',
        username: 'viewer',
        roles: ['VIEWER'],
        permissions: ['device.read'],
      },
    } as AuthenticatedRequest;

    let responseStatus = 0;
    const res = {
      status: (s: number) => {
        responseStatus = s;
        return { json: () => {} };
      },
    } as any;

    let nextCalled = false;
    // VIEWER does not have config.write permission
    const guard = requirePermission('config.write');
    guard(req, res, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(false);
    expect(responseStatus).toBe(403);
  });
});
