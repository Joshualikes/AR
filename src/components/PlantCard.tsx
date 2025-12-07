import { Card } from "@/components/ui/card";
import { PlantInfo } from "@/types/plant";
import { Sun, Droplet, Clock, Sparkles } from "lucide-react";

interface PlantCardProps {
  plant: PlantInfo;
  onSelect: () => void;
  selected?: boolean;
}

export const PlantCard = ({ plant, onSelect, selected }: PlantCardProps) => {
  const getSunlightIcon = (level: string) => {
    const count = level === "low" ? 1 : level === "medium" ? 2 : 3;
    return Array(count).fill(0).map((_, i) => (
      <Sun key={i} className="w-4 h-4 fill-secondary text-secondary" />
    ));
  };

  return (
    <Card
      onClick={onSelect}
      className={`relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
        selected ? "ring-2 sm:ring-4 ring-primary shadow-xl scale-105" : ""
      }`}
    >
      <div className="p-4 sm:p-6 text-center">
        {/* Emoji Display */}
        <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 animate-bounce-soft">
          {plant.emoji}
        </div>
        
        {/* Plant Name */}
        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">
          {plant.name}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
          ({plant.nameTagalog})
        </p>

        {/* Quick Stats */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-3 sm:mb-4">
          <div className="flex items-center gap-0.5 sm:gap-1">
            <div className="flex">{getSunlightIcon(plant.sunlightNeeded)}</div>
          </div>
          <div className="flex items-center gap-0.5 sm:gap-1 text-primary">
            <Droplet className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs">Daily</span>
          </div>
          <div className="flex items-center gap-0.5 sm:gap-1 text-accent">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs">{plant.daysToMature}d</span>
          </div>
        </div>

        {/* Fun Fact */}
        <div className="bg-muted rounded-lg p-2 sm:p-3 text-left">
          <div className="flex items-start gap-1.5 sm:gap-2">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-gold mt-0.5 sm:mt-1 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              {plant.funFact}
            </p>
          </div>
        </div>

        {/* Selected Indicator */}
        {selected && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-primary text-primary-foreground rounded-full p-1.5 sm:p-2 animate-grow">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>
        )}
      </div>
    </Card>
  );
};
