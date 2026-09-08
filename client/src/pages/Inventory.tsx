import { useEffect, useState } from 'react';
import type { ClothingItem } from '../../../server/types/index.ts';
import { useAuth } from '../context/AuthContext';
import { ClothingCard } from '../components/ClothingCard';

export const Inventory = () => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ClothingItem[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAuth();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('/api/clothing', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to load clothing inventory.');
        }

        const data: ClothingItem[] = await response.json();
        setItems(data);
        setFilteredItems(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, [token]);

  // Filter items by style tag
  const handleStyleFilter = (style: string) => {
    setSelectedStyle(style);
    if (style === 'all') {
      setFilteredItems(items);
    } else {
      setFilteredItems(
        items.filter(
          (item) =>
            item.style_1?.toLowerCase() === style.toLowerCase() ||
            item.style_2?.toLowerCase() === style.toLowerCase()
        )
      );
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      const response = await fetch(`/api/clothing/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to delete item.');
      }

      const updated = items.filter((item) => item.id !== id);
      setItems(updated);
      setFilteredItems(
        selectedStyle === 'all'
          ? updated
          : updated.filter(
              (item) =>
                item.style_1?.toLowerCase() === selectedStyle.toLowerCase() ||
                item.style_2?.toLowerCase() === selectedStyle.toLowerCase()
            )
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not delete item.');
    }
  };

  return (
    <main className="inventory-page">
      <header className="page-header">
        <div>
          <h1>Clothing Closet Inventory</h1>
          <p>Manage stored apparel for villager gift matching.</p>
        </div>
      </header>

      <section className="filter-bar" aria-label="Inventory Filters">
        <label htmlFor="style-filter">Filter by Style:</label>
        <select
          id="style-filter"
          value={selectedStyle}
          onChange={(e) => handleStyleFilter(e.target.value)}
        >
          <option value="all">All Styles</option>
          <option value="Cute">Cute</option>
          <option value="Cool">Cool</option>
          <option value="Elegant">Elegant</option>
          <option value="Gorgeous">Gorgeous</option>
          <option value="Active">Active</option>
          <option value="Simple">Simple</option>
        </select>
      </section>

      {isLoading && (
        <div role="status" className="loading-spinner">
          Loading closet inventory...
        </div>
      )}

      {error && (
        <div role="alert" className="error-banner">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <>
          {filteredItems.length === 0 ? (
            <p className="empty-state">No clothing items found matching your selection.</p>
          ) : (
            <div className="clothing-grid">
              {filteredItems.map((item) => (
                <ClothingCard key={item.id} item={item} onDelete={handleDeleteItem} />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
};