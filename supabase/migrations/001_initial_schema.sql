-- ============================================
-- Student Tracker Pro - Supabase Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS PROFILES (расширение auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  semester_start DATE NOT NULL DEFAULT CURRENT_DATE,
  semester_end DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '6 months'),
  accent_color TEXT NOT NULL DEFAULT 'lime' CHECK (accent_color IN ('lime', 'cyan', 'violet')),
  onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 2. SUBJECTS (дисциплины)
-- ============================================
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#84cc16',
  emoji TEXT NOT NULL DEFAULT '📚',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 3. DAY RECORDS (записи посещаемости)
-- ============================================
CREATE TABLE public.day_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'UNMARKED' CHECK (status IN ('ATTENDED', 'SKIPPED', 'EXCUSED', 'SICK', 'HOLIDAY', 'UNMARKED')),
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- ============================================
-- 4. ACHIEVEMENTS (достижения пользователя)
-- ============================================
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked BOOLEAN NOT NULL DEFAULT false,
  unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- ============================================
-- 5. GOALS (цели пользователя)
-- ============================================
CREATE TABLE public.user_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_percent INTEGER NOT NULL DEFAULT 90 CHECK (target_percent >= 0 AND target_percent <= 100),
  period TEXT NOT NULL DEFAULT 'month' CHECK (period IN ('week', 'month', 'semester')),
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES (для производительности)
-- ============================================
CREATE INDEX idx_day_records_user_date ON public.day_records(user_id, date);
CREATE INDEX idx_day_records_user_status ON public.day_records(user_id, status);
CREATE INDEX idx_subjects_user ON public.subjects(user_id);
CREATE INDEX idx_user_achievements_user ON public.user_achievements(user_id);
CREATE INDEX idx_user_goals_user ON public.user_goals(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.day_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

-- Policies: пользователи видят только свои данные
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own subjects" ON public.subjects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own subjects" ON public.subjects
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own day records" ON public.day_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own day records" ON public.day_records
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own achievements" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own achievements" ON public.user_achievements
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own goals" ON public.user_goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own goals" ON public.user_goals
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS (автоматизация)
-- ============================================

-- Автоматическое создание профиля при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  
  -- Инициализация достижений
  INSERT INTO public.user_achievements (user_id, achievement_id, unlocked)
  VALUES 
    (NEW.id, 'perfect-week', false),
    (NEW.id, 'iron-will', false),
    (NEW.id, 'punctual', false),
    (NEW.id, 'survivor', false),
    (NEW.id, 'century', false),
    (NEW.id, 'early-bird', false),
    (NEW.id, 'marathon', false),
    (NEW.id, 'champion', false);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер для автоматического создания профиля
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Автоматическое обновление updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_day_records_updated_at
  BEFORE UPDATE ON public.day_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- ФУНКЦИЯ: Получить полную статистику пользователя
-- ============================================
CREATE OR REPLACE FUNCTION public.get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_days', COUNT(*) FILTER (WHERE status != 'UNMARKED' AND status != 'HOLIDAY'),
    'attended', COUNT(*) FILTER (WHERE status = 'ATTENDED'),
    'skipped', COUNT(*) FILTER (WHERE status = 'SKIPPED'),
    'excused', COUNT(*) FILTER (WHERE status = 'EXCUSED'),
    'sick', COUNT(*) FILTER (WHERE status = 'SICK'),
    'holiday', COUNT(*) FILTER (WHERE status = 'HOLIDAY')
  ) INTO result
  FROM public.day_records
  WHERE user_id = user_uuid;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
