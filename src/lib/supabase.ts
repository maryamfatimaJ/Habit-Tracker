import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string;
  created_at: string;
};

export type Habit = {
  id: string;
  user_id: string;
  name: string;
  category: string;
  has_target: boolean;
  target_value: number;
  icon: string;
  created_at: string;
};

export type DailyProgress = {
  id: string;
  user_id: string;
  habit_id: string;
  date: string;
  completed: boolean;
  current_value: number;
  created_at: string;
};
