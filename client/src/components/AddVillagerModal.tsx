import { useState, useEffect } from 'react';
import type { SyntheticEvent } from 'react';
import type { Villager } from '../../../server/types';
import { useAuth } from '../context/AuthContext';

interface AddVillagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVillagerAdded: (newVillager: Villager) => void;
}

export const AddVillagerModal = ({
  isOpen,
  onClose,
  onVillagerAdded,
}: AddVillagerModalProps) => {
  const [name, setName] = useState('');
  const [friendshipPoints, setFriendshipPoints] = useState(25);
  const [isLastMovedIn, setIsLastMovedIn] = useState(false);
  const [isRelocating, setIsRelocating] = useState(false);
  const [askedLastToMove, setAskedLastToMove] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { token } = useAuth();

  // Close modal on Escape key press (WCAG 2.1 requirement)
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Villager name is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/villagers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          friendship_points: Number(friendshipPoints),
          is_last_moved_in: isLastMovedIn,
          is_relocating: isRelocating,
          asked_last_to_move: askedLastToMove,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add villager.');
      }

      onVillagerAdded(data);
      // Reset form
      setName('');
      setFriendshipPoints(25);
      setIsLastMovedIn(false);
      setIsRelocating(false);
      setAskedLastToMove(false);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h2 id="modal-title">Welcome a New Villager</h2>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </header>

        {error && (
          <div id="add-villager-error" role="alert" className="error-banner">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="modal-form">
          <div className="form-group">
            <label htmlFor="villager-name">Villager Name *</label>
            <input
              id="villager-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-required="true"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'add-villager-error' : undefined}
              disabled={isSubmitting}
              placeholder="e.g. Raymond, Isabelle, Marshall"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="friendship-points">
              Starting Friendship Points (0 - 255)
            </label>
            <input
              id="friendship-points"
              type="number"
              min="0"
              max="255"
              value={friendshipPoints}
              onChange={(e) => setFriendshipPoints(Number(e.target.value))}
              disabled={isSubmitting}
            />
          </div>

          <fieldset className="form-fieldset">
            <legend>Move-Out Safety Flags</legend>

            <div className="checkbox-group">
              <input
                id="last-moved-in"
                type="checkbox"
                checked={isLastMovedIn}
                onChange={(e) => setIsLastMovedIn(e.target.checked)}
                disabled={isSubmitting}
              />
              <label htmlFor="last-moved-in">
                Last villager who moved to the island
              </label>
            </div>

            <div className="checkbox-group">
              <input
                id="is-relocating"
                type="checkbox"
                checked={isRelocating}
                onChange={(e) => setIsRelocating(e.target.checked)}
                disabled={isSubmitting}
              />
              <label htmlFor="is-relocating">
                House is currently being relocated
              </label>
            </div>

            <div className="checkbox-group">
              <input
                id="asked-last"
                type="checkbox"
                checked={askedLastToMove}
                onChange={(e) => setAskedLastToMove(e.target.checked)}
                disabled={isSubmitting}
              />
              <label htmlFor="asked-last">
                Last villager who asked to move
              </label>
            </div>
          </fieldset>

          <footer className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? 'Adding...' : 'Add Villager'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};