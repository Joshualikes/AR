import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, Camera as CameraIcon, Flower2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WeedIdentifier = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const mode: 'weed' = 'weed';

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
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
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
        title: "Capture Failed",
        description: "Could not capture image. Please try again.",
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

        {/* Title */}
        <div className="absolute top-16 left-4 right-4 flex justify-center">
          <div className="bg-green-400/80 backdrop-blur-sm px-4 py-2 rounded-full">
            <div className="flex items-center gap-2 text-white">
              <Flower2 className="w-5 h-5" />
              <span className="font-semibold">Weed Identifier</span>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-white/10 px-4 py-3">
          <div className="flex items-center justify-center max-w-md mx-auto gap-4">
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

export default WeedIdentifier;

