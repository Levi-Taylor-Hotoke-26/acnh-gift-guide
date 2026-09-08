import { useEffect, useState } from 'react';
import type { Villager } from '../../../server/types';
import { useAuth } from '../context/AuthContext';
import { VillagerCard } from '../components/VillagerCard';
import { AddVillagerModal } from '../components/AddVillagerModal';

export const Villagers = () => {
  const [villagers, setVillagers] = useState<Villager[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { token } = useAuth();

  useEffect(() => {
    const fetchVillagers = async () => {
      try {
        const response = await fetch('/api/villagers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to load island roster.');
        }

        const data: Villager[] = await response.json();
        setVillagers(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVillagers();
  }, [token]);

  const handleVillagerAdded = (newVillager: Villager) => {
    setVillagers((prev) => [...prev, newVillager]);
  };

  return (
    <main className="roster-page">
      <header className="page-header">
        <div>
          <h1>Island Resident Roster</h1>
          <p>Track friendship levels and move-out safety for your villagers.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
        >
          + Add Villager
        </button>
      </header>

      {isLoading && (
        <div role="status" className="loading-spinner">
          Loading roster...
        </div>
      )}

      {error && (
        <div role="alert" className="error-banner">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <>
          {villagers.length === 0 ? (
            <p className="empty-state">No villagers on your island yet. Add one to get started!</p>
          ) : (
            <div className="villager-grid">
              {villagers.map((villager) => (
                <VillagerCard key={villager.id} villager={villager} />
              ))}
            </div>
          )}
        </>
      )}

      <AddVillagerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onVillagerAdded={handleVillagerAdded}
      />
    </main>
  );
};