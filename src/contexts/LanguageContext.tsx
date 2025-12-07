import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "tagalog" | "english";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  tagalog: {
    // Profile
    "profile.title": "Aking Profile",
    "profile.avatar": "Pumili ng Avatar:",
    "profile.quickActions": "Mabilis na Actions",
    "profile.identifyPlant": "Identify Plant",
    "profile.myGarden": "My Garden",
    "profile.logout": "Logout",
    "profile.loggingOut": "Naglo-logout...",
    "profile.language": "Wika",
    "profile.selectLanguage": "Pumili ng Wika",
    "profile.tagalog": "Tagalog",
    "profile.english": "English",
    "profile.juniorGardener": "Junior Gardener",
    
    // Home
    "home.goodDay": "Magandang araw,",
    "home.location": "Location",
    "home.temperature": "Temperature",
    "home.identifiedPlants": "Na-identify na Halaman",
    "home.savedGarden": "Naka-save sa Hardin",
    "home.myPlants": "Aking mga Halaman",
    "home.viewAll": "Tingnan Lahat",
    "home.noPlants": "Wala ka pang halaman",
    "home.noPlantsDesc": "Magsimula sa pag-identify ng halaman at i-save sa iyong hardin!",
    "home.identifyPlant": "Mag-identify ng Halaman",
    "home.tools": "Mga Kasangkapan",
    "home.plantIdentifier": "Plant Identifier",
    "home.waterMeter": "Water Meter",
    "home.kuyaBotanist": "Kuya Botanist",
    
    // Plant Identifier
    "plantIdentifier.identify": "Identify",
    "plantIdentifier.scanning": "Nag-scan para sayo",
    "plantIdentifier.analyzing": "Sinusuri ang halaman gamit ang AI",
    "plantIdentifier.analyzingImage": "Sinusuri ang larawan",
    "plantIdentifier.detecting": "Naghahanap ng halaman",
    "plantIdentifier.identifying": "Kinikilala gamit ang AI",
    "plantIdentifier.failed": "Nabigo ang Identification",
    "plantIdentifier.tryAgain": "Subukan Ulit",
    "plantIdentifier.cameraError": "Camera Error",
    "plantIdentifier.cameraPermission": "Could not access camera. Please check permissions.",
    "plantIdentifier.captureFailed": "Capture Failed",
    "plantIdentifier.captureError": "Could not capture image. Please try again.",
    
    // Plant Identifier Result
    "result.overview": "Pangkalahatang-tanaw",
    "result.notes": "Mga Tala",
    "result.info": "Impormasyon",
    "result.careGuide": "Gabay sa Pag-aalaga",
    "result.plantNotes": "Mga Tala ng Halaman",
    "result.noNotes": "Walang karagdagang tala para sa halamann ito.",
    "result.otherNames": "Iba pang mga Pangalan:",
    "result.confidence": "Kumpiyansa ng Pagkilala",
    "result.match": "tugma",
    "result.alternativeMatches": "Iba pang Posibleng Tugma",
    "result.learnMore": "Matuto Pa",
    "result.saveGarden": "I-save sa Hardin",
    "result.saved": "Na-save na",
    "result.saving": "Nag-se-save...",
    "result.water": "Tubig",
    "result.sun": "Araw",
    "result.temp": "Temperatura",
    "result.soil": "Lupa",
    "result.unlock": "I-unlock ng Libre",
    "result.poisonous": "May lason",
    "result.unlockBtn": "I-unlock",
    "result.noResults": "Walang nahanap na resulta",
    "result.defaultDescription": "{name} ({scientificName}) ay isang magandang halaman na pwedeng magpaganda sa anumang espasyo.",
    "result.unknown": "Hindi Kilala",
    "result.notAPlant": "Hindi Halaman",
    "result.identifiedPlants": "Na-identify na Halaman",
    "result.cannotSeePlant": "Hindi ko makita ang halaman sa larawan. Subukan ulit ng malinaw na picture ng halaman.",
    
    // IoT Sensors
    "iot.title": "IoT Sensors",
    "iot.subtitle": "View live readings from connected sensors",
    "iot.soilMoisture": "Current Soil Moisture",
    "iot.moisture": "Moisture",
    "iot.moistureTrend": "Moisture Trend (last 20 readings)",
    "iot.lastUpdated": "Last updated:",
    
    // My Garden
    "garden.title": "Aking Hardin",
    "garden.noPlants": "Walang Halaman Pa",
    "garden.noPlantsDesc": "Walang halaman pa sa iyong hardin.",
    "garden.noPlantsSubtext": "Mag-simula sa pamamagitan ng pag-identify ng halaman!",
    "garden.identifyPlant": "Mag-identify ng Halaman",
    "garden.wateringAlert": "💧 Kailangan Diligan ang Halaman!",
    "garden.wateringAlertDesc": "May {count} halaman na kailangan ng tubig (24 oras na ang nakalipas mula nang huling diligan).",
    "garden.planted": "Itinanim:",
    "garden.lastWatered": "Huling diligan:",
    "garden.hoursAgo": "oras na ang nakalipas",
    "garden.waterNow": "Diligan Ngayon!",
    "garden.water": "Diligan",
    "garden.needsWater": "Kailangan ng tubig!",
    "garden.waterAgain": "Diligan ulit sa {hours} oras",
    "garden.confirmDelete": "Sigurado ka bang gusto mong tanggalin ang \"{name}\"?",
    "garden.notYet": "Hindi pa",
    "garden.growthStage.seed": "Binhi 🌱",
    "garden.growthStage.sprouting": "Tumutubo 🌿",
    "garden.growthStage.growing": "Lumalaki 🪴",
    "garden.growthStage.big": "Malaki na 🌳",
    "garden.growthStage.ready": "Handang Anihin 🥬",
    "garden.notificationTitle": "💧 Kailangan Diligan ang Halaman!",
    "garden.notificationBody": "May {count} halaman na kailangan ng tubig.",
    
    // Bottom Nav
    "nav.home": "Home",
    "nav.garden": "My Garden",
    "nav.identify": "Identify",
    "nav.iot": "IoT Sensors",
    "nav.profile": "Profile",
    
    // Common
    "common.loading": "Naglo-load...",
    "common.save": "I-save",
    "common.cancel": "Kanselahin",
    "common.close": "Isara",
    "common.error": "May problema",
    "common.tryAgain": "Subukan ulit",
  },
  english: {
    // Profile
    "profile.title": "My Profile",
    "profile.avatar": "Choose Avatar:",
    "profile.quickActions": "Quick Actions",
    "profile.identifyPlant": "Identify Plant",
    "profile.myGarden": "My Garden",
    "profile.logout": "Logout",
    "profile.loggingOut": "Logging out...",
    "profile.language": "Language",
    "profile.selectLanguage": "Select Language",
    "profile.tagalog": "Tagalog",
    "profile.english": "English",
    "profile.juniorGardener": "Junior Gardener",
    
    // Home
    "home.goodDay": "Good day,",
    "home.location": "Location",
    "home.temperature": "Temperature",
    "home.identifiedPlants": "Identified Plants",
    "home.savedGarden": "Saved to Garden",
    "home.myPlants": "My Plants",
    "home.viewAll": "View All",
    "home.noPlants": "No plants yet",
    "home.noPlantsDesc": "Start by identifying a plant and save it to your garden!",
    "home.identifyPlant": "Identify Plant",
    "home.tools": "Tools",
    "home.plantIdentifier": "Plant Identifier",
    "home.waterMeter": "Water Meter",
    "home.kuyaBotanist": "Kuya Botanist",
    
    // Plant Identifier
    "plantIdentifier.identify": "Identify",
    "plantIdentifier.scanning": "Scanning for you",
    "plantIdentifier.analyzing": "Analyzing plant using AI",
    "plantIdentifier.analyzingImage": "Analyzing image",
    "plantIdentifier.detecting": "Detecting plant",
    "plantIdentifier.identifying": "Identifying using AI",
    "plantIdentifier.failed": "Identification Failed",
    "plantIdentifier.tryAgain": "Try Again",
    "plantIdentifier.cameraError": "Camera Error",
    "plantIdentifier.cameraPermission": "Could not access camera. Please check permissions.",
    "plantIdentifier.captureFailed": "Capture Failed",
    "plantIdentifier.captureError": "Could not capture image. Please try again.",
    
    // Plant Identifier Result
    "result.overview": "Overview",
    "result.notes": "Notes",
    "result.info": "Information",
    "result.careGuide": "Care Guide",
    "result.plantNotes": "Plant Notes",
    "result.noNotes": "No additional notes for this plant.",
    "result.otherNames": "Other Names:",
    "result.confidence": "Identification Confidence",
    "result.match": "match",
    "result.alternativeMatches": "Other Possible Matches",
    "result.learnMore": "Learn More",
    "result.saveGarden": "Save to Garden",
    "result.saved": "Saved",
    "result.saving": "Saving...",
    "result.water": "Water",
    "result.sun": "Sun",
    "result.temp": "Temperature",
    "result.soil": "Soil",
    "result.unlock": "Unlock for Free",
    "result.poisonous": "Poisonous",
    "result.unlockBtn": "Unlock",
    "result.noResults": "No results found",
    "result.defaultDescription": "{name} ({scientificName}) is a beautiful plant that can beautify any space.",
    "result.unknown": "Unknown",
    "result.notAPlant": "Not a Plant",
    "result.identifiedPlants": "Identified Plants",
    "result.cannotSeePlant": "I cannot see the plant in the image. Please try again with a clear picture of the plant.",
    
    // IoT Sensors
    "iot.title": "IoT Sensors",
    "iot.subtitle": "View live readings from connected sensors",
    "iot.soilMoisture": "Current Soil Moisture",
    "iot.moisture": "Moisture",
    "iot.moistureTrend": "Moisture Trend (last 20 readings)",
    "iot.lastUpdated": "Last updated:",
    
    // My Garden
    "garden.title": "My Garden",
    "garden.noPlants": "No Plants Yet",
    "garden.noPlantsDesc": "You don't have any plants in your garden yet.",
    "garden.noPlantsSubtext": "Start by identifying a plant!",
    "garden.identifyPlant": "Identify Plant",
    "garden.wateringAlert": "💧 Plants Need Watering!",
    "garden.wateringAlertDesc": "You have {count} plants that need water (24 hours have passed since last watering).",
    "garden.planted": "Planted:",
    "garden.lastWatered": "Last watered:",
    "garden.hoursAgo": "hours ago",
    "garden.waterNow": "Water Now!",
    "garden.water": "Water",
    "garden.needsWater": "Needs water!",
    "garden.waterAgain": "Water again in {hours} hours",
    "garden.confirmDelete": "Are you sure you want to delete \"{name}\"?",
    "garden.notYet": "Not yet",
    "garden.growthStage.seed": "Seed 🌱",
    "garden.growthStage.sprouting": "Sprouting 🌿",
    "garden.growthStage.growing": "Growing 🪴",
    "garden.growthStage.big": "Big 🌳",
    "garden.growthStage.ready": "Ready to Harvest 🥬",
    "garden.notificationTitle": "💧 Plants Need Watering!",
    "garden.notificationBody": "You have {count} plants that need water.",
    
    // Bottom Nav
    "nav.home": "Home",
    "nav.garden": "My Garden",
    "nav.identify": "Identify",
    "nav.iot": "IoT Sensors",
    "nav.profile": "Profile",
    
    // Common
    "common.loading": "Loading...",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.close": "Close",
    "common.error": "Error",
    "common.tryAgain": "Try again",
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Load from localStorage or default to tagalog
    const saved = localStorage.getItem("appLanguage") as Language;
    return saved || "tagalog";
  });

  useEffect(() => {
    // Save to localStorage when language changes
    localStorage.setItem("appLanguage", language);
    // Dispatch event for other components to listen
    window.dispatchEvent(new Event("languageChanged"));
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

