export interface User {
  id: number;
  username: string;
  password_hash: string;
  created_at?: string;
  updated_at?: string;
}

export interface Villager {
  id: number;
  user_id: number;
  name: string;
  friendship_points: number; // All villagers starts with 25 friendship points
  is_on_island: boolean;
  is_last_moved_in: boolean;
  is_relocating: boolean;
  asked_last_to_move: boolean;
  icon_url: string;
}

export interface ClothingItem {
  id: number;
  user_id: number;
  name: string;
  color_1: string;
  color_2: string;
  style_1: string;
  style_2?: string;
  icon_url: string;
}

// Helper interface for Auth Payload stored inside JWTs
export interface AuthTokenPayload {
  id: number;
  username: string;
}

// Request extension type to attach decoded user payload to Express requests
import type { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}