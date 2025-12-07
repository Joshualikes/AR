import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getSession } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export interface UserProgress {
  id: string;
  userId: string;
  totalStars: number;
  level: number;
  experiencePoints: number;
  plantsHarvested: number;
  streakDays: number;
  lastActivityDate: string | null;
}

export interface Achievement {
  id: string;
  name: string;
  nameTagalog: string;
  description: string;
  descriptionTagalog: string;
  icon: string;
  starsRequired: number;
}

export interface UserAchievement {
  id: string;
  achievementId: string;
  earnedAt: string;
  achievement: Achievement;
}

export interface DailyTask {
  id: string;
  taskType: string;
  taskDescription: string;
  isCompleted: boolean;
  starsReward: number;
  taskDate: string;
  completedAt: string | null;
}

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = getSession();

  const fetchProgress = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProgress({
          id: data.id,
          userId: data.user_id,
          totalStars: data.total_stars,
          level: data.level,
          experiencePoints: data.experience_points,
          plantsHarvested: data.plants_harvested,
          streakDays: data.streak_days,
          lastActivityDate: data.last_activity_date,
        });
      } else {
        // Create initial progress record
        const { data: newData, error: createError } = await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            total_stars: 0,
            level: 1,
            experience_points: 0,
            plants_harvested: 0,
            streak_days: 0,
          })
          .select()
          .single();

        if (createError) throw createError;
        
        if (newData) {
          setProgress({
            id: newData.id,
            userId: newData.user_id,
            totalStars: newData.total_stars,
            level: newData.level,
            experiencePoints: newData.experience_points,
            plantsHarvested: newData.plants_harvested,
            streakDays: newData.streak_days,
            lastActivityDate: newData.last_activity_date,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addStars = useCallback(async (stars: number) => {
    if (!user || !progress) return;

    const newTotalStars = progress.totalStars + stars;
    const newLevel = Math.floor(newTotalStars / 100) + 1;

    try {
      const { error } = await supabase
        .from('user_progress')
        .update({
          total_stars: newTotalStars,
          level: newLevel,
          experience_points: newTotalStars,
          last_activity_date: new Date().toISOString().split('T')[0],
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setProgress(prev => prev ? {
        ...prev,
        totalStars: newTotalStars,
        level: newLevel,
        experiencePoints: newTotalStars,
      } : null);

      toast({
        title: `+${stars} Stars! ⭐`,
        description: newLevel > progress.level 
          ? `Congrats! Ikaw na ay Level ${newLevel}!` 
          : 'Patuloy na pagtatanim!',
      });
    } catch (error) {
      console.error('Error adding stars:', error);
    }
  }, [user, progress, toast]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { progress, loading, addStars, refetch: fetchProgress };
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = getSession();

  useEffect(() => {
    async function fetchAchievements() {
      try {
        // Fetch all achievements
        const { data: allAchievements, error: achError } = await supabase
          .from('achievements')
          .select('*');

        if (achError) throw achError;

        if (allAchievements) {
          setAchievements(allAchievements.map(a => ({
            id: a.id,
            name: a.name,
            nameTagalog: a.name_tagalog,
            description: a.description,
            descriptionTagalog: a.description_tagalog,
            icon: a.icon,
            starsRequired: a.stars_required,
          })));
        }

        // Fetch user achievements if logged in
        if (user) {
          const { data: userAch, error: userError } = await supabase
            .from('user_achievements')
            .select('*, achievements(*)')
            .eq('user_id', user.id);

          if (userError) throw userError;

          if (userAch) {
            setUserAchievements(userAch.map(ua => ({
              id: ua.id,
              achievementId: ua.achievement_id,
              earnedAt: ua.earned_at,
              achievement: {
                id: ua.achievements.id,
                name: ua.achievements.name,
                nameTagalog: ua.achievements.name_tagalog,
                description: ua.achievements.description,
                descriptionTagalog: ua.achievements.description_tagalog,
                icon: ua.achievements.icon,
                starsRequired: ua.achievements.stars_required,
              },
            })));
          }
        }
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAchievements();
  }, [user]);

  return { achievements, userAchievements, loading };
}

export function useDailyTasks() {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = getSession();

  const fetchTasks = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    try {
      const { data, error } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('task_date', today);

      if (error) throw error;

      if (data && data.length > 0) {
        setTasks(data.map(t => ({
          id: t.id,
          taskType: t.task_type,
          taskDescription: t.task_description,
          isCompleted: t.is_completed,
          starsReward: t.stars_reward,
          taskDate: t.task_date,
          completedAt: t.completed_at,
        })));
      } else {
        // Generate daily tasks
        const defaultTasks = [
          { type: 'water', description: 'Diligan ang halaman ngayong araw 💧', stars: 2 },
          { type: 'check', description: 'I-check ang iyong halaman kung malusog 🌱', stars: 1 },
          { type: 'identify', description: 'Mag-identify ng bagong halaman 📷', stars: 3 },
          { type: 'learn', description: 'Magtanong kay Kuya Botanist 🧑‍🌾', stars: 2 },
        ];

        const { data: newTasks, error: createError } = await supabase
          .from('daily_tasks')
          .insert(defaultTasks.map(t => ({
            user_id: user.id,
            task_type: t.type,
            task_description: t.description,
            stars_reward: t.stars,
            task_date: today,
          })))
          .select();

        if (createError) throw createError;

        if (newTasks) {
          setTasks(newTasks.map(t => ({
            id: t.id,
            taskType: t.task_type,
            taskDescription: t.task_description,
            isCompleted: t.is_completed,
            starsReward: t.stars_reward,
            taskDate: t.task_date,
            completedAt: t.completed_at,
          })));
        }
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const completeTask = useCallback(async (taskId: string) => {
    if (!user) return;

    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task || task.isCompleted) return;

      const { error } = await supabase
        .from('daily_tasks')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, isCompleted: true, completedAt: new Date().toISOString() }
          : t
      ));

      toast({
        title: 'Task Tapos Na! ✅',
        description: `Nakuha mo ang ${task.starsReward} stars!`,
      });

      return task.starsReward;
    } catch (error) {
      console.error('Error completing task:', error);
      return 0;
    }
  }, [user, tasks, toast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, completeTask, refetch: fetchTasks };
}
