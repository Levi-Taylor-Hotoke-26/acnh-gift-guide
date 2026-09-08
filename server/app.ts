import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import villagerRoutes from './routes/villagers';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/villagers', villagerRoutes);

export default app;