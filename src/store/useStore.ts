import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DayRecord, DayStatus, Subject, Achievement, Goal } from '../utils/attendance';

interface UserSettings {
  name: string;
  semesterStart: string;
  semesterEnd: string;
  onboardingComplete: boolean;
  accentColor: 'lime' | 'cyan' | 'violet';
}

interface AppState {
  // User
  settings: UserSettings;
  
  // Data
  days: DayRecord[];
  subjects: Subject[];
  achievements: Achievement[];
  goals: Goal[];
  
  // Actions
  updateSettings: (settings: Partial<UserSettings>) => void;
  setDayStatus: (date: string, status: DayStatus, subjectId?: string) => void;
  setDayRangeStatus: (startDate: string, endDate: string, status: DayStatus) => void;
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  removeSubject: (id: string) => void;
  updateDay: (date: string, updates: Partial<DayRecord>) => void;
  unlockAchievement: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'completed'>) => void;
  completeGoal: (id: string) => void;
  removeGoal: (id: string) => void;
  exportData: () => string;
  resetAll: () => void;
  generateDemoData: () => void;
}

const defaultAchievements: Achievement[] = [
  { id: 'perfect-week', title: 'Идеальная неделя', description: '7 дней подряд без прогулов', icon: '🏆', unlocked: false },
  { id: 'iron-will', title: 'Железная воля', description: '30 дней без прогулов', icon: '💪', unlocked: false },
  { id: 'punctual', title: 'Пунктуальность', description: 'Отметить 50 дней', icon: '⏰', unlocked: false },
  { id: 'survivor', title: 'Выживший', description: 'Переболеть и вернуться', icon: '🦠', unlocked: false },
  { id: 'century', title: 'Сотня', description: '100 посещённых пар', icon: '💯', unlocked: false },
  { id: 'early-bird', title: 'Ранняя пташка', description: 'Отметить первый день семестра', icon: '🌅', unlocked: false },
  { id: 'marathon', title: 'Марафонец', description: '60 дней стрик', icon: '🏃', unlocked: false },
  { id: 'champion', title: 'Чемпион', description: 'Достичь 95% посещаемости', icon: '👑', unlocked: false },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      settings: {
        name: '',
        semesterStart: new Date().toISOString().split('T')[0],
        semesterEnd: new Date(new Date().getFullYear(), 5, 30).toISOString().split('T')[0],
        onboardingComplete: false,
        accentColor: 'lime',
      },
      days: [],
      subjects: [],
      achievements: defaultAchievements,
      goals: [],

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      setDayStatus: (date, status, subjectId) =>
        set((state) => {
          const existing = state.days.find((d) => d.date === date);
          if (existing) {
            return {
              days: state.days.map((d) =>
                d.date === date ? { ...d, status, subjectId: subjectId || d.subjectId } : d
              ),
            };
          }
          return {
            days: [...state.days, { date, status, subjectId }],
          };
        }),

      setDayRangeStatus: (startDate, endDate, status) =>
        set((state) => {
          const start = new Date(startDate);
          const end = new Date(endDate);
          const newDays = [...state.days];
          
          const current = new Date(start);
          while (current <= end) {
            const dateStr = current.toISOString().split('T')[0];
            const existing = newDays.find((d) => d.date === dateStr);
            if (existing) {
              const idx = newDays.indexOf(existing);
              newDays[idx] = { ...existing, status };
            } else {
              newDays.push({ date: dateStr, status });
            }
            current.setDate(current.getDate() + 1);
          }
          
          return { days: newDays };
        }),

      addSubject: (subject) =>
        set((state) => ({
          subjects: [...state.subjects, { ...subject, id: crypto.randomUUID() }],
        })),

      removeSubject: (id) =>
        set((state) => ({
          subjects: state.subjects.filter((s) => s.id !== id),
        })),

      updateDay: (date, updates) =>
        set((state) => ({
          days: state.days.map((d) => (d.date === date ? { ...d, ...updates } : d)),
        })),

      unlockAchievement: (id) =>
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === id ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a
          ),
        })),

      addGoal: (goal) =>
        set((state) => ({
          goals: [...state.goals, { ...goal, id: crypto.randomUUID(), completed: false }],
        })),

      completeGoal: (id) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, completed: true } : g)),
        })),

      removeGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),

      exportData: () => {
        const state = get();
        return JSON.stringify({
          settings: state.settings,
          days: state.days,
          subjects: state.subjects,
          achievements: state.achievements,
          goals: state.goals,
        }, null, 2);
      },

      resetAll: () =>
        set({
          days: [],
          subjects: [],
          achievements: defaultAchievements,
          goals: [],
        }),

      generateDemoData: () => {
        const state = get();
        const start = new Date(state.settings.semesterStart);
        const end = new Date();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const demoDays: DayRecord[] = [];
        const current = new Date(start);
        
        while (current <= end && current <= today) {
          const dayOfWeek = current.getDay();
          const dateStr = current.toISOString().split('T')[0];
          
          // Skip weekends
          if (dayOfWeek === 0 || dayOfWeek === 6) {
            current.setDate(current.getDate() + 1);
            continue;
          }
          
          // Random status with weighted distribution
          const rand = Math.random();
          let status: DayStatus;
          
          if (rand < 0.65) status = 'ATTENDED';
          else if (rand < 0.75) status = 'EXCUSED';
          else if (rand < 0.82) status = 'SICK';
          else if (rand < 0.88) status = 'SKIPPED';
          else status = 'HOLIDAY';
          
          demoDays.push({ date: dateStr, status });
          current.setDate(current.getDate() + 1);
        }
        
        const demoSubjects: Subject[] = [
          { id: 'demo-1', name: 'Математика', color: '#84cc16', emoji: '📐' },
          { id: 'demo-2', name: 'Программирование', color: '#06b6d4', emoji: '💻' },
          { id: 'demo-3', name: 'Физ-ра', color: '#f59e0b', emoji: '🏃' },
          { id: 'demo-4', name: 'Физика', color: '#8b5cf6', emoji: '🔬' },
          { id: 'demo-5', name: 'Английский', color: '#ec4899', emoji: '🌍' },
        ];
        
        set({
          days: demoDays,
          subjects: demoSubjects,
          goals: [{
            id: 'demo-goal-1',
            title: 'Ходить 90% в этом месяце',
            targetPercent: 90,
            period: 'month',
            completed: false,
          }],
        });
      },
    }),
    {
      name: 'student-tracker-pro',
    }
  )
);
