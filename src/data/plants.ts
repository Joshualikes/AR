import { PlantInfo } from "@/types/plant";

export const PLANT_DATA: PlantInfo[] = [
  {
    type: "pechay",
    name: "Pechay",
    nameTagalog: "Petsay",
    description: "A leafy green vegetable that grows quickly and is perfect for soups and stir-fry!",
    sunlightNeeded: "medium",
    waterFrequency: "Daily",
    daysToMature: 30,
    funFact: "Pechay is rich in vitamins A and C, making it super healthy!",
    emoji: "🥬",
    color: "hsl(120 60% 50%)",
  },
  {
    type: "kamatis",
    name: "Tomato",
    nameTagalog: "Kamatis",
    description: "A juicy red fruit (yes, it's a fruit!) that loves sunshine and tastes great in everything!",
    sunlightNeeded: "high",
    waterFrequency: "Daily",
    daysToMature: 60,
    funFact: "Tomatoes were once thought to be poisonous in Europe!",
    emoji: "🍅",
    color: "hsl(0 70% 55%)",
  },
  {
    type: "okra",
    name: "Okra",
    nameTagalog: "Okra",
    description: "A green vegetable with a unique texture, perfect for Filipino dishes like sinigang!",
    sunlightNeeded: "high",
    waterFrequency: "Every 2 days",
    daysToMature: 50,
    funFact: "Okra flowers are beautiful and edible too!",
    emoji: "🫑",
    color: "hsl(140 50% 45%)",
  },
  {
    type: "basil",
    name: "Basil",
    nameTagalog: "Balanoy",
    description: "An aromatic herb with a sweet smell, great for adding flavor to dishes!",
    sunlightNeeded: "medium",
    waterFrequency: "Daily",
    daysToMature: 25,
    funFact: "Basil leaves taste better when you pick them in the morning!",
    emoji: "🌿",
    color: "hsl(130 55% 50%)",
  },
  {
    type: "lettuce",
    name: "Lettuce",
    nameTagalog: "Letsugas",
    description: "Crispy and fresh, perfect for salads and sandwiches!",
    sunlightNeeded: "low",
    waterFrequency: "Daily",
    daysToMature: 35,
    funFact: "Lettuce is 95% water, which is why it's so crunchy and refreshing!",
    emoji: "🥗",
    color: "hsl(100 50% 55%)",
  },
];

export const getPlantInfo = (type: string): PlantInfo | undefined => {
  return PLANT_DATA.find((plant) => plant.type === type);
};
