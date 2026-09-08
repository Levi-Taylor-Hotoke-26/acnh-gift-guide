import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../app';
import db from '../../db/connection';

const JWT_SECRET = process.env.JWT_SECRET || 'acnh_secret_key';

describe('Clothing Inventory Routes (/api/clothing)', () => {
  let token: string;
  let userId: number;

  beforeAll(async () => {
    await db.migrate.latest();
  });

  beforeEach(async () => {
    await db('clothing_inventory').truncate();
    await db('users').truncate();

    const [id] = await db('users').insert({
      username: 'AbleSisters',
      password_hash: 'hashedpassword',
    });
    userId = id;
    token = jwt.sign({ id: userId, username: 'AbleSisters' }, JWT_SECRET);
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('GET /api/clothing should return 401 if unauthenticated', async () => {
    const res = await request(app).get('/api/clothing');
    expect(res.status).toBe(401);
  });

  it('GET /api/clothing should return items belonging to the user', async () => {
    await db('clothing_inventory').insert({
      user_id: userId,
      name: 'Nook Inc. Tee',
      color_1: 'Green',
      style_1: 'Simple',
    });

    const res = await request(app)
      .get('/api/clothing')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Nook Inc. Tee');
  });

  it('POST /api/clothing should save a new clothing item', async () => {
    const res = await request(app)
      .post('/api/clothing')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Aran-Knit Sweater',
        color_1: 'Red',
        color_2: 'White',
        style_1: 'Gorgeous',
        style_2: 'Elegant',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Aran-Knit Sweater');
  });
});