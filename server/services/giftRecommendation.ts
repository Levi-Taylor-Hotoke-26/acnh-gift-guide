import type { Villager, ClothingItem } from '../types';

export interface GiftRecommendation {
  item: ClothingItem;
  score: number; // Max score of 4 (2 style points + 2 color points)
  matchingStyles: string[];
  matchingColors: string[];
}

/**
 * Calculates match score between a villager's preferences and a clothing item.
 * - +1 point for each matching style tag (max 2)
 * - +1 point for each matching color tag (max 2)
 */
export const calculateGiftScore = (
  villager: Partial<Villager>,
  item: ClothingItem
): GiftRecommendation => {
  const villagerStyles = [villager.style_1, villager.style_2]
    .filter(Boolean)
    .map((s) => s!.toLowerCase());

  const villagerColors = [villager.color_1, villager.color_2]
    .filter(Boolean)
    .map((c) => c!.toLowerCase());

  const itemStyles = [item.style_1, item.style_2].filter(Boolean);
  const itemColors = [item.color_1, item.color_2].filter(Boolean);

  const matchingStyles: string[] = [];
  const matchingColors: string[] = [];

  itemStyles.forEach((style) => {
    if (style && villagerStyles.includes(style.toLowerCase())) {
      matchingStyles.push(style);
    }
  });

  itemColors.forEach((color) => {
    if (color && villagerColors.includes(color.toLowerCase())) {
      matchingColors.push(color);
    }
  });

  const score = matchingStyles.length + matchingColors.length;

  return {
    item,
    score,
    matchingStyles,
    matchingColors,
  };
};

/**
 * Ranks clothing items for a given villager from best match to lowest.
 */
export const getBestGiftRecommendations = (
  villager: Partial<Villager>,
  inventory: ClothingItem[],
  limit = 3
): GiftRecommendation[] => {
  return inventory
    .map((item) => calculateGiftScore(villager, item))
    .filter((rec) => rec.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};