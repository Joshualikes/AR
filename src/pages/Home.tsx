import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSessionAsync, onAuthStateChange } from "@/lib/auth";
import { useUserPlants, usePlantIdentifications } from "@/hooks/useGardenData";
import { useLanguage } from "@/contexts/LanguageContext";
import BottomNav from "@/components/BottomNav";
import {
  MapPin,
  Cloud,
  Camera,
  Droplet,
  MessageCircle,
  Sprout,
  ChevronRight,
  Loader2,
  Search,
  LeafyGreen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Home = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("Rizal");
  const [temperature, setTemperature] = useState("--°C");
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("🌱");
  
  const { plants, loading: plantsLoading } = useUserPlants();
  const { identifications, totalCount: identifiedCount, loading: identificationsLoading } = usePlantIdentifications();

  useEffect(() => {
    checkAuth();
    fetchWeather();
    loadAvatar();

    // Listen to auth state changes (e.g., when user logs out)
    const unsubscribe = onAuthStateChange((user) => {
      if (!user) {
        // User logged out, redirect to auth page
        navigate("/auth", { replace: true });
      } else {
        // User logged in, update username
        setUsername(user.username);
        setLoading(false);
      }
    });

    // Listen for localStorage changes (avatar updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedAvatar' && e.newValue) {
        setSelectedAvatar(e.newValue);
      }
    };

    // Also listen for custom storage events (for same-tab updates)
    const handleCustomStorageChange = () => {
      const savedAvatar = localStorage.getItem('selectedAvatar');
      if (savedAvatar) {
        setSelectedAvatar(savedAvatar);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('avatarChanged', handleCustomStorageChange);

    // Check avatar periodically in case storage event doesn't fire (same tab)
    const avatarCheckInterval = setInterval(() => {
      const savedAvatar = localStorage.getItem('selectedAvatar');
      if (savedAvatar && savedAvatar !== selectedAvatar) {
        setSelectedAvatar(savedAvatar);
      }
    }, 1000);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('avatarChanged', handleCustomStorageChange);
      clearInterval(avatarCheckInterval);
    };
  }, [navigate, selectedAvatar]);

  const fetchWeather = async () => {
    try {
      // Get user's location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: false,
        });
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocoding to get location name using OpenStreetMap Nominatim
      const reverseGeoResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'AR-Garden-Buds-App'
          }
        }
      );
      
      if (reverseGeoResponse.ok) {
        const geoData = await reverseGeoResponse.json();
        const cityName = geoData.address?.city || 
                        geoData.address?.town || 
                        geoData.address?.municipality || 
                        geoData.address?.state || 
                        geoData.address?.region ||
                        "Unknown Location";
        setLocation(cityName);
      }

      // Fetch weather data from Open-Meteo
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&timezone=auto`
      );

      if (weatherResponse.ok) {
        const weatherData = await weatherResponse.json();
        const temp = Math.round(weatherData.current.temperature_2m);
        setTemperature(`${temp}°C`);
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
      // Fallback to default values if geolocation fails
      setLocation("Rizal");
      setTemperature("26°C");
    } finally {
      setWeatherLoading(false);
    }
  };

  const loadAvatar = () => {
    const savedAvatar = localStorage.getItem('selectedAvatar');
    if (savedAvatar) {
      setSelectedAvatar(savedAvatar);
    }
  };

  const checkAuth = async () => {
    // Use async session check to verify actual Supabase session
    const { user, error } = await getSessionAsync();

    if (error || !user) {
      navigate("/auth", { replace: true });
      return;
    }

    setUsername(user.username);
    setLoading(false);
  };

  const plantTools = [
    {
      icon: Camera,
      label: t("home.plantIdentifier"),
      color: "bg-green-500",
      onClick: () => navigate("/plant-identifier"),
    },
    {
      icon: Droplet,
      label: t("home.waterMeter"),
      color: "bg-green-500",
      onClick: () => navigate("/water"),
    },
    {
      icon: MessageCircle,
      label: t("home.kuyaBotanist"),
      color: "bg-teal-500",
      onClick: () => navigate("/botanist"),
    },
  ];

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-green-600';
    if (health >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-lg text-gray-600">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/30 via-white to-white pb-24 safe-area-bottom max-w-md mx-auto">
      {/* Header with Location and Weather */}
      <header className="bg-white/95 backdrop-blur-sm px-4 sm:px-6 py-4 sticky top-0 z-10 border-b border-gray-100/80 shadow-sm safe-area-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-green-100 rounded-lg">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <span className="font-semibold text-gray-800 text-base block leading-tight">{location}</span>
              <span className="text-xs text-gray-500">{t("home.location")}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="text-right">
              <div className="text-base font-bold text-gray-800 leading-tight">
                {weatherLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin inline-block" />
                ) : (
                  temperature
                )}
              </div>
              <div className="text-xs text-gray-500 leading-tight">
                {t("home.temperature")}
              </div>
            </div>
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Cloud className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="page-container py-6 section-spacing">
        {/* Welcome & Progress Section */}
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white p-5 rounded-2xl border-0 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-green-100 text-sm">{t("home.goodDay")}</p>
              <h1 className="text-2xl font-bold">{username || 'Hardinero'}!</h1>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <div className="w-8 h-8 flex items-center justify-center text-4xl">
                {selectedAvatar}
              </div>
            </div>
          </div>
          
          {(plantsLoading || identificationsLoading) ? (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="w-5 h-5 animate-spin text-white/70" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Search className="w-5 h-5 text-white" />
                  <span className="text-xl font-bold">{identifiedCount || 0}</span>
                </div>
                <p className="text-xs text-green-100">{t("home.identifiedPlants")}</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <LeafyGreen className="w-5 h-5 text-white" />
                  <span className="text-xl font-bold">{plants?.length || 0}</span>
                </div>
                <p className="text-xs text-green-100">{t("home.savedGarden")}</p>
              </div>
            </div>
          )}
        </Card>

        {/* My Plants Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-800">{t("home.myPlants")}</h2>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => navigate('/garden')}
            >
              {t("home.viewAll")}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          {plantsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            </div>
          ) : plants.length === 0 ? (
            <Card className="p-6 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl text-center">
              <Sprout className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 font-medium mb-2">{t("home.noPlants")}</p>
              <p className="text-gray-500 text-sm mb-4">{t("home.noPlantsDesc")}</p>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => navigate('/plant-identifier')}
              >
                <Camera className="w-4 h-4 mr-2" />
                {t("home.identifyPlant")}
              </Button>
            </Card>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {plants.slice(0, 5).map((plant) => (
                <Card 
                  key={plant.id}
                  className="flex-shrink-0 w-36 bg-white border-2 border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:border-green-300 transition-all"
                  onClick={() => navigate('/garden')}
                >
                  {plant.imageUrl ? (
                    <img 
                      src={plant.imageUrl} 
                      alt={plant.plantName === "Hindi Halaman" ? t("result.notAPlant") : plant.plantName}
                      className="w-full h-24 object-cover"
                    />
                  ) : (
                    <div className="w-full h-24 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                      <Sprout className="w-10 h-10 text-green-500" />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {plant.plantName === "Hindi Halaman" ? t("result.notAPlant") : plant.plantName}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{plant.plantType}</span>
                      <span className={cn("text-xs font-medium", getHealthColor(plant.healthPercentage))}>
                        {plant.healthPercentage}%
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
              {plants.length > 5 && (
                <Card 
                  className="flex-shrink-0 w-36 bg-green-50 border-2 border-green-200 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-green-100 transition-all"
                  onClick={() => navigate('/garden')}
                >
                  <div className="text-center p-4">
                    <div className="text-2xl font-bold text-green-600">+{plants.length - 5}</div>
                    <p className="text-xs text-green-700">pa</p>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Plant Tools Section */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
            <h2 className="text-xl font-bold text-gray-800">{t("home.tools")}</h2>
          </div>
          <div className="flex justify-center gap-3">
            {plantTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 cursor-pointer active:scale-[0.95] transition-transform"
                  onClick={tool.onClick}
                >
                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md transition-smooth",
                      tool.color
                    )}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center leading-tight line-clamp-2">
                    {tool.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Home;
