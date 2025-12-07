import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ScanStep = 'analyzing' | 'detecting' | 'identifying' | 'complete';

const PlantIdentifierScan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const imageData = location.state?.image;
  const mode = location.state?.mode || 'plant';
  
  const [currentStep, setCurrentStep] = useState<ScanStep>('analyzing');
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageData) {
      navigate('/plant-identifier');
      return;
    }

    performIdentification();
  }, [imageData]);

  const performIdentification = async () => {
    try {
      // Step 1: Analyzing image
      setCurrentStep('analyzing');
      await delay(1000);

      // Step 2: Detecting features
      setCurrentStep('detecting');
      await delay(1000);

      // Step 3: Identifying plant via AI edge function
      setCurrentStep('identifying');
      
      // Call the identify-plant edge function
      console.log('Calling identify-plant edge function with mode:', mode);
      
      const { data, error: fnError } = await supabase.functions.invoke('identify-plant', {
        body: { 
          image: imageData,
          mode: mode 
        }
      });

      console.log('Edge function response:', { data, error: fnError });

      if (fnError) {
        console.error('Edge function error:', fnError);
        throw new Error(fnError.message || 'Edge function error');
      }

      if (!data || data.error) {
        console.error('Data error:', data?.error);
        throw new Error(data?.error || 'Hindi ma-identify ang halaman');
      }

      // Transform result to match expected format
      const result = {
        name: data.name || 'Hindi Kilala',
        scientificName: data.scientificName || 'N/A',
        commonNames: data.commonNames || [],
        confidence: data.confidence || 0,
        description: data.description || '',
        careGuide: data.careGuide,
        poisonous: data.poisonous || false,
        edible: data.edible || false,
        category: data.category || mode,
        toxicityLevel: data.toxicityLevel,
        warningMessage: data.warningMessage,
        invasive: data.invasive,
        severity: data.severity
      };

      setCurrentStep('complete');
      setIsComplete(true);
      
      // Navigate to results after a brief delay
      setTimeout(() => {
        navigate('/plant-identifier/result', {
          state: {
            image: imageData,
            results: [result],
            mode: mode,
          },
        });
      }, 800);

    } catch (err: any) {
      console.error('Identification error:', err);
      setError(err.message || 'Hindi ma-identify ang halaman');
      toast({
        title: "Nabigo ang Identification",
        description: err.message || "Hindi ma-identify ang halaman. Subukan ulit.",
        variant: "destructive",
      });
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const steps: { id: ScanStep; label: string }[] = [
    { id: 'analyzing', label: 'Sinusuri ang larawan' },
    { id: 'detecting', label: 'Naghahanap ng halaman' },
    { id: 'identifying', label: 'Kinikilala gamit ang AI' },
  ];

  const getStepStatus = (stepId: ScanStep) => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    const stepIndex = steps.findIndex(s => s.id === stepId);
    
    if (stepIndex < currentIndex || (stepIndex === currentIndex && isComplete)) {
      return 'complete';
    }
    if (stepIndex === currentIndex) {
      return 'active';
    }
    return 'pending';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="bg-gray-900 border-gray-800 text-white p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Nabigo ang Identification</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Button
            onClick={() => navigate('/plant-identifier')}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Subukan Ulit
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Image Preview */}
        {imageData && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={imageData}
              alt="Halaman na i-identify"
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Scanning Info */}
        <Card className="bg-gray-900 border-gray-800 text-white p-8">
          <h1 className="text-3xl font-bold mb-2 text-center">Nag-scan para sayo</h1>
          <p className="text-gray-400 text-center mb-8">Sinusuri ang halaman gamit ang AI</p>

          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step) => {
              const status = getStepStatus(step.id);
              const isActive = status === 'active';
              const stepComplete = status === 'complete';

              return (
                <div
                  key={step.id}
                  className={`
                    flex items-center gap-3 p-4 rounded-lg transition-all
                    ${isActive ? 'bg-green-600/20 border-2 border-green-500' : 'bg-gray-800 border-2 border-transparent'}
                    ${stepComplete ? 'opacity-100' : isActive ? 'opacity-100' : 'opacity-60'}
                  `}
                >
                  {stepComplete ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  ) : isActive ? (
                    <Loader2 className="w-6 h-6 text-green-500 flex-shrink-0 animate-spin" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-500 flex-shrink-0" />
                  )}
                  <span
                    className={`
                      font-medium
                      ${isActive ? 'text-green-500' : stepComplete ? 'text-white' : 'text-gray-400'}
                    `}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PlantIdentifierScan;
