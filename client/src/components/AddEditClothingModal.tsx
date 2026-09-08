import { useState, useEffect } from 'react';
import type { SyntheticEvent } from 'react';
import type { ClothingItem } from '../../../server/types';
import { useAuth } from '../context/AuthContext';

interface AddEditClothingModalProps {
  isOpen: boolean;
  itemToEdit?: ClothingItem | null;
  onClose: () => void;
  onItemSaved: (savedItem: ClothingItem) => void;
}

const STYLES = ['Cute', 'Cool', 'Elegant', 'Gorgeous', 'Active', 'Simple'];
const COLORS = ['Red', 'Pink', 'Orange', 'Yellow', 'Green', 'Cyan', 'Blue', 'Purple', 'White', 'Black', 'Brown', 'Beige'];

export const AddEditClothingModal = ({
  isOpen,
  itemToEdit,
  onClose,
  onItemSaved,
}: AddEditClothingModalProps) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Tops');
  const [style1, setStyle1] = useState('');
  const [style2, setStyle2] = useState('');
  const [color1, setColor1] = useState('');
  const [color2, setColor2] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { token } = useAuth();
  const isEditing = Boolean(itemToEdit);

  // Populate state when editing, or reset when opening fresh
  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name || '');
      setCategory(itemToEdit.category || 'Tops');
      setStyle1(itemToEdit.style_1 || '');
      setStyle2(itemToEdit.style_2 || '');
      setColor1(itemToEdit.color_1 || '');
      setColor2(itemToEdit.color_2 || '');
    } else {
      setName('');
      setCategory('Tops');
      setStyle1('');
      setStyle2('');
      setColor1('');
      setColor2('');
    }
    setError(null);
  }, [itemToEdit, isOpen]);

  // Keyboard accessibility: Close on Escape key press
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
      setError('Item name is required.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: name.trim(),
      category,
      style_1: style1 || null,
      style_2: style2 || null,
      color_1: color1 || null,
      color_2: color2 || null,
    };

    try {
      const endpoint = isEditing ? `/api/clothing/${itemToEdit?.id}` : '/api/clothing';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save clothing item.');
      }

      onItemSaved(data);
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
        aria-labelledby="clothing-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h2 id="clothing-modal-title">
            {isEditing ? 'Edit Closet Item' : 'Add New Apparel Item'}
          </h2>
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
          <div id="clothing-form-error" role="alert" className="error-banner">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="modal-form">
          <div className="form-group">
            <label htmlFor="clothing-name">Item Name *</label>
            <input
              id="clothing-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-required="true"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'clothing-form-error' : undefined}
              disabled={isSubmitting}
              placeholder="e.g. Tweed Vest, Argyle Sweater"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="clothing-category">Category</label>
            <select
              id="clothing-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="Tops">Tops</option>
              <option value="Bottoms">Bottoms</option>
              <option value="Dress-Up">Dress-Up</option>
              <option value="Headwear">Headwear</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="clothing-style-1">Primary Style</label>
              <select
                id="clothing-style-1"
                value={style1}
                onChange={(e) => setStyle1(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="">None</option>
                {STYLES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="clothing-style-2">Secondary Style</label>
              <select
                id="clothing-style-2"
                value={style2}
                onChange={(e) => setStyle2(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="">None</option>
                {STYLES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="clothing-color-1">Primary Color</label>
              <select
                id="clothing-color-1"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="">None</option>
                {COLORS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="clothing-color-2">Secondary Color</label>
              <select
                id="clothing-color-2"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="">None</option>
                {COLORS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

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
              {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Item'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};