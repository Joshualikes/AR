import { useNavigate, useLocation } from "react-router-dom";
import { LayoutGrid, Sprout, Camera, Wifi, User } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: LayoutGrid,
      label: "Home",
      path: "/home",
    },
    {
      icon: Sprout,
      label: "My Garden",
      path: "/garden",
    },
    {
      icon: Camera,
      label: "Identify",
      path: "/plant-identifier",
      isPrimary: true,
    },
    {
      icon: Wifi,
      label: "IoT Sensors",
      path: "/iot",
    },
    {
      icon: User,
      label: "Profile",
      path: "/profile",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/home") {
      return location.pathname === "/home";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t-2 border-gray-200 shadow-large safe-area-bottom">
      <div className="max-w-md mx-auto px-3 py-3">
        <div className="flex items-center justify-around relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            if (item.isPrimary) {
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "relative flex flex-col items-center justify-center touch-target",
                    "w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-green-700 text-white",
                    "shadow-large transform transition-all duration-300",
                    "hover:scale-110 active:scale-95 hover:shadow-xl",
                    "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  )}
                  aria-label={item.label}
                >
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <Icon className="w-7 h-7" />
                </button>
              );
            }

            // Special handling for Home icon (green square with white grid)
            if (item.path === "/home") {
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex flex-col items-center justify-center touch-target",
                    "px-3 py-2 rounded-xl transition-all duration-200 min-w-[64px]",
                    "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
                    active 
                      ? "bg-green-600 shadow-medium" 
                      : "hover:bg-gray-50"
                  )}
                  aria-label={item.label}
                >
                  <div className={cn(
                    "w-6 h-6 mb-1.5 rounded-md border-2 transition-all",
                    active 
                      ? "bg-green-600 border-green-700 shadow-sm" 
                      : "bg-gray-300 border-gray-400"
                  )}>
                    <div className="w-full h-full grid grid-cols-3 gap-0.5 p-0.5">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className={cn(
                          "rounded-sm",
                          active ? "bg-white" : "bg-white/80"
                        )} />
                      ))}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-xs font-semibold transition-colors",
                      active ? "text-white" : "text-gray-500"
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center touch-target",
                  "px-3 py-2 rounded-xl transition-all duration-200 min-w-[64px]",
                  "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
                  active 
                    ? "text-green-600" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                )}
                aria-label={item.label}
              >
                <Icon className={cn(
                  "w-6 h-6 mb-1.5 transition-all",
                  active ? "text-green-600" : "text-gray-500"
                )} />
                <span
                  className={cn(
                    "text-xs font-semibold transition-colors",
                    active ? "text-green-600" : "text-gray-500"
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;

