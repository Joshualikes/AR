import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Thermometer, 
  Droplet, 
  Sun, 
  Leaf, 
  TrendingUp,
  Moon
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type TabType = "overview" | "soil" | "dht";

const IoTSensors = () => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Mock sensor data - replace with real API calls
  const temperature = 27.6;
  const humidity = 85;
  const lightHours = 11.6;
  const soilMoisture = 46;
  const dhtTemperature = 28.5;
  const dhtHumidity = 87;

  // Mock trend data
  const moistureTrendData = Array.from({ length: 20 }, (_, i) => ({
    reading: i + 1,
    moisture: Math.floor(Math.random() * 30) + 40, // 40-70% range
  }));

  const dhtTrendData = Array.from({ length: 50 }, (_, i) => ({
    reading: i + 1,
    temperature: 28 + Math.random() * 2, // 28-30°C
    humidity: 85 + Math.random() * 5, // 85-90%
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
              <h1 className="text-xl font-bold text-gray-800">IoT Sensors</h1>
              <p className="text-sm text-gray-500">View live readings from connected sensors</p>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Moon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="px-4 pt-4">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)}>
            <TabsList className="grid w-full grid-cols-3 bg-gray-100">
              <TabsTrigger 
                value="overview"
                className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="soil"
                className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm"
              >
                Soil
              </TabsTrigger>
              <TabsTrigger 
                value="dht"
                className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm"
              >
                DHT
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content */}
        <div className="px-4 py-4 space-y-4">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <Card className="p-5 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-green-600" />
                    <h3 className="text-base font-semibold text-gray-800">Temperature</h3>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {temperature}°C
                </div>
                <p className="text-sm text-gray-500">Clouds</p>
              </Card>

              <Card className="p-5 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-green-600" />
                    <h3 className="text-base font-semibold text-gray-800">Humidity</h3>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {humidity}%
                </div>
                <p className="text-sm text-gray-500">Relative humidity</p>
              </Card>

              <Card className="p-5 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sun className="w-5 h-5 text-green-600" />
                    <h3 className="text-base font-semibold text-gray-800">Light Hours</h3>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {lightHours}h
                </div>
                <p className="text-sm text-gray-500">Estimated daylight</p>
              </Card>

              <Card className="p-5 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-800">Location</h3>
                  <span className="text-sm font-medium text-green-600">Live</span>
                </div>
              </Card>
            </div>
          )}

          {/* Soil Tab */}
          {activeTab === "soil" && (
            <div className="space-y-4">
              <Card className="p-5 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Leaf className="w-5 h-5 text-green-600" />
                  <h3 className="text-base font-semibold text-gray-800">Current Soil Moisture</h3>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {soilMoisture}% Moisture
                </div>
                <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
              </Card>

              <Card className="p-5 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-red-500" />
                  <h3 className="text-base font-semibold text-gray-800">Moisture Trend (last 20 readings)</h3>
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
          )}

          {/* DHT Tab */}
          {activeTab === "dht" && (
            <div className="space-y-4">
              <Card className="p-5 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Thermometer className="w-5 h-5 text-green-600" />
                  <h3 className="text-base font-semibold text-gray-800">Current Temperature & Humidity</h3>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {dhtTemperature}°C • {dhtHumidity}%
                </div>
                <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
              </Card>

              <Card className="p-5 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <h3 className="text-base font-semibold text-gray-800">DHT Trend (last 50 readings)</h3>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={dhtTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="reading" 
                      tick={{ fontSize: 12 }}
                      stroke="#888"
                    />
                    <YAxis 
                      domain={[25, 100]}
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
                      dataKey="humidity" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 2 }}
                      activeDot={{ r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      dot={{ fill: '#ef4444', r: 2 }}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default IoTSensors;

