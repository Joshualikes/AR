import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Sprout, 
  Trash2, 
  Droplets,
  Calendar,
  Award,
  LeafyGreen,
  Heart,
  Loader2,
  Bell,
  AlertCircle
} from "lucide-react";
import { useUserPlants } from "@/hooks/useGardenData";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const MyGarden = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { plants, loading, waterPlant, deletePlant, refetch } = useUserPlants();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      navigate("/auth");
      return;
    }
    setIsAuthenticated(true);
  };

  const handleDeletePlant = async (plantId: string, plantName: string) => {
    if (window.confirm(`Sigurado ka bang gusto mong tanggalin ang "${plantName}"?`)) {
      await deletePlant(plantId);
    }
  };

  const handleWaterPlant = async (plantId: string) => {
    await waterPlant(plantId);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Hindi pa';
    const date = new Date(dateString);
    return date.toLocaleDateString('tl-PH', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-green-600 bg-green-100';
    if (health >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getGrowthStageLabel = (stage: number) => {
    switch (stage) {
      case 1: return 'Binhi 🌱';
      case 2: return 'Tumutubo 🌿';
      case 3: return 'Lumalaki 🪴';
      case 4: return 'Malaki na 🌳';
      case 5: return 'Handang Anihin 🥬';
      default: return 'Binhi 🌱';
    }
  };

  const needsWatering = (lastWatered: string | null) => {
    if (!lastWatered) return true;
    const lastDate = new Date(lastWatered);
    const now = new Date();
    const diffHours = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60);
    return diffHours >= 24;
  };

  const getHoursSinceWatered = (lastWatered: string | null) => {
    if (!lastWatered) return null;
    const lastDate = new Date(lastWatered);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60));
    return diffHours;
  };

  const plantsNeedingWater = plants.filter(plant => needsWatering(plant.lastWatered));

  // Request notification permission and set up notifications
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Check for plants needing water and show browser notification
    const needsWater = plants.filter(plant => needsWatering(plant.lastWatered));
    
    if (needsWater.length > 0 && Notification.permission === 'granted') {
      const checkAndNotify = () => {
        const currentNeedsWater = plants.filter(plant => needsWatering(plant.lastWatered));
        if (currentNeedsWater.length > 0) {
          new Notification('💧 Kailangan Diligan ang Halaman!', {
            body: `May ${currentNeedsWater.length} halaman na kailangan ng tubig.`,
            icon: '/favicon.ico',
            tag: 'plant-watering-reminder',
            requireInteraction: false,
          });
        }
      };

      // Check every hour
      const notificationInterval = setInterval(checkAndNotify, 60 * 60 * 1000);
      
      // Initial check after 5 seconds
      const initialTimeout = setTimeout(checkAndNotify, 5000);

      return () => {
        clearInterval(notificationInterval);
        clearTimeout(initialTimeout);
      };
    }
  }, [plants]);

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Naglo-load...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/30 to-white pb-24 safe-area-bottom">
      <div className="page-container py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
            <h1 className="text-2xl font-bold text-gray-800">Aking Hardin</h1>
          </div>
          {plants.length > 0 && (
            <div className="flex items-center gap-1.5 bg-green-100 px-3 py-1.5 rounded-full">
              <Award className="w-4 h-4 text-green-700" />
              <span className="text-sm font-semibold text-green-700">{plants.length}</span>
            </div>
          )}
        </div>

        {plants.length === 0 ? (
          <Card className="card-spacing border-2 border-gray-200 shadow-medium rounded-2xl text-center">
            <div className="py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sprout className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Walang Halaman Pa</h2>
              <p className="text-gray-600 mb-2">Walang halaman pa sa iyong hardin.</p>
              <p className="text-sm text-gray-500 mb-6">
                Mag-simula sa pamamagitan ng pag-identify ng halaman!
              </p>
              <Button
                onClick={() => navigate('/plant-identifier')}
                className="bg-green-600 hover:bg-green-700 text-white px-6"
              >
                Mag-identify ng Halaman
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* Watering Notification Alert */}
            {plantsNeedingWater.length > 0 && (
              <Alert className="mb-6 border-orange-200 bg-orange-50">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <AlertTitle className="text-orange-800 font-bold">
                  💧 Kailangan Diligan ang Halaman!
                </AlertTitle>
                <AlertDescription className="text-orange-700 mt-1">
                  May <strong>{plantsNeedingWater.length}</strong> halaman na kailangan ng tubig (24 oras na ang nakalipas mula nang huling diligan).
                </AlertDescription>
              </Alert>
            )}

            {/* Plants List */}
          <div className="section-spacing">
            {plants.map((plant) => (
              <Card
                key={plant.id}
                className="border-2 border-gray-200 shadow-medium rounded-2xl overflow-hidden card-hover"
              >
                <div className="flex gap-4">
                  {/* Plant Image */}
                  <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex-shrink-0 bg-green-50">
                    {plant.imageUrl ? (
                      <img
                        src={plant.imageUrl}
                        alt={plant.plantName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <LeafyGreen className="w-12 h-12 text-green-400" />
                      </div>
                    )}
                    <div className={cn(
                      "absolute top-2 right-2 p-1.5 rounded-lg border-2",
                      "bg-emerald-100 text-emerald-700 border-emerald-200"
                    )}>
                      <LeafyGreen className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Plant Info */}
                  <div className="flex-1 py-4 pr-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">
                          {plant.plantName}
                        </h3>
                        <p className="text-sm text-gray-500 italic line-clamp-1">
                          {plant.plantType}
                        </p>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <div className={cn("px-2.5 py-1 rounded-full flex items-center gap-1", getHealthColor(plant.healthPercentage))}>
                        <Heart className="w-3 h-3" />
                        <span className="text-xs font-semibold">
                          {plant.healthPercentage}%
                        </span>
                      </div>
                      <div className="bg-blue-100 px-2.5 py-1 rounded-full">
                        <span className="text-xs font-semibold text-blue-700">
                          {getGrowthStageLabel(plant.growthStage)}
                        </span>
                      </div>
                      {needsWatering(plant.lastWatered) && (
                        <div className="bg-orange-100 px-2.5 py-1 rounded-full animate-pulse border border-orange-300">
                          <span className="text-xs font-semibold text-orange-700 flex items-center gap-1">
                            <Bell className="w-3 h-3" />
                            Kailangan ng tubig!
                          </span>
                        </div>
                      )}
                      {!needsWatering(plant.lastWatered) && plant.lastWatered && (
                        <div className="bg-green-100 px-2.5 py-1 rounded-full">
                          <span className="text-xs font-semibold text-green-700">
                            💧 Diligan ulit sa {24 - (getHoursSinceWatered(plant.lastWatered) || 0)} oras
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Date Info */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Itinanim: {formatDate(plant.plantedAt)}</span>
                    </div>

                    {/* Last Watered Info */}
                    {plant.lastWatered && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                        <Droplets className="w-3.5 h-3.5" />
                        <span>
                          Huling diligan: {getHoursSinceWatered(plant.lastWatered) !== null 
                            ? `${getHoursSinceWatered(plant.lastWatered)} oras na ang nakalipas`
                            : formatDate(plant.lastWatered)}
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleWaterPlant(plant.id)}
                        variant="outline"
                        size="sm"
                        className={cn(
                          "flex-1 border-blue-300 text-blue-700 hover:bg-blue-50",
                          needsWatering(plant.lastWatered) && "border-orange-400 bg-orange-50 text-orange-700 hover:bg-orange-100 font-semibold animate-pulse"
                        )}
                      >
                        <Droplets className="w-4 h-4 mr-1.5" />
                        {needsWatering(plant.lastWatered) ? "Diligan Ngayon!" : "Diligan"}
                      </Button>
                      <Button
                        onClick={() => handleDeletePlant(plant.id, plant.plantName)}
                        variant="outline"
                        size="sm"
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default MyGarden;
