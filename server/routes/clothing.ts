import { Router, Response } from 'express';
import db from '../db/connection';
import { authenticateToken } from '../middleware/auth';
import { AuthenticatedRequest, ClothingItem } from '../types';

const router = Router();

// Auth middleware for clothing routes
router.use(authenticateToken);

// GET /api/clothing - Get all clothing items for logged-in user
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const items = await db<ClothingItem>('clothing_inventory').where({
      user_id: req.user?.id,
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch clothing inventory' });
  }
});

// POST /api/clothing - Add new clothing item to user inventory
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  const { name, color_1, color_2, style_1, style_2, icon_url } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Clothing item name is required' });
  }

  try {
    const [id] = await db<ClothingItem>('clothing_inventory').insert({
      user_id: req.user?.id,
      name,
      color_1: color_1 || null,
      color_2: color_2 || null,
      style_1: style_1 || null,
      style_2: style_2 || null,
      icon_url: icon_url || null,
    });

    const newItem = await db<ClothingItem>('clothing_inventory').where({ id }).first();
    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error inserting clothing item:', err);
    res.status(500).json({ message: 'Failed to add clothing item' });
  }
});

export default router;