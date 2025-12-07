import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sprout } from "lucide-react";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/auth");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-green-600 via-green-500 to-green-700 px-4 z-50">
      <div className="text-center animate-bounce">
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <div className="bg-white p-4 sm:p-6 rounded-full shadow-2xl">
            <Sprout className="w-16 h-16 sm:w-20 sm:h-20 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
          GreenGrow AR
        </h1>
        <p className="text-white/90 text-base sm:text-lg md:text-xl">
          Magtanim ng mga halaman sa iyong mundo!
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;