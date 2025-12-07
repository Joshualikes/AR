import { Card } from "@/components/ui/card";
import { DailyTask } from "@/types/plant";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskCardProps {
  task: DailyTask;
  onComplete: () => void;
}

export const TaskCard = ({ task, onComplete }: TaskCardProps) => {
  return (
    <Card className={`transition-all ${task.completed ? "bg-primary/5 border-primary" : ""}`}>
      <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-start gap-2 sm:gap-3 flex-1 w-full">
          <div
            className={`mt-0.5 sm:mt-1 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center transition-all flex-shrink-0 ${
              task.completed
                ? "bg-primary text-primary-foreground"
                : "border-2 border-muted-foreground/30"
            }`}
          >
            {task.completed && <Check className="w-3 h-3 sm:w-4 sm:h-4" />}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold mb-1 text-sm sm:text-base ${task.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
              {task.title}
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground">{task.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1 text-gold">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-gold" />
            <span className="font-bold text-sm sm:text-base">+{task.stars}</span>
          </div>
          
          {!task.completed && (
            <Button
              onClick={onComplete}
              size="sm"
              className="bg-primary hover:bg-primary/90 h-8 sm:h-9 text-sm"
            >
              Done!
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
