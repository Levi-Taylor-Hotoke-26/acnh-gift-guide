import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../app';
import db from '../../db/connection';

const JWT_SECRET = process.env.JWT_SECRET || 'acnh_secret_key';

describe('Villager Routes (/api/villagers)', () => {
  let token: string;
  let userId: number;

  beforeAll(async () => {
    await db.migrate.latest();
  });

  beforeEach(async () => {
    await db('villagers').truncate();
    await db('users').truncate();

    const [id] = await db('users').insert({
      username: 'Isabelle',
      password_hash: 'hashedpassword',
    });
    userId = id;
    token = jwt.sign({ id: userId, username: 'Isabelle' }, JWT_SECRET);
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('GET /api/villagers should return 401 if no token provided', async () => {
    const res = await request(app).get('/api/villagers');
    expect(res.status).toBe(401);
  });

  it('GET /api/villagers should return user villagers when authenticated', async () => {
    await db('villagers').insert({
      user_id: userId,
      name: 'Marshal',
      friendship_points: 25,
      is_on_island: true,
    });

    const res = await request(app)
      .get('/api/villagers')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Marshal');
  });

  it('POST /api/villagers should add a new villager for the user', async () => {
    const res = await request(app)
      .post('/api/villagers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Raymond',
        friendship_points: 30,
        is_on_island: true,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Raymond')
  });
});