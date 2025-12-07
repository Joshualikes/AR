import { PlantIdentificationResult } from "./plant-identifier";

export interface SavedPlant {
  id: string;
  name: string;
  scientificName: string;
  image: string; // base64 image data
  confidence: number;
  category?: 'plant' | 'mushroom' | 'weed' | 'disease';
  savedAt: string; // ISO date string
  description?: string;
  careGuide?: {
    water: string;
    sunlight: string;
    temperature: string;
    soil: string;
  };
  poisonous?: boolean;
  commonNames?: string[];
}

const STORAGE_KEY = 'saved_plants';

/**
 * Get all saved plants from localStorage
 */
export function getSavedPlants(): SavedPlant[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading saved plants:', error);
    return [];
  }
}

/**
 * Save a plant to the garden
 */
export function savePlant(
  result: PlantIdentificationResult,
  imageData: string
): SavedPlant {
  const savedPlant: SavedPlant = {
    id: `plant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: result.name,
    scientificName: result.scientificName,
    image: imageData,
    confidence: result.confidence,
    category: result.category || 'plant',
    savedAt: new Date().toISOString(),
    description: result.description,
    careGuide: result.careGuide,
    poisonous: result.poisonous,
    commonNames: result.commonNames,
  };

  const plants = getSavedPlants();
  plants.unshift(savedPlant); // Add to beginning
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));

  return savedPlant;
}

/**
 * Remove a plant from the garden
 */
export function removePlant(plantId: string): boolean {
  try {
    const plants = getSavedPlants();
    const filtered = plants.filter(p => p.id !== plantId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error removing plant:', error);
    return false;
  }
}

/**
 * Check if a plant is already saved (by name and scientific name)
 */
export function isPlantSaved(name: string, scientificName: string): boolean {
  const plants = getSavedPlants();
  return plants.some(
    p => p.name === name && p.scientificName === scientificName
  );
}

/**
 * Get plant count
 */
export function getPlantCount(): number {
  return getSavedPlants().length;
}

