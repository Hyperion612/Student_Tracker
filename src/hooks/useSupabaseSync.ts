import { useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';
import * as api from '../lib/api';
import { isSupabaseConfigured } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useSupabaseSync(user: User | null) {
  const {
    settings,
    updateSettings,
    resetAll,
  } = useStore();

  // Load data from Supabase on mount
  const loadFromSupabase = useCallback(async () => {
    if (!user || !isSupabaseConfigured) return;

    try {
      const state = useStore.getState();
      
      // Load profile
      const profile = await api.getProfile(user.id);
      updateSettings({
        name: profile.name,
        semesterStart: profile.semester_start,
        semesterEnd: profile.semester_end,
        accentColor: profile.accent_color,
        onboardingComplete: profile.onboarding_complete,
      });

      // Clear local data and load from Supabase
      state.resetAll();
      
      // Load day records
      const dayRecords = await api.getDayRecords(user.id);
      dayRecords.forEach(record => {
        state.setDayStatus(record.date, record.status, record.subject_id || undefined);
      });

      // Load subjects
      const subjects = await api.getSubjects(user.id);
      subjects.forEach(subject => {
        state.addSubject({
          name: subject.name,
          color: subject.color,
          emoji: subject.emoji,
        });
      });

      // Load achievements
      const achievements = await api.getAchievements(user.id);
      achievements.forEach(ach => {
        if (ach.unlocked) {
          state.unlockAchievement(ach.achievement_id);
        }
      });

      // Load goals
      const goals = await api.getGoals(user.id);
      goals.forEach(goal => {
        state.addGoal({
          title: goal.title,
          targetPercent: goal.target_percent,
          period: goal.period,
        });
        if (goal.completed) {
          state.completeGoal(goal.id);
        }
      });
    } catch (error) {
      console.error('Failed to load data from Supabase:', error);
    }
  }, [user, updateSettings]);

  // Sync profile changes to Supabase
  useEffect(() => {
    if (!user || !settings.onboardingComplete || !isSupabaseConfigured) return;

    const syncProfile = async () => {
      try {
        await api.updateProfile(user.id, {
          name: settings.name,
          semester_start: settings.semesterStart,
          semester_end: settings.semesterEnd,
          accent_color: settings.accentColor,
          onboarding_complete: settings.onboardingComplete,
        });
      } catch (error) {
        console.error('Failed to sync profile:', error);
      }
    };

    syncProfile();
  }, [user, settings.name, settings.semesterStart, settings.semesterEnd, settings.accentColor, settings.onboardingComplete]);

  // Load data when user logs in
  useEffect(() => {
    if (user && isSupabaseConfigured) {
      loadFromSupabase().catch(error => {
        console.error('Failed to load data from Supabase:', error);
      });
    }
  }, [user, loadFromSupabase]);

  return { loadFromSupabase, isConfigured: isSupabaseConfigured };
}
