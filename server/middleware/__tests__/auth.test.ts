import { describe, it, expect, vi } from 'vitest';
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../auth';
import { AuthenticatedRequest } from '../../types';
import request from 'supertest';

const JWT_SECRET = process.env.JWT_SECRET || 'acnh_secret_key';

describe('Auth Middleware (authenticateToken)', () => {
  it('should return 401 is no authorization header is provided', () => {
    const req = { headers: {} } as AuthenticatedRequest;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Access token required' });
  });

  it('should return 403 if token is invalid', () => {
    const req = {
      headers: { authorization: 'Bearer invalid_token_xyz' }
    } as AuthenticatedRequest;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next() and attach user payload if valid JWT provided', () => {
    const payload = { id: 1, username: 'TomNook' };
    const validToken = jwt.sign(payload, JWT_SECRET);

    const req = {
      headers: { authorization: `Bearer ${validToken}` },
    } as AuthenticatedRequest;
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    authenticateToken(req, res, next);

    expect(req.user).toBeDefined();
    expect(req.user?.username).toBe('TomNook');
    expect(next).toHaveBeenCalled();
  })
})