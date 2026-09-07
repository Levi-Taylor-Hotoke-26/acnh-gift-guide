import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import db from '../connection'

describe('Database Schema', () => {
  beforeAll(async () => {
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('should have user, villagers, and clothing_inventory tables', async () => {
    const hasUsers = await db.schema.hasTable('users');
    const hasVillagers = await db.schema.hasTable('villagers');
    const hasClothing = await db.schema.hasTable('clothing_inventory');

    expect(hasUsers).toBe(true);
    expect(hasVillagers).toBe(true);
    expect(hasClothing).toBe(true);
  });
});