import { supabase } from './supabase';
import type { Issue, Comment, User } from './supabase';

// Issues
export async function getIssues(filters?: { category?: string; status?: string; offset?: number; limit?: number }) {
  let query = supabase.from('issues').select('*');

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const offset = filters?.offset || 0;
  const limit = filters?.limit || 10;

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data;
}

export async function getIssueById(id: string) {
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createIssue(issue: Partial<Issue>) {
  const { data, error } = await supabase
    .from('issues')
    .insert([issue])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateIssue(id: string, updates: Partial<Issue>) {
  const { data, error } = await supabase
    .from('issues')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Comments
export async function getIssueComments(issueId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('*, users:user_id(id, full_name, avatar_url, role)')
    .eq('issue_id', issueId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createComment(comment: Partial<Comment>) {
  const { data, error } = await supabase
    .from('comments')
    .insert([comment])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Likes
export async function likeIssue(userId: string, issueId: string) {
  const { error } = await supabase
    .from('likes')
    .insert([{ user_id: userId, issue_id: issueId }])
    .select()
    .single();

  if (error && error.code !== 'PGRST116') throw error;
}

export async function unlikeIssue(userId: string, issueId: string) {
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('user_id', userId)
    .eq('issue_id', issueId);

  if (error) throw error;
}

export async function hasUserLikedIssue(userId: string, issueId: string) {
  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('issue_id', issueId)
    .single();

  if (error && error.code === 'PGRST116') return false;
  if (error) throw error;
  return !!data;
}

// Users
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function awardLoyaltyPoints(userId: string, points: number) {
  const user = await getUserProfile(userId);
  return updateUserProfile(userId, {
    loyalty_points: user.loyalty_points + points,
  });
}
