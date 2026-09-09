import { supabase } from './supabase';
import type { Profile, DayRecord, Subject, UserAchievement, UserGoal } from './supabase';

// ============================================
// AUTH API
// ============================================

export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });
  
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// ============================================
// PROFILE API
// ============================================

export async function getProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data as Profile;
}

export async function updateProfile(userId: string, updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data as Profile;
}

// ============================================
// DAY RECORDS API
// ============================================

export async function getDayRecords(userId: string, startDate?: string, endDate?: string): Promise<DayRecord[]> {
  let query = supabase
    .from('day_records')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });
  
  if (startDate) {
    query = query.gte('date', startDate);
  }
  if (endDate) {
    query = query.lte('date', endDate);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data as DayRecord[];
}

export async function upsertDayRecord(
  userId: string, 
  date: string, 
  status: DayRecord['status'], 
  subjectId?: string | null
): Promise<DayRecord> {
  const { data, error } = await supabase
    .from('day_records')
    .upsert({
      user_id: userId,
      date,
      status,
      subject_id: subjectId || null,
    }, {
      onConflict: 'user_id,date',
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as DayRecord;
}

export async function upsertDayRecords(
  userId: string, 
  records: Array<{
    date: string;
    status: DayRecord['status'];
    subject_id?: string | null;
  }>
): Promise<DayRecord[]> {
  const recordsWithUserId = records.map(r => ({
    user_id: userId,
    ...r,
  }));
  
  const { data, error } = await supabase
    .from('day_records')
    .upsert(recordsWithUserId, {
      onConflict: 'user_id,date',
    })
    .select();
  
  if (error) throw error;
  return data as DayRecord[];
}

export async function deleteDayRecord(userId: string, date: string) {
  const { error } = await supabase
    .from('day_records')
    .delete()
    .eq('user_id', userId)
    .eq('date', date);
  
  if (error) throw error;
}

// ============================================
// SUBJECTS API
// ============================================

export async function getSubjects(userId: string): Promise<Subject[]> {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data as Subject[];
}

export async function createSubject(
  userId: string, 
  name: string, 
  color: string, 
  emoji: string
): Promise<Subject> {
  const { data, error } = await supabase
    .from('subjects')
    .insert({
      user_id: userId,
      name,
      color,
      emoji,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as Subject;
}

export async function updateSubject(
  subjectId: string, 
  updates: Partial<Pick<Subject, 'name' | 'color' | 'emoji'>>
): Promise<Subject> {
  const { data, error } = await supabase
    .from('subjects')
    .update(updates)
    .eq('id', subjectId)
    .select()
    .single();
  
  if (error) throw error;
  return data as Subject;
}

export async function deleteSubject(subjectId: string) {
  const { error } = await supabase
    .from('subjects')
    .delete()
    .eq('id', subjectId);
  
  if (error) throw error;
}

// ============================================
// ACHIEVEMENTS API
// ============================================

export async function getAchievements(userId: string): Promise<UserAchievement[]> {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data as UserAchievement[];
}

export async function unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement> {
  const { data, error } = await supabase
    .from('user_achievements')
    .update({
      unlocked: true,
      unlocked_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('achievement_id', achievementId)
    .select()
    .single();
  
  if (error) throw error;
  return data as UserAchievement;
}

// ============================================
// GOALS API
// ============================================

export async function getGoals(userId: string): Promise<UserGoal[]> {
  const { data, error } = await supabase
    .from('user_goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data as UserGoal[];
}

export async function createGoal(
  userId: string, 
  title: string, 
  targetPercent: number, 
  period: 'week' | 'month' | 'semester'
): Promise<UserGoal> {
  const { data, error } = await supabase
    .from('user_goals')
    .insert({
      user_id: userId,
      title,
      target_percent: targetPercent,
      period,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as UserGoal;
}

export async function completeGoal(goalId: string): Promise<UserGoal> {
  const { data, error } = await supabase
    .from('user_goals')
    .update({ completed: true })
    .eq('id', goalId)
    .select()
    .single();
  
  if (error) throw error;
  return data as UserGoal;
}

export async function deleteGoal(goalId: string) {
  const { error } = await supabase
    .from('user_goals')
    .delete()
    .eq('id', goalId);
  
  if (error) throw error;
}

// ============================================
// STATS API
// ============================================

export async function getUserStats(userId: string) {
  const { data, error } = await supabase
    .rpc('get_user_stats', { user_uuid: userId });
  
  if (error) throw error;
  return data as {
    total_days: number;
    attended: number;
    skipped: number;
    excused: number;
    sick: number;
    holiday: number;
  };
}
