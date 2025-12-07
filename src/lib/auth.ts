/**
 * Supabase Authentication System
 * Uses real Supabase backend for authentication
 */

import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

export interface AppUser {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

/**
 * Get current session from Supabase
 */
export async function getSessionAsync(): Promise<{ user: AppUser | null; session: Session | null; error: Error | null }> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      return { user: null, session: null, error };
    }
    
    if (!session?.user) {
      return { user: null, session: null, error: null };
    }

    // Get profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', session.user.id)
      .single();

    const appUser: AppUser = {
      id: session.user.id,
      username: profile?.username || session.user.email?.split('@')[0] || 'User',
      email: session.user.email || '',
      createdAt: session.user.created_at || new Date().toISOString(),
    };

    return { user: appUser, session, error: null };
  } catch (error) {
    return { user: null, session: null, error: error instanceof Error ? error : new Error('Failed to get session') };
  }
}

/**
 * Synchronous session check (for backward compatibility)
 * Uses cached session from localStorage
 */
export function getSession(): { user: AppUser | null; error: null } {
  try {
    // Check localStorage for cached user
    const cachedUser = localStorage.getItem('greengrow_user');
    if (cachedUser) {
      return { user: JSON.parse(cachedUser), error: null };
    }
    return { user: null, error: null };
  } catch {
    return { user: null, error: null };
  }
}

/**
 * Sign up a new user with Supabase
 */
export async function signUp(username: string, password: string): Promise<{ user: AppUser | null; error: Error | null }> {
  try {
    // Validate input
    if (!username || username.length < 3) {
      return { user: null, error: new Error('Username must be at least 3 characters') };
    }
    if (!password || password.length < 6) {
      return { user: null, error: new Error('Password must be at least 6 characters') };
    }

    // Create email from username (for Supabase auth)
    const email = `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}@greengrow.app`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          username,
        },
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        return { user: null, error: new Error('Username ay ginagamit na') };
      }
      return { user: null, error: new Error(error.message) };
    }

    if (!data.user) {
      return { user: null, error: new Error('Failed to create account') };
    }

    const appUser: AppUser = {
      id: data.user.id,
      username,
      email,
      createdAt: data.user.created_at || new Date().toISOString(),
    };

    // Cache user in localStorage
    localStorage.setItem('greengrow_user', JSON.stringify(appUser));

    return { user: appUser, error: null };
  } catch (error) {
    return { user: null, error: error instanceof Error ? error : new Error('Failed to create account') };
  }
}

/**
 * Sign in with username and password
 */
export async function signIn(username: string, password: string): Promise<{ user: AppUser | null; error: Error | null }> {
  try {
    // Create email from username
    const email = `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}@greengrow.app`;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login')) {
        return { user: null, error: new Error('Mali ang username o password') };
      }
      return { user: null, error: new Error(error.message) };
    }

    if (!data.user) {
      return { user: null, error: new Error('Failed to sign in') };
    }

    // Get profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', data.user.id)
      .single();

    const appUser: AppUser = {
      id: data.user.id,
      username: profile?.username || username,
      email,
      createdAt: data.user.created_at || new Date().toISOString(),
    };

    // Cache user in localStorage
    localStorage.setItem('greengrow_user', JSON.stringify(appUser));

    return { user: appUser, error: null };
  } catch (error) {
    return { user: null, error: error instanceof Error ? error : new Error('Failed to sign in') };
  }
}

/**
 * Sign out
 */
export async function signOut(): Promise<{ error: Error | null }> {
  try {
    localStorage.removeItem('greengrow_user');
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error: new Error(error.message) };
    }
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error : new Error('Failed to sign out') };
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const { user } = getSession();
  return user !== null;
}

/**
 * Set up auth state listener
 */
export function onAuthStateChange(callback: (user: AppUser | null) => void): () => void {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', session.user.id)
        .single();

      const appUser: AppUser = {
        id: session.user.id,
        username: profile?.username || session.user.email?.split('@')[0] || 'User',
        email: session.user.email || '',
        createdAt: session.user.created_at || new Date().toISOString(),
      };

      localStorage.setItem('greengrow_user', JSON.stringify(appUser));
      callback(appUser);
    } else {
      localStorage.removeItem('greengrow_user');
      callback(null);
    }
  });

  return () => subscription.unsubscribe();
}
