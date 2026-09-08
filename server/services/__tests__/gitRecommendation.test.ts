import { describe, it, expect } from 'vitest';
import { calculateGiftScore, getBestGiftRecommendations } from '../giftRecommendation';
import type { Villager, ClothingItem } from '../../types';

describe('Gift Recommendation Engine', () => {
  const mockVillager: Partial<Villager> = {
    name: 'Raymond',
    style_1: 'Elegant',
    style_2: 'Cool',
    color_1: 'Black',
    color_2: 'Grey',
  };

  const perfectItem: ClothingItem = {
    id: 1,
    name: 'Tweed Vest',
    style_1: 'Elegant',
    style_2: 'Cool',
    color_1: 'Black',
    color_2: 'Grey',
    category: '',
    user_id: 0,
    icon_url: ''
  };

  const partialItem: ClothingItem = {
    id: 2,
    name: 'Cute Dress',
    style_1: 'Cute',
    style_2: 'Elegant',
    color_1: 'Pink',
    color_2: 'Black',
    category: '',
    user_id: 0,
    icon_url: ''
  };

  const nonMatchingItem: ClothingItem = {
    id: 3,
    name: 'Sporty Tee',
    style_1: 'Active',
    style_2: 'Simple',
    color_1: 'Yellow',
    color_2: 'Red',
    category: '',
    user_id: 0,
    icon_url: ''
  };

  it('calculates a max score of 4 for a perfect style and color match', () => {
    const result = calculateGiftScore(mockVillager, perfectItem);
    expect(result.score).toBe(4);
    expect(result.matchingStyles).toEqual(['Elegant', 'Cool']);
    expect(result.matchingColors).toEqual(['Black', 'Grey']);
  });

  it('ranks items correctly and excludes 0-score items', () => {
    const inventory = [nonMatchingItem, partialItem, perfectItem];
    const recommendations = getBestGiftRecommendations(mockVillager, inventory);

    expect(recommendations).toHaveLength(2);
    expect(recommendations[0].item.name).toBe('Tweed Vest');
    expect(recommendations[1].item.name).toBe('Cute Dress');
  });
});