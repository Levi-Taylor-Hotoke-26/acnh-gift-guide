import type { Villager, ClothingItem } from '../../../server/types';
import { isVillagerSafeFromMoving } from '../../../server/services/moveOut';
import { getBestGiftRecommendations } from '../../../server/services/giftRecommendation';

interface VillagerCardProps {
  villager: Villager;
  inventory?: ClothingItem[];
}

export const VillagerCard = ({ villager, inventory = [] }: VillagerCardProps) => {
  const isSafe = isVillagerSafeFromMoving(villager);
  const giftRecommendations = getBestGiftRecommendations(villager, inventory, 2);

  return (
    <article className="villager-card" aria-labelledby={`villager-${villager.id}-name`}>
      <header className="card-header">
        {villager.icon_url ? (
          <img src={villager.icon_url} alt="" className="villager-icon" />
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

        <section className="gift-recommendations" aria-label="Recommended Gifts from Closet">
          <h3 className="gift-heading">🎁 Recommended Closet Gifts:</h3>
          {giftRecommendations.length === 0 ? (
            <p className="no-gifts-text">No matching closet items found.</p>
          ) : (
            <ul className="gift-list" role="list">
              {giftRecommendations.map((rec) => (
                <li key={rec.item.id} className="gift-item">
                  <span className="gift-name">{rec.item.name}</span>
                  <span className="gift-score" aria-label={`Match score ${rec.score} out of 4`}>
                    ⭐ {rec.score}/4 Match
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </article>
  );
};