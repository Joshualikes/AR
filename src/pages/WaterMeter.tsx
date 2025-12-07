import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Droplet, Droplets } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const WaterMeter = () => {
  const navigate = useNavigate();
  const [soilMoisture, setSoilMoisture] = useState<number | null>(null);
  const [isMeasuring, setIsMeasuring] = useState(false);

  const measureMoisture = () => {
    setIsMeasuring(true);
    // Simulate moisture measurement
    setTimeout(() => {
      // Random moisture level between 20% and 80% for demo
      const moisture = Math.floor(Math.random() * 60) + 20;
      setSoilMoisture(moisture);
      setIsMeasuring(false);
    }, 2000);
  };

  const getMoistureStatus = (moisture: number) => {
    if (moisture < 30) return { label: "Dry", color: "text-red-600", bgColor: "bg-red-50", advice: "Your plant needs water!" };
    if (moisture < 50) return { label: "Moderate", color: "text-yellow-600", bgColor: "bg-yellow-50", advice: "Consider watering soon." };
    if (moisture < 70) return { label: "Good", color: "text-green-600", bgColor: "bg-green-50", advice: "Moisture level is optimal." };
    return { label: "Wet", color: "text-blue-600", bgColor: "bg-blue-50", advice: "Soil is very moist. Avoid overwatering." };
  };

  const status = soilMoisture !== null ? getMoistureStatus(soilMoisture) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-24 safe-area-bottom">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm header-spacing border-b-2 border-gray-200 sticky top-0 z-10 shadow-sm safe-area-top">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/home')}
            className="hover:bg-gray-100 rounded-xl touch-target"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Water Meter</h1>
            <p className="text-sm text-gray-500">Check soil moisture level</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="page-container py-6 section-spacing">
        {/* Instructions */}
        <Card className="card-spacing bg-white border-2 border-gray-200 shadow-medium rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Droplet className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-800 mb-2">How to Use</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Place your finger or a moisture meter into the soil about 2-3 inches deep. 
                The meter will help you determine if your plant needs watering.
              </p>
            </div>
          </div>
        </Card>

        {/* Measurement Card */}
        <Card className="p-8 sm:p-10 bg-white border-2 border-gray-200 shadow-medium rounded-2xl text-center">
          {!soilMoisture && !isMeasuring && (
            <div className="space-y-4">
              <div className="bg-green-100 w-32 h-32 rounded-full mx-auto flex items-center justify-center">
                <Droplets className="w-16 h-16 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to Measure</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Click the button below to check your soil moisture level
                </p>
                <Button
                  onClick={measureMoisture}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
                >
                  Measure Moisture
                </Button>
              </div>
            </div>
          )}

          {isMeasuring && (
            <div className="space-y-4">
              <div className="bg-green-100 w-32 h-32 rounded-full mx-auto flex items-center justify-center animate-pulse">
                <Droplets className="w-16 h-16 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Measuring...</h3>
                <p className="text-sm text-gray-600">Please wait while we analyze the soil</p>
              </div>
            </div>
          )}

          {soilMoisture !== null && status && (
            <div className="space-y-6">
              <div className="bg-green-100 w-32 h-32 rounded-full mx-auto flex items-center justify-center">
                <Droplets className="w-16 h-16 text-green-600" />
              </div>
              
              <div>
                <div className="text-5xl font-bold text-gray-800 mb-2">
                  {soilMoisture}%
                </div>
                <div className={`inline-block px-4 py-2 rounded-full ${status.bgColor} ${status.color} font-semibold`}>
                  {status.label}
                </div>
              </div>

              <div className="bg-gray-100 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    soilMoisture < 30 ? 'bg-red-500' :
                    soilMoisture < 50 ? 'bg-yellow-500' :
                    soilMoisture < 70 ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${soilMoisture}%` }}
                />
              </div>

              <Card className={`p-4 ${status.bgColor} border-0`}>
                <p className={`${status.color} font-medium`}>{status.advice}</p>
              </Card>

              <Button
                onClick={() => {
                  setSoilMoisture(null);
                  setIsMeasuring(false);
                }}
                variant="outline"
                className="w-full"
              >
                Measure Again
              </Button>
            </div>
          )}
        </Card>

        {/* Tips */}
        <Card className="card-spacing bg-white border-2 border-gray-200 shadow-medium rounded-2xl">
          <h3 className="font-semibold text-gray-800 mb-4">Watering Tips</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>Most plants prefer soil that's slightly moist, not soggy</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>Water when the top 1-2 inches of soil feel dry</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>Overwatering can cause root rot - always check before watering</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>Different plants have different water needs - check your plant's requirements</span>
            </li>
          </ul>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default WaterMeter;

