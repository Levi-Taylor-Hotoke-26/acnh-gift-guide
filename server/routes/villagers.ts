import { Router, Response } from 'express';
import db from '../db/connection';
import { authenticateToken } from '../middleware/auth';
import { AuthenticatedRequest, Villager } from '../types';

const router = Router();

// Auth middleware for all villager routes
router.use(authenticateToken);

// GET /api/villagers - Get villagers
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const villagers = await db<Villager>('villagers').where({
      user_id: req.user?.id,
    });
    res.json(villagers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch villagers' });
  }
});

// POST /api/villagers - Add new villager
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  const {
    name,
    friendship_points,
    is_on_island,
    is_last_moved_in,
    is_relocating,
    asked_last_to_move,
    icon_url
  } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Villager name is required' });
  }

  try {
    const [id] = await db<Villager>('villagers').insert({
      user_id: req.user?.id,
      name,
      friendship_points: friendship_points ?? 25,
      is_on_island: is_on_island !== undefined ? Boolean(is_on_island) : true,
      is_last_moved_in: Boolean(is_last_moved_in),
      is_relocating: Boolean(is_relocating),
      asked_last_to_move: Boolean(asked_last_to_move),
      icon_url: icon_url || null,
    });

    const newVillager = await db<Villager>('villagers').where({ id }).first();
    res.status(201).json(newVillager);
  } catch (err) {
    console.error('Error inserting villager:', err);
    res.status(500).json({ message: 'Failed to add villager' });
  }
});

export default router;