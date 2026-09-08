import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../app';
import db from '../../db/connection';

describe('Auth Routes (/api/auth)', () => {
  beforeAll(async () => {
    await db.migrate.latest();
  });

  beforeEach(async () => {
    await db('users').truncate();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('POST /api/auth/register should create a user and return 201', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'Isabelle', password: 'bellpassword123' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
    expect(res.body).toHaveProperty('userId');
  });

  it('POST /api/auth/login should return a signed JWT token on valid credentials', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'TomNook', password: 'bellpassword' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'TomNook', password: 'bellpassword' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});