export type PlantType = "pechay" | "kamatis" | "okra" | "basil" | "lettuce";

export type GrowthStage = "seed" | "sprout" | "small" | "growing" | "mature";

export interface Plant {
  id: string;
  type: PlantType;
  name: string;
  stage: GrowthStage;
  daysGrowing: number;
  lastWatered: Date;
  sunlightLevel: number;
  healthScore: number;
}

export interface PlantInfo {
  type: PlantType;
  name: string;
  nameTagalog: string;
  description: string;
  sunlightNeeded: "low" | "medium" | "high";
  waterFrequency: string;
  daysToMature: number;
  funFact: string;
  emoji: string;
  color: string;
}

export interface UserProgress {
  level: number;
  stars: number;
  badges: string[];
  streak: number;
  plantsGrown: number;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  stars: number;
}
