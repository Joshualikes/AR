import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserPlant {
  id: string;
  userId: string;
  plantName: string;
  plantType: string;
  growthStage: number;
  healthPercentage: number;
  lastWatered: string | null;
  lastFertilized: string | null;
  plantedAt: string;
  harvestDate: string | null;
  notes: string | null;
  imageUrl: string | null;
}

export interface PlantIdentification {
  id: string;
  imageUrl: string | null;
  identifiedPlant: string;
  confidence: number | null;
  details: Record<string, any> | null;
  createdAt: string;
}

export function useUserPlants() {
  const [plants, setPlants] = useState<UserPlant[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  // Get user session on mount and listen for changes
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    };
    
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchPlants = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching plants for user:', userId);
      const { data, error } = await supabase
        .from('user_plants')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching plants:', error);
        throw error;
      }

      console.log('Fetched plants:', data);
      if (data) {
        setPlants(data.map(p => ({
          id: p.id,
          userId: p.user_id,
          plantName: p.plant_name,
          plantType: p.plant_type,
          growthStage: p.growth_stage,
          healthPercentage: p.health_percentage,
          lastWatered: p.last_watered,
          lastFertilized: p.last_fertilized,
          plantedAt: p.planted_at,
          harvestDate: p.harvest_date,
          notes: p.notes,
          imageUrl: p.image_url,
        })));
      }
    } catch (error) {
      console.error('Error fetching plants:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addPlant = useCallback(async (plant: Omit<UserPlant, 'id' | 'userId'>) => {
    if (!userId) {
      console.error('No user ID available for adding plant');
      toast({
        title: 'Error',
        description: 'Kailangan mong mag-login muna.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      console.log('Adding plant for user:', userId, plant);
      const { data, error } = await supabase
        .from('user_plants')
        .insert({
          user_id: userId,
          plant_name: plant.plantName,
          plant_type: plant.plantType,
          growth_stage: plant.growthStage,
          health_percentage: plant.healthPercentage,
          last_watered: plant.lastWatered,
          last_fertilized: plant.lastFertilized,
          planted_at: plant.plantedAt,
          harvest_date: plant.harvestDate,
          notes: plant.notes,
          image_url: plant.imageUrl,
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting plant:', error);
        throw error;
      }

      console.log('Plant added successfully:', data);
      if (data) {
        const newPlant: UserPlant = {
          id: data.id,
          userId: data.user_id,
          plantName: data.plant_name,
          plantType: data.plant_type,
          growthStage: data.growth_stage,
          healthPercentage: data.health_percentage,
          lastWatered: data.last_watered,
          lastFertilized: data.last_fertilized,
          plantedAt: data.planted_at,
          harvestDate: data.harvest_date,
          notes: data.notes,
          imageUrl: data.image_url,
        };

        setPlants(prev => [newPlant, ...prev]);
        
        toast({
          title: 'Halaman Na-save! 🌱',
          description: `"${plant.plantName}" ay nasa iyong hardin na!`,
        });

        return newPlant;
      }
    } catch (error: any) {
      console.error('Error adding plant:', error);
      toast({
        title: 'Error',
        description: error?.message || 'Hindi ma-save ang halaman. Subukan ulit.',
        variant: 'destructive',
      });
    }
    return null;
  }, [userId, toast]);

  const updatePlant = useCallback(async (id: string, updates: Partial<UserPlant>) => {
    if (!userId) return;

    try {
      const dbUpdates: Record<string, any> = {};
      if (updates.plantName) dbUpdates.plant_name = updates.plantName;
      if (updates.growthStage) dbUpdates.growth_stage = updates.growthStage;
      if (updates.healthPercentage) dbUpdates.health_percentage = updates.healthPercentage;
      if (updates.lastWatered !== undefined) dbUpdates.last_watered = updates.lastWatered;
      if (updates.lastFertilized !== undefined) dbUpdates.last_fertilized = updates.lastFertilized;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

      const { error } = await supabase
        .from('user_plants')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      setPlants(prev => prev.map(p => 
        p.id === id ? { ...p, ...updates } : p
      ));
    } catch (error) {
      console.error('Error updating plant:', error);
    }
  }, [userId]);

  const waterPlant = useCallback(async (id: string) => {
    await updatePlant(id, { lastWatered: new Date().toISOString() });
    toast({
      title: 'Nadiligan na! 💧',
      description: 'Masaya ang iyong halaman!',
    });
  }, [updatePlant, toast]);

  const deletePlant = useCallback(async (id: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('user_plants')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      setPlants(prev => prev.filter(p => p.id !== id));
      
      toast({
        title: 'Natanggal na! 🗑️',
        description: 'Ang halaman ay natanggal sa iyong hardin.',
      });
    } catch (error) {
      console.error('Error deleting plant:', error);
    }
  }, [userId, toast]);

  useEffect(() => {
    if (userId) {
      fetchPlants();
    }
  }, [userId, fetchPlants]);

  return { plants, loading, addPlant, updatePlant, waterPlant, deletePlant, refetch: fetchPlants };
}

export function usePlantIdentifications() {
  const [identifications, setIdentifications] = useState<PlantIdentification[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Get user session on mount and listen for changes
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    };
    
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchIdentifications = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      // Fetch the identifications list (limited for display)
      const { data, error } = await supabase
        .from('plant_identifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      if (data) {
        setIdentifications(data.map(p => ({
          id: p.id,
          imageUrl: p.image_url,
          identifiedPlant: p.identified_plant,
          confidence: p.confidence ? Number(p.confidence) : null,
          details: p.details as Record<string, any> | null,
          createdAt: p.created_at,
        })));
      }

      // Fetch the total count
      const { count, error: countError } = await supabase
        .from('plant_identifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (countError) throw countError;
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching identifications:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const saveIdentification = useCallback(async (
    identifiedPlant: string,
    confidence: number,
    details: Record<string, any>,
    imageUrl?: string
  ) => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('plant_identifications')
        .insert({
          user_id: userId,
          identified_plant: identifiedPlant,
          confidence,
          details,
          image_url: imageUrl,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newIdentification: PlantIdentification = {
          id: data.id,
          imageUrl: data.image_url,
          identifiedPlant: data.identified_plant,
          confidence: data.confidence ? Number(data.confidence) : null,
          details: data.details as Record<string, any> | null,
          createdAt: data.created_at,
        };

        setIdentifications(prev => [newIdentification, ...prev]);
        setTotalCount(prev => prev + 1);
        return newIdentification;
      }
    } catch (error) {
      console.error('Error saving identification:', error);
    }
    return null;
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchIdentifications();
    }
  }, [userId, fetchIdentifications]);

  return { identifications, totalCount, loading, saveIdentification, refetch: fetchIdentifications };
}
