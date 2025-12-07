import { UserProgress } from "@/types/plant";
import { Star, Award, Flame } from "lucide-react";

interface ProgressBarProps {
  progress: UserProgress;
}

export const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className="bg-card rounded-2xl p-3 sm:p-4 shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        {/* Level */}
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-bold text-base sm:text-lg">
            {progress.level}
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Junior Gardener</p>
            <p className="font-semibold text-sm sm:text-base text-foreground">Level {progress.level}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Stars */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-gold/10 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-gold text-gold" />
            <span className="font-bold text-sm sm:text-base text-foreground">{progress.stars}</span>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-accent/10 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            <span className="font-bold text-sm sm:text-base text-foreground">{progress.badges.length}</span>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-destructive/10 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
            <span className="font-bold text-sm sm:text-base text-foreground">{progress.streak}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
