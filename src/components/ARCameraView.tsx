import { useState, useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Camera, CheckCircle, Hand, Share2, Download } from "lucide-react";
import { Plant } from "@/types/plant";
import { initializeARSession, requestCameraPermission, placeObjectInAR, ARPlacement } from "@/lib/ar-utils";
import { useToast } from "@/hooks/use-toast";
import { Plant3D } from "./Plant3D";
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

interface ARCameraViewProps {
  plant: Plant;
  onClose: () => void;
  onPlacementConfirmed: (placement: ARPlacement) => void;
}

export const ARCameraView = ({ plant, onClose, onPlacementConfirmed }: ARCameraViewProps) => {
  const { toast } = useToast();
  const [isARReady, setIsARReady] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  const [placement, setPlacement] = useState<ARPlacement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Gesture tracking
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
  const [lastTouchPos, setLastTouchPos] = useState<{ x: number; y: number } | null>(null);
  const [initialTwoFingerCenter, setInitialTwoFingerCenter] = useState<{ x: number; y: number } | null>(null);
  
  // Photo capture
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    initializeAR();
    
    return () => {
      // Cleanup camera stream
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeAR = async () => {
    try {
      // Request camera permission
      const hasPermission = await requestCameraPermission();
      
      if (!hasPermission) {
        toast({
          title: "Camera Permission Denied",
          description: "Please enable camera access to use AR features.",
          variant: "destructive",
        });
        return;
      }

      // Initialize AR session
      const arInitialized = await initializeARSession();
      
      if (arInitialized) {
        setIsARReady(true);
        startCameraStream();
        
        toast({
          title: "AR Camera Ready! 📸",
          description: "Tap on a flat surface to place your plant.",
        });
      }
    } catch (error) {
      console.error("AR initialization error:", error);
      toast({
        title: "AR Not Available",
        description: "Your device may not support AR features.",
        variant: "destructive",
      });
    }
  };

  const startCameraStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera stream error:", error);
    }
  };

  const handleScreenTap = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isARReady || isPlacing) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    // Convert screen coordinates to AR world coordinates
    const worldPosition = {
      x: (x / rect.width) * 2 - 1,
      y: -((y / rect.height) * 2 - 1),
      z: -1.5, // Default depth
    };

    const newPlacement = placeObjectInAR(worldPosition, plant.type);
    setPlacement(newPlacement);
    setIsPlacing(true);

    toast({
      title: "Plant Placed! 🌱",
      description: "Use gestures to adjust - drag to rotate, pinch to scale, two fingers to move.",
    });
  };

  const getTouchDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchCenter = (touch1: React.Touch, touch2: React.Touch) => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!placement) return;
    
    e.preventDefault();
    
    if (e.touches.length === 1) {
      // Single finger - rotation
      setLastTouchPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2) {
      // Two fingers - scale and reposition
      const distance = getTouchDistance(e.touches[0], e.touches[1]);
      const center = getTouchCenter(e.touches[0], e.touches[1]);
      setLastTouchDistance(distance);
      setInitialTwoFingerCenter(center);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!placement) return;
    
    e.preventDefault();

    if (e.touches.length === 1 && lastTouchPos) {
      // Single finger drag - rotate
      const deltaX = e.touches[0].clientX - lastTouchPos.x;
      const rotationSpeed = 0.01;
      
      setPlacement({
        ...placement,
        rotation: placement.rotation + deltaX * rotationSpeed,
      });
      
      setLastTouchPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2 && lastTouchDistance && initialTwoFingerCenter) {
      // Two fingers - scale and reposition
      const distance = getTouchDistance(e.touches[0], e.touches[1]);
      const center = getTouchCenter(e.touches[0], e.touches[1]);
      
      // Scale based on pinch distance
      const scaleChange = distance / lastTouchDistance;
      const newScale = Math.max(0.5, Math.min(3, placement.scale * scaleChange));
      
      // Reposition based on two-finger drag
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const deltaX = (center.x - initialTwoFingerCenter.x) / rect.width;
        const deltaY = (center.y - initialTwoFingerCenter.y) / rect.height;
        
        setPlacement({
          ...placement,
          x: placement.x + deltaX * 2,
          y: placement.y - deltaY * 2,
          scale: newScale,
        });
      }
      
      setLastTouchDistance(distance);
      setInitialTwoFingerCenter(center);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    setLastTouchPos(null);
    setLastTouchDistance(null);
    setInitialTwoFingerCenter(null);
  };

  const confirmPlacement = () => {
    if (placement) {
      onPlacementConfirmed(placement);
      toast({
        title: "Placement Confirmed! ✅",
        description: `Your ${plant.name} is now growing in AR!`,
      });
      onClose();
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !captureCanvasRef.current) return;

    const video = videoRef.current;
    const canvas = captureCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth || 1920;
    canvas.height = video.videoHeight || 1080;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Capture the 3D plant canvas if placement exists
    if (placement && canvasRef.current) {
      const plantCanvas = document.querySelector('canvas:last-of-type') as HTMLCanvasElement;
      if (plantCanvas) {
        // Draw the 3D plant overlay centered
        const plantWidth = 600;
        const plantHeight = 600;
        const x = (canvas.width - plantWidth) / 2;
        const y = (canvas.height - plantHeight) / 2;
        ctx.drawImage(plantCanvas, x, y, plantWidth, plantHeight);
      }
    }

    // Convert to base64
    const photoData = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedPhoto(photoData);

    toast({
      title: "Photo Captured! 📸",
      description: "Your AR plant photo is ready!",
    });
  };

  const savePhoto = async () => {
    if (!capturedPhoto) return;

    try {
      const base64Data = capturedPhoto.split(',')[1];
      const fileName = `greengrow-ar-${Date.now()}.jpg`;

      await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Documents,
      });

      toast({
        title: "Photo Saved! 💾",
        description: "Your AR plant photo has been saved to your device.",
      });

      setCapturedPhoto(null);
    } catch (error) {
      console.error('Error saving photo:', error);
      toast({
        title: "Save Failed",
        description: "Could not save photo to device.",
        variant: "destructive",
      });
    }
  };

  const sharePhoto = async () => {
    if (!capturedPhoto) return;

    try {
      const base64Data = capturedPhoto.split(',')[1];
      const fileName = `greengrow-ar-${Date.now()}.jpg`;

      // Write to cache directory for sharing
      const file = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache,
      });

      await Share.share({
        title: 'My AR Plant',
        text: `Check out my ${plant.name} in AR!`,
        url: file.uri,
        dialogTitle: 'Share your AR plant',
      });

      setCapturedPhoto(null);
    } catch (error) {
      console.error('Error sharing photo:', error);
      toast({
        title: "Share Failed",
        description: "Could not share photo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Hidden canvas for photo capture */}
      <canvas ref={captureCanvasRef} className="hidden" />

      {/* Captured Photo Preview */}
      {capturedPhoto && (
        <div className="absolute inset-0 z-50 bg-black flex items-center justify-center">
          <img 
            src={capturedPhoto} 
            alt="Captured AR Plant" 
            className="max-w-full max-h-full object-contain"
          />
          
          <div className="absolute top-4 left-4 right-4">
            <Button
              onClick={() => setCapturedPhoto(null)}
              variant="outline"
              size="icon"
              className="bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-black/70"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex gap-3">
            <Button
              onClick={savePhoto}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <Download className="w-5 h-5 mr-2" />
              Save to Device
            </Button>
            <Button
              onClick={sharePhoto}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share
            </Button>
          </div>
        </div>
      )}

      {/* Camera View */}
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* AR Canvas Overlay */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          onTouchStart={placement ? handleTouchStart : handleScreenTap}
          onTouchMove={placement ? handleTouchMove : undefined}
          onTouchEnd={placement ? handleTouchEnd : undefined}
          onClick={!placement ? handleScreenTap : undefined}
        />

        {/* AR Plant Preview - 3D Model */}
        {placement && (
          <div 
            className="absolute pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '300px',
              height: '300px',
            }}
          >
            <Canvas camera={{ position: [0, 1, 2], fov: 50 }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} />
                <pointLight position={[-5, 5, -5]} intensity={0.6} />
                <Plant3D 
                  stage={plant.stage}
                  plantType={plant.type}
                  autoRotate={false} 
                  scale={placement.scale * 2}
                  rotation={placement.rotation}
                />
              </Suspense>
            </Canvas>
          </div>
        )}

        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={onClose}
              variant="outline"
              size="icon"
              className="bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-black/70"
            >
              <X className="w-6 h-6" />
            </Button>

            <Card className="bg-black/50 backdrop-blur-sm border-white/20 px-4 py-2">
              <div className="flex items-center gap-2 text-white">
                <Camera className="w-5 h-5" />
                <span className="font-semibold">{plant.name}</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        {!placement && isARReady && (
          <div className="absolute top-24 left-0 right-0 flex justify-center px-4">
            <Card className="bg-black/70 backdrop-blur-md border-white/20 px-6 py-4 max-w-md">
              <div className="flex items-start gap-3 text-white">
                <Hand className="w-6 h-6 mt-1 flex-shrink-0 animate-wiggle" />
                <div>
                  <p className="font-semibold mb-1">Find a flat surface</p>
                  <p className="text-sm opacity-90">
                    Tap on the ground or table to place your plant
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Gesture Instructions */}
        {placement && (
          <div className="absolute top-24 left-0 right-0 flex justify-center px-4">
            <Card className="bg-black/70 backdrop-blur-md border-white/20 px-4 py-3 max-w-md">
              <div className="text-white text-sm space-y-1">
                <p>🔄 <span className="font-semibold">Drag</span> to rotate</p>
                <p>🤏 <span className="font-semibold">Pinch</span> to scale</p>
                <p>✌️ <span className="font-semibold">Two fingers</span> to move</p>
              </div>
            </Card>
          </div>
        )}

        {/* Camera Capture Button */}
        {placement && !capturedPhoto && (
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2">
            <Button
              onClick={capturePhoto}
              size="icon"
              className="w-16 h-16 rounded-full bg-white hover:bg-white/90 shadow-lg"
            >
              <Camera className="w-8 h-8 text-black" />
            </Button>
          </div>
        )}

        {/* Bottom Controls */}
        {placement && !capturedPhoto && (
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setPlacement(null);
                  setIsPlacing(false);
                }}
                variant="outline"
                className="flex-1 bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-black/70"
              >
                Reposition
              </Button>
              
              <Button
                onClick={confirmPlacement}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Confirm Placement
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {!isARReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <Card className="bg-black/70 backdrop-blur-md border-white/20 p-8">
              <div className="text-center text-white">
                <Camera className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                <h3 className="text-xl font-bold mb-2">Initializing AR...</h3>
                <p className="text-sm opacity-90">
                  Please allow camera access
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* AR Plane Indicator (visual feedback) */}
        {isARReady && !placement && (
          <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2">
            <div className="w-32 h-32 border-4 border-dashed border-white/50 rounded-full animate-pulse flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
