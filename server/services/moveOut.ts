export interface MoveOutCheckInput {
  is_last_moved_in: boolean;
  is_relocating: boolean;
  asked_last_to_move: boolean;
}

export function isVillagerSafeFromMoving(villager: MoveOutCheckInput): boolean {
  return (
    Boolean(villager.is_last_moved_in) ||
    Boolean(villager.is_relocating) ||
    Boolean(villager.asked_last_to_move)
  );
}