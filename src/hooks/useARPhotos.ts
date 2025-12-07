import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getSession } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export interface ARPhoto {
  id: string;
  userId: string;
  imageUrl: string;
  plantName: string | null;
  caption: string | null;
  createdAt: string;
}

export function useARPhotos() {
  const [photos, setPhotos] = useState<ARPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = getSession();

  const fetchPhotos = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('ar_photos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setPhotos(data.map(p => ({
          id: p.id,
          userId: p.user_id,
          imageUrl: p.image_url,
          plantName: p.plant_name,
          caption: p.caption,
          createdAt: p.created_at,
        })));
      }
    } catch (error) {
      console.error('Error fetching AR photos:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const uploadPhoto = useCallback(async (
    imageBase64: string,
    plantName?: string,
    caption?: string
  ): Promise<ARPhoto | null> => {
    if (!user) return null;

    try {
      // Convert base64 to blob
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });

      // Upload to storage
      const fileName = `${user.id}/${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('ar-photos')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('ar-photos')
        .getPublicUrl(fileName);

      // Save to database
      const { data, error } = await supabase
        .from('ar_photos')
        .insert({
          user_id: user.id,
          image_url: publicUrl,
          plant_name: plantName || null,
          caption: caption || null,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newPhoto: ARPhoto = {
          id: data.id,
          userId: data.user_id,
          imageUrl: data.image_url,
          plantName: data.plant_name,
          caption: data.caption,
          createdAt: data.created_at,
        };

        setPhotos(prev => [newPhoto, ...prev]);

        toast({
          title: 'Na-save na! 📷',
          description: 'Ang AR photo ay na-save sa gallery mo!',
        });

        return newPhoto;
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: 'Error',
        description: 'Hindi ma-upload ang photo. Subukan ulit.',
        variant: 'destructive',
      });
    }
    return null;
  }, [user, toast]);

  const deletePhoto = useCallback(async (id: string) => {
    if (!user) return;

    try {
      const photo = photos.find(p => p.id === id);
      if (!photo) return;

      // Delete from storage
      const fileName = photo.imageUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('ar-photos')
          .remove([`${user.id}/${fileName}`]);
      }

      // Delete from database
      const { error } = await supabase
        .from('ar_photos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setPhotos(prev => prev.filter(p => p.id !== id));

      toast({
        title: 'Natanggal na! 🗑️',
        description: 'Ang photo ay natanggal sa gallery.',
      });
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  }, [user, photos, toast]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  return { photos, loading, uploadPhoto, deletePhoto, refetch: fetchPhotos };
}
