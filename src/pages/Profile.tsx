import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { signOut } from "@/lib/auth";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  LogOut,
  Camera,
  LeafyGreen,
  Sparkles,
  Languages
} from "lucide-react";
import { cn } from "@/lib/utils";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("🌱");

  const avatars = ["🌱", "🌿", "🌳", "🌺", "🌻", "🌷", "🌼", "🍀", "🌵", "🌴", "🌾", "🌸"];

  useEffect(() => {
    checkAuth();
    loadAvatar();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      navigate("/auth");
      return;
    }
    
    // Get username from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', session.user.id)
      .maybeSingle();
    
    setUsername(profile?.username || 'User');
    setLoading(false);
  };

  const loadAvatar = () => {
    const savedAvatar = localStorage.getItem('selectedAvatar');
    if (savedAvatar) {
      setSelectedAvatar(savedAvatar);
    }
  };

  const handleAvatarChange = (avatar: string) => {
    setSelectedAvatar(avatar);
    localStorage.setItem('selectedAvatar', avatar);
    
    // Dispatch custom event to notify other components (same tab)
    window.dispatchEvent(new Event('avatarChanged'));
    
    toast({
      title: language === "tagalog" ? "Nabago na! 🎉" : "Changed! 🎉",
      description: language === "tagalog" ? "Bagong avatar mo na!" : "Your new avatar!",
    });
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      
      // Use the signOut function from auth.ts which properly clears localStorage
      const { error } = await signOut();
      
      if (error) {
        toast({
          title: language === "tagalog" ? "May problema" : "Error",
          description: error.message || (language === "tagalog" ? "Hindi makapag-logout. Subukan ulit." : "Cannot logout. Please try again."),
          variant: "destructive",
        });
        setLogoutLoading(false);
        return;
      }

      // Clear any additional localStorage items
      localStorage.removeItem('selectedAvatar');
      
      // Show success message
      toast({
        title: language === "tagalog" ? "Paalam! 👋" : "Goodbye! 👋",
        description: language === "tagalog" ? "Salamat sa paggamit ng app!" : "Thanks for using the app!",
      });

      // Navigate immediately to auth page
      // The auth state listener in Home.tsx will also catch this and redirect if user is on Home page
      navigate("/auth", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: language === "tagalog" ? "May problema" : "Error",
        description: language === "tagalog" ? "Hindi makapag-logout. Subukan ulit." : "Cannot logout. Please try again.",
        variant: "destructive",
      });
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🌱</div>
          <p className="text-lg text-gray-600">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-yellow-50 to-pink-50 pb-24 safe-area-bottom">
      <div className="page-container py-6 section-spacing">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            {t("profile.title")}
          </h1>
        </div>

        {/* Avatar Section */}
        <Card className="card-spacing bg-gradient-to-br from-green-100 to-blue-100 border-2 border-green-200 shadow-large rounded-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-green-400 flex items-center justify-center text-5xl shadow-lg">
                {selectedAvatar}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 border-2 border-white">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{username}</h2>
              <p className="text-sm text-gray-600">Junior Gardener</p>
            </div>
          </div>

          {/* Avatar Selection */}
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">{t("profile.avatar")}</p>
            <div className="grid grid-cols-6 gap-2">
              {avatars.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => handleAvatarChange(avatar)}
                  className={cn(
                    "w-12 h-12 rounded-full text-2xl flex items-center justify-center transition-all",
                    "hover:scale-110 active:scale-95 border-2",
                    selectedAvatar === avatar
                      ? "bg-green-500 border-green-600 shadow-lg scale-110"
                      : "bg-white border-gray-200 hover:border-green-300"
                  )}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Language Selection */}
        <Card className="card-spacing bg-white border-2 border-purple-200 shadow-medium rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Languages className="w-5 h-5 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-800">{t("profile.language")}</h3>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setLanguage("tagalog")}
              className={cn(
                "flex-1 h-12",
                language === "tagalog"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              )}
            >
              {t("profile.tagalog")}
            </Button>
            <Button
              onClick={() => setLanguage("english")}
              className={cn(
                "flex-1 h-12",
                language === "english"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              )}
            >
              {t("profile.english")}
            </Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="card-spacing bg-white border-2 border-blue-200 shadow-medium rounded-2xl">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{t("profile.quickActions")}</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => navigate('/plant-identifier')}
              className="bg-green-600 hover:bg-green-700 text-white h-12"
            >
              <Camera className="w-4 h-4 mr-2" />
              {t("profile.identifyPlant")}
            </Button>
            <Button
              onClick={() => navigate('/garden')}
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-50 h-12"
            >
              <LeafyGreen className="w-4 h-4 mr-2" />
              {t("profile.myGarden")}
            </Button>
          </div>
        </Card>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          disabled={logoutLoading}
          className="w-full border-red-200 text-red-600 hover:bg-red-50 h-12 disabled:opacity-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {logoutLoading ? t("profile.loggingOut") : t("profile.logout")}
        </Button>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;
