import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PlantIdentificationResult } from "@/lib/plant-identifier";
import { useUserPlants } from "@/hooks/useGardenData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  X,
  Shield,
  Droplet,
  Sun,
  Thermometer,
  Sprout,
  ChevronRight,
  ExternalLink,
  Heart,
  Check,
  Loader2,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const PlantIdentifierResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { plants, addPlant, loading: plantsLoading, refetch } = useUserPlants();

  const imageData = location.state?.image;
  const results: PlantIdentificationResult[] = location.state?.results || [];
  const mode = location.state?.mode || 'plant';

  const [selectedTab, setSelectedTab] = useState('info');
  const [selectedResult, setSelectedResult] = useState<PlantIdentificationResult | null>(
    results[0] || null
  );
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Check if the selected plant is already saved in user's garden
  useEffect(() => {
    if (selectedResult) {
      // Check even if plants array is empty (might be loading)
      const alreadySaved = plants.some(
        (p) => p.plantName.toLowerCase() === selectedResult.name.toLowerCase()
      );
      setIsSaved(alreadySaved);
    } else {
      setIsSaved(false);
    }
  }, [selectedResult, plants]);

  if (!selectedResult) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="p-8 text-center">
          <p className="text-gray-600">{t("result.noResults")}</p>
          <Button
            onClick={() => navigate('/plant-identifier')}
            className="mt-4 bg-green-600 hover:bg-green-700"
          >
            {t("plantIdentifier.tryAgain")}
          </Button>
        </Card>
      </div>
    );
  }

  const handleUnlock = () => {
    toast({
      title: language === "tagalog" ? "Na-unlock! 🔓" : "Unlocked! 🔓",
      description: language === "tagalog" ? "Ang premium content ay available na." : "Premium content is now available.",
    });
  };

  const handleSavePlant = async () => {
    if (!selectedResult || isSaving || isSaved) return;

    setIsSaving(true);

    try {
      const newPlant = await addPlant({
        plantName: selectedResult.name,
        plantType: selectedResult.category || mode || 'plant',
        growthStage: 1,
        healthPercentage: 100,
        lastWatered: null,
        lastFertilized: null,
        plantedAt: new Date().toISOString(),
        harvestDate: null,
        notes: selectedResult.description || null,
        imageUrl: imageData || null,
      });

      if (newPlant) {
        setIsSaved(true);
        // Refetch plants to ensure state is updated
        await refetch();
      } else {
        throw new Error('Failed to save plant');
      }
    } catch (error) {
      console.error('Error saving plant:', error);
      toast({
        title: t("common.error"),
        description: language === "tagalog" ? "Hindi ma-save ang halaman. Subukan muli." : "Cannot save plant. Please try again.",
        variant: "destructive",
      });
      setIsSaved(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            onClick={() => navigate('/home')}
            variant="ghost"
            size="icon"
            className="text-gray-600"
          >
            <X className="w-6 h-6" />
          </Button>
          
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold text-gray-900">
              {selectedResult.name === "Hindi Halaman" ? t("result.notAPlant") : selectedResult.name}
            </h1>
            <p className="text-sm text-gray-500">{selectedResult.scientificName}</p>
          </div>
          
          <Button
            onClick={handleSavePlant}
            variant="default"
            size="sm"
            className={isSaved 
              ? "bg-green-600 hover:bg-green-700 text-white" 
              : "bg-pink-500 hover:bg-pink-600 text-white"
            }
            disabled={isSaved || isSaving || plantsLoading}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                {t("result.saving")}
              </>
            ) : isSaved ? (
              <>
                <Check className="w-4 h-4 mr-1.5" />
                {t("result.saved")}
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 mr-1.5" />
                {t("result.saveGarden")}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Image */}
      {imageData && (
        <div className="relative">
          <img
            src={imageData}
            alt={selectedResult.name === "Hindi Halaman" ? t("result.notAPlant") : selectedResult.name}
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      {/* Tabs */}
      <div className="px-4 pt-4">
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setSelectedTab('notes')}
            className={`pb-3 px-2 text-sm font-medium ${
              selectedTab === 'notes'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500'
            }`}
          >
            {t("result.notes")}
          </button>
          <button
            onClick={() => setSelectedTab('info')}
            className={`pb-3 px-2 text-sm font-medium ${
              selectedTab === 'info'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500'
            }`}
          >
            {t("result.info")}
          </button>
          <button
            onClick={() => setSelectedTab('care')}
            className={`pb-3 px-2 text-sm font-medium ${
              selectedTab === 'care'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500'
            }`}
          >
            {t("result.careGuide")}
          </button>
        </div>
      </div>


      {/* Content */}
      <div className="px-4 py-4 space-y-4">
        {/* Unlock Card (if poisonous) */}
        {selectedResult.poisonous && (
          <Card className="bg-gray-100 border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-red-500" />
                <div>
                  <p className="font-bold text-gray-900">{t("result.unlock")}</p>
                  <p className="text-sm text-gray-600">{t("result.poisonous")}</p>
                </div>
              </div>
              <Button
                onClick={handleUnlock}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {t("result.unlockBtn")}
              </Button>
            </div>
          </Card>
        )}

        {/* Overview Section */}
        {selectedTab === 'info' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">{t("result.overview")}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {(() => {
                if (!selectedResult.description) {
                  const displayName = selectedResult.name === "Hindi Halaman" ? t("result.notAPlant") : selectedResult.name;
                  return t("result.defaultDescription").replace("{name}", displayName).replace("{scientificName}", selectedResult.scientificName);
                }
                // Check if description is the error message and translate it
                const tagalogError = "Hindi ko makita ang halaman sa larawan. Subukan ulit ng malinaw na picture ng halaman.";
                if (selectedResult.description === tagalogError) {
                  return t("result.cannotSeePlant");
                }
                return selectedResult.description;
              })()}
            </p>
            <button className="text-green-600 font-medium flex items-center gap-1">
              {t("result.learnMore")}
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Care Guide */}
        {selectedTab === 'care' && selectedResult.careGuide && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Droplet className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{t("result.water")}</h3>
                <p className="text-gray-700">{selectedResult.careGuide.water}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Sun className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{t("result.sun")}</h3>
                <p className="text-gray-700">{selectedResult.careGuide.sunlight}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Thermometer className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{t("result.temp")}</h3>
                <p className="text-gray-700">{selectedResult.careGuide.temperature}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Sprout className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{t("result.soil")}</h3>
                <p className="text-gray-700">{selectedResult.careGuide.soil}</p>
              </div>
            </div>
          </div>
        )}

        {/* Plant Notes Tab */}
        {selectedTab === 'notes' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">{t("result.plantNotes")}</h2>
            <p className="text-gray-700 leading-relaxed">
              {(() => {
                if (!selectedResult.description) {
                  return t("result.noNotes");
                }
                // Check if description is the error message and translate it
                const tagalogError = "Hindi ko makita ang halaman sa larawan. Subukan ulit ng malinaw na picture ng halaman.";
                if (selectedResult.description === tagalogError) {
                  return t("result.cannotSeePlant");
                }
                return selectedResult.description;
              })()}
            </p>
            {selectedResult.commonNames && selectedResult.commonNames.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-gray-900 mb-2">{t("result.otherNames")}</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedResult.commonNames.map((name, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confidence Score */}
        <Card className="bg-green-50 border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900">{t("result.confidence")}</p>
              <p className="text-sm text-gray-600">
                {Math.round(selectedResult.confidence * 100)}% {t("result.match")}
              </p>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(selectedResult.confidence * 100)}%
            </div>
          </div>
        </Card>

        {/* Alternative Results */}
        {results.length > 1 && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">{t("result.alternativeMatches")}</h3>
            <div className="space-y-2">
              {results.slice(1).map((result, index) => (
                <Card
                  key={index}
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedResult(result)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {result.name === "Hindi Halaman" ? t("result.notAPlant") : result.name}
                      </p>
                      <p className="text-sm text-gray-600">{result.scientificName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {Math.round(result.confidence * 100)}%
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default PlantIdentifierResult;
