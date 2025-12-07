import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Share2, Trash2, Camera, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ARPhoto {
  name: string;
  uri: string;
  data: string;
}

const ARPhotoGallery = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [photos, setPhotos] = useState<ARPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<ARPhoto | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<ARPhoto | null>(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    setLoading(true);
    try {
      // List all files in Documents directory
      const result = await Filesystem.readdir({
        path: '',
        directory: Directory.Documents,
      });

      // Filter for greengrow AR photos
      const arPhotoFiles = result.files.filter(file => 
        file.name.startsWith('greengrow-ar-') && file.name.endsWith('.jpg')
      );

      // Load each photo
      const loadedPhotos: ARPhoto[] = [];
      for (const file of arPhotoFiles) {
        try {
          const content = await Filesystem.readFile({
            path: file.name,
            directory: Directory.Documents,
          });
          
          loadedPhotos.push({
            name: file.name,
            uri: file.uri,
            data: `data:image/jpeg;base64,${content.data}`,
          });
        } catch (error) {
          console.error(`Error loading photo ${file.name}:`, error);
        }
      }

      // Sort by timestamp (newest first)
      loadedPhotos.sort((a, b) => {
        const timeA = parseInt(a.name.replace('greengrow-ar-', '').replace('.jpg', ''));
        const timeB = parseInt(b.name.replace('greengrow-ar-', '').replace('.jpg', ''));
        return timeB - timeA;
      });

      setPhotos(loadedPhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
      toast({
        title: "Error Loading Photos",
        description: "Could not load your AR photos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (photo: ARPhoto) => {
    try {
      await Filesystem.deleteFile({
        path: photo.name,
        directory: Directory.Documents,
      });

      setPhotos(photos.filter(p => p.name !== photo.name));
      setDeleteDialogOpen(false);
      setPhotoToDelete(null);
      setSelectedPhoto(null);

      toast({
        title: "Photo Deleted",
        description: "Your AR photo has been removed.",
      });
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Delete Failed",
        description: "Could not delete the photo.",
        variant: "destructive",
      });
    }
  };

  const handleSharePhoto = async (photo: ARPhoto) => {
    try {
      // Write to cache for sharing
      const fileName = photo.name;
      const base64Data = photo.data.split(',')[1];

      const file = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache,
      });

      await Share.share({
        title: 'My AR Plant',
        text: 'Check out my plant in AR!',
        url: file.uri,
        dialogTitle: 'Share your AR plant',
      });

      toast({
        title: "Photo Shared! 🌱",
        description: "Your AR plant photo has been shared.",
      });
    } catch (error) {
      console.error('Error sharing photo:', error);
      toast({
        title: "Share Failed",
        description: "Could not share the photo.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (filename: string) => {
    const timestamp = parseInt(filename.replace('greengrow-ar-', '').replace('.jpg', ''));
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-3 sm:p-4 md:p-6 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto flex items-center gap-2 sm:gap-4">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            size="icon"
            className="hover:bg-primary-foreground/10 h-9 w-9 sm:h-10 sm:w-10"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
          <div className="flex items-center gap-2 sm:gap-3">
            <Camera className="w-6 h-6 sm:w-8 sm:h-8" />
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold">AR Photo Gallery</h1>
              <p className="text-xs sm:text-sm opacity-90">{photos.length} photo{photos.length !== 1 ? 's' : ''} captured</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4" />
            <p className="text-muted-foreground">Loading your photos...</p>
          </div>
        ) : photos.length === 0 ? (
          <Card className="p-6 sm:p-8 md:p-12 text-center">
            <ImageIcon className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl sm:text-2xl font-bold mb-2">No Photos Yet</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-6">
              Place a plant in AR and capture your first photo!
            </p>
            <Button onClick={() => navigate('/')} className="bg-primary hover:bg-primary/90">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Garden
            </Button>
          </Card>
        ) : (
          <>
            {/* Photo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {photos.map((photo) => (
                <Card
                  key={photo.name}
                  className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <div className="relative aspect-square">
                    <img
                      src={photo.data}
                      alt="AR Plant Photo"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSharePhoto(photo);
                        }}
                        className="bg-white hover:bg-white/90"
                      >
                        <Share2 className="w-5 h-5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPhotoToDelete(photo);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3 bg-card">
                    <p className="text-sm text-muted-foreground">
                      {formatDate(photo.name)}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Full Screen Photo View */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setSelectedPhoto(null)}
        >
          <Button
            onClick={() => setSelectedPhoto(null)}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>

          <img
            src={selectedPhoto.data}
            alt="AR Plant Photo"
            className="max-w-full max-h-full object-contain"
          />

          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleSharePhoto(selectedPhoto);
              }}
              className="flex-1 bg-white text-black hover:bg-white/90"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setPhotoToDelete(selectedPhoto);
                setDeleteDialogOpen(true);
              }}
              variant="destructive"
              className="flex-1"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Photo?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your AR plant photo from your device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPhotoToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => photoToDelete && handleDeletePhoto(photoToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ARPhotoGallery;
