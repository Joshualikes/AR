import { useState } from "react";
import { PlantCard } from "@/components/PlantCard";
import { ProgressBar } from "@/components/ProgressBar";
import { TaskCard } from "@/components/TaskCard";
import { ARPlantViewer } from "@/components/ARPlantViewer";
import { PLANT_DATA } from "@/data/plants";
import { Plant, UserProgress, DailyTask, PlantType } from "@/types/plant";
import { Button } from "@/components/ui/button";
import { Sprout, ListTodo, Camera, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedPlantType, setSelectedPlantType] = useState<PlantType | null>(null);
  const [currentPlant, setCurrentPlant] = useState<Plant | undefined>(undefined);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 1,
    stars: 0,
    badges: [],
    streak: 0,
    plantsGrown: 0,
  });

  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([
    {
      id: "1",
      title: "Water your plant",
      description: "Give your plant some water to help it grow!",
      completed: false,
      stars: 10,
    },
    {
      id: "2",
      title: "Check sunlight",
      description: "Make sure your plant is getting enough sunlight.",
      completed: false,
      stars: 5,
    },
    {
      id: "3",
      title: "Learn something new",
      description: "Read a fun fact about your plant!",
      completed: false,
      stars: 5,
    },
  ]);

  const handlePlantSelect = (type: PlantType) => {
    setSelectedPlantType(type);
  };

  const handleStartGrowing = () => {
    if (!selectedPlantType) {
      toast({
        title: "No plant selected!",
        description: "Please choose a plant first.",
        variant: "destructive",
      });
      return;
    }

    const newPlant: Plant = {
      id: Date.now().toString(),
      type: selectedPlantType,
      name: PLANT_DATA.find((p) => p.type === selectedPlantType)?.name || "",
      stage: "seed",
      daysGrowing: 0,
      lastWatered: new Date(),
      sunlightLevel: 50,
      healthScore: 100,
    };

    setCurrentPlant(newPlant);
    toast({
      title: "🌱 Plant started!",
      description: `Your ${newPlant.name} is ready to grow! Take care of it every day.`,
    });
  };

  const handleTaskComplete = (taskId: string) => {
    setDailyTasks((tasks) =>
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: true } : task
      )
    );

    const task = dailyTasks.find((t) => t.id === taskId);
    if (task) {
      setUserProgress((prev) => ({
        ...prev,
        stars: prev.stars + task.stars,
      }));

      toast({
        title: "Task completed! ⭐",
        description: `You earned ${task.stars} stars!`,
      });
    }
  };

  const handlePlacementUpdate = (placement: any) => {
    toast({
      title: "AR Placement Updated! 📍",
      description: "Your plant is now placed in your real environment!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-3 sm:p-4 md:p-6 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                onClick={() => navigate('/home')}
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/20 h-9 w-9 sm:h-10 sm:w-10"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
              <Sprout className="w-8 h-8 sm:w-10 sm:h-10" />
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">GreenGrow AR</h1>
                <p className="text-xs sm:text-sm opacity-90">Magtanim ng mga halaman!</p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/gallery')}
              variant="secondary"
              size="icon"
              className="bg-primary-foreground/20 hover:bg-primary-foreground/30 border-0 h-9 w-9 sm:h-10 sm:w-10"
            >
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
          <ProgressBar progress={userProgress} />
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 space-y-6 sm:space-y-8">
        {/* AR Plant Viewer */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
            <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            Your Plant
          </h2>
          <ARPlantViewer 
            plant={currentPlant} 
            onOpenCamera={() => {}} 
            onPlacementUpdate={handlePlacementUpdate}
          />
        </section>

        {/* Daily Tasks */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
            <ListTodo className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
            Today's Tasks
          </h2>
          <div className="space-y-3">
            {dailyTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={() => handleTaskComplete(task.id)}
              />
            ))}
          </div>
        </section>

        {/* Plant Selection */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
            Choose Your Plant
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
            {PLANT_DATA.map((plant) => (
              <PlantCard
                key={plant.type}
                plant={plant}
                selected={selectedPlantType === plant.type}
                onSelect={() => handlePlantSelect(plant.type)}
              />
            ))}
          </div>
          
          {selectedPlantType && !currentPlant && (
            <div className="text-center">
              <Button
                onClick={handleStartGrowing}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 h-auto"
              >
                🌱 Start Growing {PLANT_DATA.find((p) => p.type === selectedPlantType)?.name}!
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Index;
