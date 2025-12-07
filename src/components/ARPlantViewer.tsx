import { Plant, GrowthStage } from "@/types/plant";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Maximize2 } from "lucide-react";
import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ARCameraView } from "./ARCameraView";
import { ARPlacement } from "@/lib/ar-utils";
import { Plant3D } from "./Plant3D";

interface ARPlantViewerProps {
  plant?: Plant;
  onOpenCamera: () => void;
  onPlacementUpdate?: (placement: ARPlacement) => void;
}

export const ARPlantViewer = ({ plant, onOpenCamera, onPlacementUpdate }: ARPlantViewerProps) => {
  const [showARCamera, setShowARCamera] = useState(false);
  
  const getStageDisplay = (stage: GrowthStage) => {
    const displays = {
      seed: { emoji: "🌰", name: "Seed", color: "text-earth" },
      sprout: { emoji: "🌱", name: "Sprout", color: "text-primary" },
      small: { emoji: "🪴", name: "Small Plant", color: "text-primary" },
      growing: { emoji: "🌿", name: "Growing Strong", color: "text-primary" },
      mature: { emoji: "✨", name: "Fully Grown!", color: "text-gold" },
    };
    return displays[stage];
  };

  if (!plant) {
    return (
      <Card className="p-8 text-center">
        <Camera className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-bold mb-2 text-foreground">No Plant Yet!</h3>
        <p className="text-muted-foreground mb-6">
          Choose a plant below to start your gardening journey in AR!
        </p>
        <Button 
          onClick={() => setShowARCamera(true)} 
          size="lg" 
          className="bg-primary hover:bg-primary/90"
        >
          <Camera className="w-5 h-5 mr-2" />
          Open AR Camera
        </Button>
      </Card>
    );
  }

  const stageInfo = getStageDisplay(plant.stage);

  return (
    <Card className="overflow-hidden">
      {/* AR Preview Area */}
      <div className="relative bg-gradient-to-b from-muted/50 to-muted p-8 min-h-[400px] flex flex-col items-center justify-center">
        {/* 3D Plant Display */}
        <div className="w-full h-64 mb-4">
          <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <pointLight position={[-5, 5, -5]} intensity={0.5} />
              <Plant3D stage={plant.stage} plantType={plant.type} autoRotate={true} scale={1.5} />
              <OrbitControls enableZoom={false} enablePan={false} />
            </Suspense>
          </Canvas>
        </div>
        
        {/* Stage Name */}
        <div className={`text-2xl font-bold ${stageInfo.color} mb-2`}>
          {stageInfo.name}
        </div>
        
        {/* Days Growing */}
        <div className="text-sm text-muted-foreground">
          Day {plant.daysGrowing} of {plant.stage === "mature" ? plant.daysGrowing : "~30"}
        </div>

        {/* AR Button */}
        <Button
          onClick={() => setShowARCamera(true)}
          size="lg"
          className="mt-6 bg-primary hover:bg-primary/90"
        >
          <Maximize2 className="w-5 h-5 mr-2" />
          View in AR
        </Button>
        
        {/* AR Camera Modal */}
        {showARCamera && plant && (
          <ARCameraView
            plant={plant}
            onClose={() => setShowARCamera(false)}
            onPlacementConfirmed={(placement) => {
              if (onPlacementUpdate) {
                onPlacementUpdate(placement);
              }
            }}
          />
        )}
      </div>

      {/* Plant Stats */}
      <div className="p-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{plant.healthScore}%</div>
          <div className="text-xs text-muted-foreground">Health</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary">{plant.sunlightLevel}%</div>
          <div className="text-xs text-muted-foreground">Sunlight</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent">
            {Math.floor((Date.now() - plant.lastWatered.getTime()) / 3600000)}h
          </div>
          <div className="text-xs text-muted-foreground">Since Water</div>
        </div>
      </div>
    </Card>
  );
};
