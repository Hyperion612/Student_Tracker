import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { calculateAttendance, calculateStreak } from '../utils/attendance';
import confetti from 'canvas-confetti';
import { Trophy, Lock } from 'lucide-react';

export default function Achievements() {
  const { days, achievements, unlockAchievement, goals, addGoal, completeGoal, removeGoal } = useStore();
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalPercent, setGoalPercent] = useState(90);
  const [goalPeriod, setGoalPeriod] = useState<'week' | 'month' | 'semester'>('month');

  const stats = useMemo(() => ({
    attendance: calculateAttendance(days),
    streak: calculateStreak(days),
    totalAttended: days.filter(d => d.status === 'ATTENDED').length,
  }), [days]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#84cc16', '#06b6d4', '#8b5cf6'],
    });
  };

  // Check and unlock achievements
  useEffect(() => {
    const attended = days.filter(d => d.status === 'ATTENDED');
    
    if (stats.streak >= 7) {
      const ach = achievements.find(a => a.id === 'perfect-week');
      if (ach && !ach.unlocked) { unlockAchievement('perfect-week'); triggerConfetti(); }
    }
    if (stats.streak >= 30) {
      const ach = achievements.find(a => a.id === 'iron-will');
      if (ach && !ach.unlocked) { unlockAchievement('iron-will'); triggerConfetti(); }
    }
    if (stats.totalAttended >= 50) {
      const ach = achievements.find(a => a.id === 'punctual');
      if (ach && !ach.unlocked) { unlockAchievement('punctual'); triggerConfetti(); }
    }
    if (stats.totalAttended >= 100) {
      const ach = achievements.find(a => a.id === 'century');
      if (ach && !ach.unlocked) { unlockAchievement('century'); triggerConfetti(); }
    }
    if (stats.streak >= 60) {
      const ach = achievements.find(a => a.id === 'marathon');
      if (ach && !ach.unlocked) { unlockAchievement('marathon'); triggerConfetti(); }
    }
    if (parseFloat(stats.attendance.rating) >= 95) {
      const ach = achievements.find(a => a.id === 'champion');
      if (ach && !ach.unlocked) { unlockAchievement('champion'); triggerConfetti(); }
    }
    if (attended.length >= 1) {
      const ach = achievements.find(a => a.id === 'early-bird');
      if (ach && !ach.unlocked) { unlockAchievement('early-bird'); triggerConfetti(); }
    }
  }, [stats.streak, stats.totalAttended, stats.attendance.rating, days, achievements, unlockAchievement]);

  const handleAddGoal = () => {
    if (goalTitle.trim()) {
      addGoal({ title: goalTitle.trim(), targetPercent: goalPercent, period: goalPeriod });
      setGoalTitle('');
      setShowGoalForm(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white/90 font-display flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Достижения и Цели
        </h2>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {achievements.map((ach) => (
          <motion.div
            key={ach.id}
            whileHover={{ scale: 1.03 }}
            className={`relative p-4 rounded-xl border text-center transition-all ${
              ach.unlocked
                ? 'bg-neutral-900/80 border-amber-400/30 shadow-lg shadow-amber-400/5'
                : 'bg-neutral-900/40 border-neutral-800 opacity-60'
            }`}
          >
            <div className="text-3xl mb-2">
              {ach.unlocked ? ach.icon : <Lock className="w-6 h-6 mx-auto text-neutral-600" />}
            </div>
            <h4 className="text-xs font-medium text-white truncate">{ach.title}</h4>
            <p className="text-[10px] text-neutral-400 mt-0.5">{ach.description}</p>
            {ach.unlocked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400"
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Goals Section */}
      <div className="border-t border-neutral-800 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white/80">Мои цели</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowGoalForm(!showGoalForm)}
            className="text-xs text-lime-400 hover:text-lime-300 transition-colors px-2 py-1 rounded-md bg-lime-400/10"
          >
            + Новая цель
          </motion.button>
        </div>

        {showGoalForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-xl mb-3"
          >
            <input
              type="text"
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              placeholder="Название цели"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-lime-400/50"
            />
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Цель %</label>
                <input
                  type="number"
                  value={goalPercent}
                  onChange={(e) => setGoalPercent(Number(e.target.value))}
                  min={50}
                  max={100}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Период</label>
                <select
                  value={goalPeriod}
                  onChange={(e) => setGoalPeriod(e.target.value as 'week' | 'month' | 'semester')}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50"
                >
                  <option value="week">Неделя</option>
                  <option value="month">Месяц</option>
                  <option value="semester">Семестр</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleAddGoal}
              className="px-3 py-1.5 rounded-lg bg-lime-400 text-neutral-900 font-medium text-sm hover:bg-lime-300 transition-colors"
            >
              Создать
            </button>
          </motion.div>
        )}

        <div className="space-y-2">
          {goals.length === 0 && (
            <p className="text-center py-4 text-neutral-500 text-sm">Пока нет целей. Создайте первую!</p>
          )}
          {goals.map((goal) => {
            const isAchieved = parseFloat(stats.attendance.rating) >= goal.targetPercent;
            
            return (
              <motion.div
                key={goal.id}
                layout
                className={`flex items-center gap-3 p-3 rounded-xl border ${
                  goal.completed || isAchieved
                    ? 'bg-lime-400/5 border-lime-400/20'
                    : 'bg-neutral-900/80 border-neutral-800'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  goal.completed || isAchieved ? 'bg-lime-400/20 text-lime-400' : 'bg-neutral-800 text-neutral-500'
                }`}>
                  {goal.completed || isAchieved ? '✓' : '○'}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${goal.completed || isAchieved ? 'text-lime-400' : 'text-white/80'}`}>
                    {goal.title}
                  </p>
                  <p className="text-xs text-neutral-400">
                    Цель: {goal.targetPercent}% • {goal.period === 'week' ? 'неделя' : goal.period === 'month' ? 'месяц' : 'семестр'}
                  </p>
                </div>
                <div className="flex gap-1">
                  {!goal.completed && isAchieved && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => { completeGoal(goal.id); triggerConfetti(); }}
                      className="px-2 py-1 rounded-md bg-lime-400/20 text-lime-400 text-xs"
                    >
                      ✓
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeGoal(goal.id)}
                    className="px-2 py-1 rounded-md bg-red-500/10 text-red-400 text-xs"
                  >
                    ✕
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
