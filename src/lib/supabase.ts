import { createClient } from '@supabase/supabase-js';

// Проверка наличия переменных окружения
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Флаг: Supabase настроен или нет
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Предупреждение в консоли если Supabase не настроен
if (!isSupabaseConfigured) {
  console.warn(
    '%c⚠️ Supabase не настроен!',
    'color: #f59e0b; font-weight: bold; font-size: 14px;',
    '\n\nПриложение работает в локальном режиме (localStorage).',
    '\nДля синхронизации с облаком:',
    '\n1. Создайте файл .env в корне проекта',
    '\n2. Добавьте переменные:',
    '\n   VITE_SUPABASE_URL=https://your-project.supabase.co',
    '\n   VITE_SUPABASE_ANON_KEY=your-anon-key',
    '\n\nПодробная инструкция: README.md → Настройка Supabase'
  );
}

// Создание клиента Supabase (или mock если не настроен)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Типы данных
export interface Profile {
  id: string;
  name: string;
  semester_start: string;
  semester_end: string;
  accent_color: 'lime' | 'cyan' | 'violet';
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface DayRecord {
  id: string;
  user_id: string;
  date: string;
  status: 'ATTENDED' | 'SKIPPED' | 'EXCUSED' | 'SICK' | 'HOLIDAY' | 'UNMARKED';
  subject_id: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  user_id: string;
  name: string;
  color: string;
  emoji: string;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked: boolean;
  unlocked_at: string | null;
  created_at: string;
}

export interface UserGoal {
  id: string;
  user_id: string;
  title: string;
  target_percent: number;
  period: 'week' | 'month' | 'semester';
  completed: boolean;
  created_at: string;
}
