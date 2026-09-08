import { describe, it, expect } from 'vitest';
import { isVillagerSafeFromMoving, MoveOutCheckInput } from '../moveOut'

describe('Move-Out Safety Logic Engine', () => {
  it('should return true if villager was the last to move in', () => {
    const villager: MoveOutCheckInput = {
      is_last_moved_in: true,
      is_relocating: false,
      asked_last_to_move: false,
    };
    expect(isVillagerSafeFromMoving(villager)).toBe(true);
  });

  it('should return true if villager house is currently relocating', () => {
    const villager: MoveOutCheckInput = {
      is_last_moved_in: false,
      is_relocating: true,
      asked_last_to_move: false,
    };
    expect(isVillagerSafeFromMoving(villager)).toBe(true);
  });

  it('should return true if villager was the last one to ask to move', () => {
    const villager: MoveOutCheckInput = {
      is_last_moved_in: false,
      is_relocating: false,
      asked_last_to_move: true,
    };
    expect(isVillagerSafeFromMoving(villager)).toBe(true);
  });

  it('should return false if none of the safety flags are active', () => {
    const villager: MoveOutCheckInput = {
      is_last_moved_in: false,
      is_relocating: false,
      asked_last_to_move: false,
    };
    expect(isVillagerSafeFromMoving(villager)).toBe(false);
  });
});