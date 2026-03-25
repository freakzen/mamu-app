import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: 'citizen' | 'expert' | 'admin';
  phone: string | null;
  location: string | null;
  bio: string | null;
  loyalty_points: number;
  badge_level: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
};

export type Issue = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: 'pothole' | 'streetlight' | 'water' | 'garbage' | 'pollution' | 'traffic' | 'other';
  status: 'open' | 'in_progress' | 'resolved' | 'rejected';
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  image_urls: string[];
  upvote_count: number;
  comment_count: number;
  view_count: number;
  assigned_expert_id: string | null;
  priority: number;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
};

export type Comment = {
  id: string;
  issue_id: string;
  user_id: string;
  content: string;
  is_expert_comment: boolean;
  likes_count: number;
  created_at: string;
  updated_at: string;
};
