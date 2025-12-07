import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Leaf, 
  TrendingUp
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const IoTSensors = () => {
  const { t } = useLanguage();

  // Mock sensor data - replace with real API calls
  const soilMoisture = 46;

  // Mock trend data
  const moistureTrendData = Array.from({ length: 20 }, (_, i) => ({
    reading: i + 1,
    moisture: Math.floor(Math.random() * 30) + 40, // 40-70% range
  }));

  const lastUpdated = new Date().toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20 safe-area-bottom">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <header className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10 safe-area-top">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">{t("iot.title")}</h1>
              <p className="text-sm text-gray-500">{t("iot.subtitle")}</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-4 py-4 space-y-4">
          {/* Soil Screen */}
          <div className="space-y-4">
            <Card className="p-5 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Leaf className="w-5 h-5 text-green-600" />
                <h3 className="text-base font-semibold text-gray-800">{t("iot.soilMoisture")}</h3>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {soilMoisture}% {t("iot.moisture")}
              </div>
              <p className="text-sm text-gray-500">{t("iot.lastUpdated")} {lastUpdated}</p>
            </Card>

            <Card className="p-5 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-red-500" />
                <h3 className="text-base font-semibold text-gray-800">{t("iot.moistureTrend")}</h3>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={moistureTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="reading" 
                    tick={{ fontSize: 12 }}
                    stroke="#888"
                  />
                  <YAxis 
                    domain={[0, 100]}
                    ticks={[25, 50, 75, 100]}
                    tick={{ fontSize: 12 }}
                    stroke="#888"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="moisture" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    dot={{ fill: '#22c55e', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default IoTSensors;

