import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, Camera as CameraIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

type IdentifierMode = 'plant';

const PlantIdentifier = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mode] = useState<IdentifierMode>('plant');
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    startCamera();
    
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (error) {
      console.error('Camera error:', error);
      toast({
        title: t("plantIdentifier.cameraError"),
        description: t("plantIdentifier.cameraPermission"),
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || isCapturing) return;

    setIsCapturing(true);
    
    try {
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      
      canvas.width = video.videoWidth || 1920;
      canvas.height = video.videoHeight || 1080;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsCapturing(false);
        return;
      }
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      
      // Navigate to scanning screen with image
      navigate('/plant-identifier/scan', { 
        state: { 
          image: imageData,
          mode: mode 
        } 
      });
    } catch (error) {
      console.error('Capture error:', error);
      toast({
        title: t("plantIdentifier.captureFailed"),
        description: t("plantIdentifier.captureError"),
        variant: "destructive",
      });
    } finally {
      setIsCapturing(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black z-50 pb-20">
      {/* Top Status Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm px-4 py-2 text-white text-xs flex justify-between items-center">
        <span>{new Date().toLocaleTimeString('en-US', { hour12: false })}</span>
        <div className="flex items-center gap-1">
          <span>0.96 KB/S</span>
          <span>•</span>
          <span>Vo LTE</span>
          <span className="ml-2">63%</span>
        </div>
      </div>

      {/* Close Button */}
      <Button
        onClick={() => navigate('/home')}
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-20 bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-black/70"
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Camera View */}
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Overlay Frame */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full max-w-sm mx-4">
            <div className="relative">
              {/* Corner brackets */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-white" />
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-white" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-white" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-white" />
              
              {/* Center indicator */}
              <div className="w-full aspect-square border-2 border-white/30 rounded-lg" />
            </div>
          </div>
        </div>


        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-white/10 px-4 py-3">
          <div className="flex items-center justify-center max-w-md mx-auto">
            {/* Camera Shutter Button */}
            <button
              onClick={capturePhoto}
              disabled={isCapturing}
              className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 shadow-lg flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50"
            >
              <CameraIcon className="w-8 h-8 text-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantIdentifier;

