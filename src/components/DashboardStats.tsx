import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { calculateAttendance, calculateStreak, getDaysUntilSemesterEnd, getSemesterProgress } from '../utils/attendance';
import { Calendar, TrendingUp, Flame, Clock, Target, Award } from 'lucide-react';

export default function DashboardStats() {
  const { days, settings, goals, achievements } = useStore();

  const stats = useMemo(() => {
    const attendance = calculateAttendance(days);
    const streak = calculateStreak(days);
    const daysLeft = getDaysUntilSemesterEnd(settings.semesterEnd);
    const progress = getSemesterProgress(settings.semesterStart, settings.semesterEnd);
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const completedGoals = goals.filter(g => g.completed).length;
    
    return { attendance, streak, daysLeft, progress, unlockedCount, completedGoals };
  }, [days, settings, achievements, goals]);

  const isAdmissible = parseFloat(stats.attendance.rating) >= 80;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {/* Attendance Ring */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="col-span-2 lg:col-span-1 bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 flex flex-col items-center justify-center"
      >
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-neutral-800" />
            <motion.circle
              cx="50" cy="50" r="42" fill="none"
              stroke="currentColor" strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${parseFloat(stats.attendance.rating) * 2.64} 264`}
              className={isAdmissible ? 'text-lime-400' : 'text-red-400'}
              initial={{ strokeDasharray: '0 264' }}
              animate={{ strokeDasharray: `${parseFloat(stats.attendance.rating) * 2.64} 264` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white font-mono tabular-nums">
              {stats.attendance.rating}%
            </span>
            <span className="text-xs text-neutral-400">посещаемость</span>
          </div>
        </div>
        <div className={`mt-3 px-3 py-1 rounded-full text-xs font-medium ${
          isAdmissible ? 'bg-lime-400/10 text-lime-400' : 'bg-red-400/10 text-red-400'
        }`}>
          {isAdmissible ? '✓ Допуск к сессии' : '✗ Риск недопуска (< 80%)'}
        </div>
      </motion.div>

      {/* Days Left */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-neutral-400 uppercase tracking-wider">До конца семестра</span>
        </div>
        <div className="text-4xl font-bold text-white font-mono tabular-nums">
          {stats.daysLeft}
        </div>
        <div className="text-sm text-neutral-400 mt-1">дней осталось</div>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-neutral-500 mb-1">
            <span>Прогресс</span>
            <span>{stats.progress.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${stats.progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Streak */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-xs text-neutral-400 uppercase tracking-wider">Стрик</span>
        </div>
        <div className="text-4xl font-bold text-white font-mono tabular-nums">
          {stats.streak}
        </div>
        <div className="text-sm text-neutral-400 mt-1">дней подряд</div>
        
        <div className="mt-4 flex gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${
                i < Math.min(stats.streak, 7) ? 'bg-orange-400' : 'bg-neutral-800'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Pure attendance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-violet-400" />
          <span className="text-xs text-neutral-400 uppercase tracking-wider">Чистое посещение</span>
        </div>
        <div className="text-4xl font-bold text-white font-mono tabular-nums">
          {stats.attendance.pure}%
        </div>
        <div className="text-sm text-neutral-400 mt-1">только присутствия</div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-neutral-400 uppercase tracking-wider">Достижения</span>
        </div>
        <div className="text-4xl font-bold text-white font-mono tabular-nums">
          {stats.unlockedCount}
        </div>
        <div className="text-sm text-neutral-400 mt-1">из {achievements.length} разблокировано</div>
      </motion.div>

      {/* Goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-lime-400" />
          <span className="text-xs text-neutral-400 uppercase tracking-wider">Цели</span>
        </div>
        <div className="text-4xl font-bold text-white font-mono tabular-nums">
          {stats.completedGoals}/{goals.length}
        </div>
        <div className="text-sm text-neutral-400 mt-1">целей выполнено</div>
      </motion.div>
    </div>
  );
}
