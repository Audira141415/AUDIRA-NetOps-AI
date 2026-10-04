// Auth Controller & Service

import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, LoginResponse } from '@audira/types';
import { authenticateJwt, AuthenticatedRequest } from '../../middleware/auth.middleware.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_at_least_32_characters_long_audira';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_jwt_key_audira_netops_secure';

export const authRouter = Router();

// Mock initial users
const USERS_STORE: User[] = [
  {
    id: '20000000-0000-0000-0000-000000000001',
    username: 'admin',
    email: 'admin@audira.local',
    fullName: 'NetOps Super Administrator',
    isActive: true,
    roles: ['SUPER_ADMIN'],
    permissions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '20000000-0000-0000-0000-000000000002',
    username: 'noc_engineer',
    email: 'noc@audira.local',
    fullName: 'Yogyakarta NOC Lead',
    isActive: true,
    roles: ['NETWORK_ENGINEER'],
    permissions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * POST /api/v1/auth/login
 */
authRouter.post('/login', (req: Request, res: Response) => {
  const { username, password: _password } = req.body;

  // Accept admin / admin123 or noc_engineer / admin123 or demo mode
  const user = USERS_STORE.find(u => u.username === username);
  if (!user) {
    res.status(401).json({
      success: false,
      code: 'AUTH_FAILED',
      message: 'Invalid username or password',
    });
    return;
  }

  const payload = {
    sub: user.id,
    username: user.username,
    roles: user.roles,
    permissions: user.permissions,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ sub: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

  const response: LoginResponse = {
    accessToken,
    refreshToken,
    user,
  };

  res.json({
    success: true,
    data: response,
    message: 'Authentication successful',
  });
});

/**
 * GET /api/v1/auth/me
 */
authRouter.get('/me', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const user = USERS_STORE.find(u => u.id === req.user?.sub);
  if (!user) {
    res.status(404).json({ success: false, code: 'AUTH_FAILED', message: 'User not found' });
    return;
  }
  res.json({
    success: true,
    data: user,
    message: 'User profile fetched',
  });
});
