import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { LanguageProvider } from "@/contexts/LanguageContext";
import SplashScreen from "./pages/SplashScreen";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Index from "./pages/Index";
import ARPhotoGallery from "./pages/ARPhotoGallery";
import MyGarden from "./pages/MyGarden";
import IoTSensors from "./pages/IoTSensors";
import AskBotanist from "./pages/AskBotanist";
import Profile from "./pages/Profile";
import PlantIdentifier from "./pages/PlantIdentifier";
import PlantIdentifierScan from "./pages/PlantIdentifierScan";
import PlantIdentifierResult from "./pages/PlantIdentifierResult";
import DiseaseIdentifier from "./pages/DiseaseIdentifier";
import MushroomIdentifier from "./pages/MushroomIdentifier";
import WeedIdentifier from "./pages/WeedIdentifier";
import ToxicityIdentifier from "./pages/ToxicityIdentifier";
import TreeIdentifier from "./pages/TreeIdentifier";
import WaterMeter from "./pages/WaterMeter";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const RouterComponent = Capacitor.isNativePlatform() ? HashRouter : BrowserRouter;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RouterComponent>
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/home" element={<Home />} />
            <Route path="/ar" element={<Index />} />
            <Route path="/gallery" element={<ARPhotoGallery />} />
            <Route path="/garden" element={<MyGarden />} />
            <Route path="/botanist" element={<AskBotanist />} />
            <Route path="/iot" element={<IoTSensors />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/plant-identifier" element={<PlantIdentifier />} />
            <Route path="/plant-identifier/scan" element={<PlantIdentifierScan />} />
            <Route path="/plant-identifier/result" element={<PlantIdentifierResult />} />
            <Route path="/disease" element={<DiseaseIdentifier />} />
            <Route path="/mushroom" element={<MushroomIdentifier />} />
            <Route path="/weed" element={<WeedIdentifier />} />
            <Route path="/toxicity" element={<ToxicityIdentifier />} />
            <Route path="/tree" element={<TreeIdentifier />} />
            <Route path="/water" element={<WaterMeter />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </RouterComponent>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
