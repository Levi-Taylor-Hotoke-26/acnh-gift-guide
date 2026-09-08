import type { ClothingItem } from '../../../server/types/index';

interface ClothingCardProps {
  item: ClothingItem;
  onDelete?: (id: number) => void;
}

export const ClothingCard = ({ item, onDelete }: ClothingCardProps) => {
  return (
    <article className="clothing-card" aria-labelledby={`clothing-${item.id}-name`}>
      <header className="card-header">
        {item.icon_url ? (
          <img src={item.icon_url} alt="" className="clothing-icon" />
        ) : (
          <div className="clothing-avatar-placeholder" aria-hidden="true">
            👕
          </div>
        )}
        <h2 id={`clothing-${item.id}-name`}>{item.name}</h2>
      </header>

      <div className="card-body">
        <p className="clothing-category">
          <strong>Category:</strong> {item.category || 'General'}
        </p>

        <div className="tag-group">
          <span className="tag-label">Styles:</span>
          <div className="badges">
            {item.style_1 && <span className="badge badge-style">{item.style_1}</span>}
            {item.style_2 && <span className="badge badge-style">{item.style_2}</span>}
          </div>
        </div>

        <div className="tag-group">
          <span className="tag-label">Colors:</span>
          <div className="badges">
            {item.color_1 && <span className="badge badge-color">{item.color_1}</span>}
            {item.color_2 && <span className="badge badge-color">{item.color_2}</span>}
          </div>
        </div>
      </div>

      {onDelete && (
        <footer className="card-footer">
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="btn-danger"
            aria-label={`Delete ${item.name} from inventory`}
          >
            Delete
          </button>
        </footer>
      )}
    </article>
  );
};