import { Router, Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwtSign from 'jsonwebtoken';
import db from '../db/connection';
import { User } from '../types';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'acnh_secret_key';

// Register POST Route
router.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if(!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const [userId] = await db<User>('users').insert({ username, password_hash });

    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (err) {
    res.status(400).json({ message: 'Username already taken'});
  }
});

// Login POST Route
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await db<User>('users').where({ username }).first();

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwtSign.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ token, username: user.username, userId: user.id });
});

export default router;