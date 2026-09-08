import { useEffect, useState } from 'react';
import type { Villager, ClothingItem } from '../../../server/types';
import { useAuth } from '../context/AuthContext';
import { VillagerCard } from '../components/VillagerCard';

export const Villagers = () => {
  const [villagers, setVillagers] = useState<Villager[]>([]);
  const [inventory, setInventory] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [villagersRes, inventoryRes] = await Promise.all([
          fetch('/api/villagers', { headers }),
          fetch('/api/clothing', { headers }),
        ]);

        if (!villagersRes.ok || !inventoryRes.ok) {
          throw new Error('Failed to load island data.');
        }

        const villagersData: Villager[] = await villagersRes.json();
        const inventoryData: ClothingItem[] = await inventoryRes.json();

        setVillagers(villagersData);
        setInventory(inventoryData);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <main className="roster-page">
      <header className="page-header">
        <h1>Island Resident Roster</h1>
        <p>Track friendship levels, move-out safety, and gift recommendations.</p>
      </header>

      {isLoading && <div role="status" className="loading-spinner">Loading island data...</div>}
      {error && <div role="alert" className="error-banner">{error}</div>}

      {!isLoading && !error && (
        <div className="villager-grid">
          {villagers.map((v) => (
            <VillagerCard key={v.id} villager={v} inventory={inventory} />
          ))}
        </div>
      )}
    </main>
  );
};