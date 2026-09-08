import type { Villager } from '../../../server/types';
import { isVillagerSafeFromMoving } from '../../../server/services/moveOut';

interface VillagerCardProps {
  villager: Villager;
}

export const VillagerCard = ({ villager }: VillagerCardProps) => {
  const isSafe = isVillagerSafeFromMoving(villager);

  return (
    <article className="villager-card" aria-labelledby={`villager-${villager.id}-name`}>
      <header className="card-header">
        {villager.icon_url ? (
          <img
            src={villager.icon_url}
            alt=""
            className="villager-icon"
          />
        ) : (
          <div className="villager-avatar-placeholder" aria-hidden="true">
            🍃
          </div>
        )}
        <h2 id={`villager-${villager.id}-name`}>{villager.name}</h2>
      </header>

      <div className="card-body">
        <p className="friendship-stat">
          <strong>Friendship Points:</strong> {villager.friendship_points} / 255
        </p>

        <div className="safety-status">
          <span className="status-label">Move-Out Status:</span>
          {isSafe ? (
            <span className="badge badge-safe" aria-label="Safe from moving out">
              🛡️ Safe
            </span>
          ) : (
            <span className="badge badge-vulnerable" aria-label="At risk of asking to move">
              ⚠️ Could Ask to Move
            </span>
          )}
        </div>

        <ul className="villager-flags" role="list">
          <li>
            <span>Last Moved In:</span> {villager.is_last_moved_in ? 'Yes' : 'No'}
          </li>
          <li>
            <span>Relocating House:</span> {villager.is_relocating ? 'Yes' : 'No'}
          </li>
          <li>
            <span>Asked Last to Move:</span> {villager.asked_last_to_move ? 'Yes' : 'No'}
          </li>
        </ul>
      </div>
    </article>
  );
};