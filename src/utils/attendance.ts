export type DayStatus = 'ATTENDED' | 'SKIPPED' | 'EXCUSED' | 'SICK' | 'HOLIDAY' | 'UNMARKED';

export interface DayRecord {
  date: string; // ISO date string YYYY-MM-DD
  status: DayStatus;
  subjectId?: string;
  note?: string;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  emoji: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Goal {
  id: string;
  title: string;
  targetPercent: number;
  period: 'week' | 'month' | 'semester';
  completed: boolean;
}

export function calculateAttendance(days: DayRecord[]): { rating: string; pure: string } {
  const marked = days.filter(d => d.status !== 'UNMARKED' && d.status !== 'HOLIDAY');
  const total = marked.length;
  
  if (total === 0) return { rating: '0.0', pure: '0.0' };
  
  const attended = marked.filter(d => d.status === 'ATTENDED').length;
  const excused = marked.filter(d => d.status === 'EXCUSED').length;
  const sick = marked.filter(d => d.status === 'SICK').length;
  
  // Уважительные и болезни не портят рейтинг полностью
  const rating = ((attended + excused * 0.75 + sick * 0.5) / total) * 100;
  const pure = (attended / total) * 100;
  
  return { rating: rating.toFixed(1), pure: pure.toFixed(1) };
}

export function getAttendanceBySubject(days: DayRecord[], subjectId: string) {
  const subjectDays = days.filter(d => d.subjectId === subjectId);
  const total = subjectDays.filter(d => d.status !== 'UNMARKED').length;
  const attended = subjectDays.filter(d => d.status === 'ATTENDED').length;
  const skipped = subjectDays.filter(d => d.status === 'SKIPPED').length;
  const excused = subjectDays.filter(d => d.status === 'EXCUSED').length;
  const sick = subjectDays.filter(d => d.status === 'SICK').length;
  
  return { total, attended, skipped, excused, sick, percent: total > 0 ? ((attended / total) * 100).toFixed(1) : '0.0' };
}

export function calculateStreak(days: DayRecord[]): number {
  const sorted = [...days]
    .filter(d => d.status !== 'UNMARKED' && d.status !== 'HOLIDAY')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  let streak = 0;
  for (const day of sorted) {
    if (day.status === 'ATTENDED' || day.status === 'EXCUSED') {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function getDaysUntilSemesterEnd(semesterEnd: string): number {
  const end = new Date(semesterEnd);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getSemesterProgress(semesterStart: string, semesterEnd: string): number {
  const start = new Date(semesterStart).getTime();
  const end = new Date(semesterEnd).getTime();
  const now = new Date().getTime();
  const progress = ((now - start) / (end - start)) * 100;
  return Math.min(100, Math.max(0, progress));
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', weekday: 'short' });
}

export function getDayName(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', { weekday: 'long' });
}

export function generateYearDates(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const current = new Date(start);
  
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

export function getWeekNumber(dateStr: string): number {
  const date = new Date(dateStr);
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - startOfYear.getTime();
  return Math.ceil((diff / (1000 * 60 * 60 * 24) + startOfYear.getDay() + 1) / 7);
}

export function getDayOfWeek(dateStr: string): number {
  const date = new Date(dateStr);
  const day = date.getDay();
  return day === 0 ? 6 : day - 1; // Mon=0, Sun=6
}
