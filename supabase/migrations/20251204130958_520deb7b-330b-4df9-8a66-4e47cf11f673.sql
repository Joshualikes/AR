-- User Garden Plants Table
CREATE TABLE public.user_plants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plant_name TEXT NOT NULL,
  plant_type TEXT NOT NULL,
  growth_stage INTEGER NOT NULL DEFAULT 1,
  health_percentage INTEGER NOT NULL DEFAULT 100,
  last_watered TIMESTAMP WITH TIME ZONE,
  last_fertilized TIMESTAMP WITH TIME ZONE,
  planted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  harvest_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User Progress/Gamification Table
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  total_stars INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  experience_points INTEGER NOT NULL DEFAULT 0,
  plants_harvested INTEGER NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Achievements/Badges Table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_tagalog TEXT NOT NULL,
  description TEXT NOT NULL,
  description_tagalog TEXT NOT NULL,
  icon TEXT NOT NULL,
  stars_required INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User Achievements (Junction Table)
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Daily Tasks Table
CREATE TABLE public.daily_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL,
  task_description TEXT NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  stars_reward INTEGER NOT NULL DEFAULT 1,
  task_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AR Photos Table
CREATE TABLE public.ar_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  plant_name TEXT,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Chat History for Ask Botanist
CREATE TABLE public.chat_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Plant Identifications History
CREATE TABLE public.plant_identifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  image_url TEXT,
  identified_plant TEXT NOT NULL,
  confidence DECIMAL(5,2),
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ar_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plant_identifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_plants
CREATE POLICY "Users can view their own plants" ON public.user_plants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own plants" ON public.user_plants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own plants" ON public.user_plants FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own plants" ON public.user_plants FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_progress
CREATE POLICY "Users can view their own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for achievements (public read)
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (true);

-- RLS Policies for user_achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can earn achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for daily_tasks
CREATE POLICY "Users can view their own tasks" ON public.daily_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own tasks" ON public.daily_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON public.daily_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON public.daily_tasks FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for ar_photos
CREATE POLICY "Users can view their own photos" ON public.ar_photos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upload their own photos" ON public.ar_photos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own photos" ON public.ar_photos FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for chat_history
CREATE POLICY "Users can view their own chat" ON public.chat_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create chat messages" ON public.chat_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for plant_identifications
CREATE POLICY "Users can view their identifications" ON public.plant_identifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create identifications" ON public.plant_identifications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_user_plants_updated_at BEFORE UPDATE ON public.user_plants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON public.user_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Insert default achievements
INSERT INTO public.achievements (name, name_tagalog, description, description_tagalog, icon, stars_required) VALUES
('Baguhan', 'Baguhan', 'Started your gardening journey', 'Nagsimula sa pagtatanim', '🌱', 0),
('Unang Tanim', 'Unang Tanim', 'Planted your first seed', 'Nagtanim ng unang binhi', '🌿', 5),
('Masipag na Hardinero', 'Masipag na Hardinero', 'Watered plants for 7 days straight', 'Nagdilig ng halaman sa loob ng 7 araw', '💧', 20),
('Unang Ani', 'Unang Ani', 'Harvested your first plant', 'Nag-ani ng unang halaman', '🥬', 30),
('Master Gardener', 'Master Gardener', 'Reached level 5', 'Umabot sa level 5', '👨‍🌾', 100),
('Plant Expert', 'Plant Expert', 'Identified 10 plants', 'Nakilala ang 10 halaman', '🔍', 50);

-- Create storage bucket for AR photos
INSERT INTO storage.buckets (id, name, public) VALUES ('ar-photos', 'ar-photos', true);

-- Storage policies for ar-photos bucket
CREATE POLICY "Users can upload AR photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'ar-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view their AR photos" ON storage.objects FOR SELECT USING (bucket_id = 'ar-photos');
CREATE POLICY "Users can delete their AR photos" ON storage.objects FOR DELETE USING (bucket_id = 'ar-photos' AND auth.uid()::text = (storage.foldername(name))[1]);