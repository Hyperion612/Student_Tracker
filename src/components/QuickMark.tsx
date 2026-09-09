import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import type { DayStatus } from '../utils/attendance';
import { Check, X, FileText, Bug, CalendarX, CalendarRange } from 'lucide-react';

const QUICK_STATUSES: { status: DayStatus; label: string; icon: React.ReactNode; color: string }[] = [
  { status: 'ATTENDED', label: 'Я на паре!', icon: <Check className="w-5 h-5" />, color: 'bg-lime-400 text-neutral-900' },
  { status: 'SKIPPED', label: 'Прогул', icon: <X className="w-5 h-5" />, color: 'bg-red-500/20 text-red-400 border border-red-500/30' },
  { status: 'EXCUSED', label: 'Уважительная', icon: <FileText className="w-5 h-5" />, color: 'bg-amber-400/20 text-amber-400 border border-amber-400/30' },
  { status: 'SICK', label: 'Заболел', icon: <Bug className="w-5 h-5" />, color: 'bg-blue-400/20 text-blue-400 border border-blue-400/30' },
  { status: 'HOLIDAY', label: 'Отмена', icon: <CalendarX className="w-5 h-5" />, color: 'bg-neutral-700 text-neutral-300 border border-neutral-600' },
];

export default function QuickMark() {
  const { setDayStatus, setDayRangeStatus } = useStore();
  const today = new Date().toISOString().split('T')[0];
  const [showRange, setShowRange] = useState(false);
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');
  const [rangeStatus, setRangeStatus] = useState<DayStatus>('SICK');
  const [justMarked, setJustMarked] = useState(false);

  const handleQuickMark = (status: DayStatus) => {
    setDayStatus(today, status);
    setJustMarked(true);
    setTimeout(() => setJustMarked(false), 2000);
  };

  const handleRangeSubmit = () => {
    if (rangeStart && rangeEnd) {
      setDayRangeStatus(rangeStart, rangeEnd, rangeStatus);
      setShowRange(false);
      setRangeStart('');
      setRangeEnd('');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white/90 font-display">Быстрая отметка</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowRange(!showRange)}
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-neutral-800/50 border border-neutral-700"
        >
          <CalendarRange className="w-3.5 h-3.5" />
          Диапазон
        </motion.button>
      </div>

      {/* Quick buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {QUICK_STATUSES.map(({ status, label, icon, color }) => (
          <motion.button
            key={status}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleQuickMark(status)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all ${color}`}
          >
            {icon}
            <span>{label}</span>
          </motion.button>
        ))}
      </div>

      {/* Success animation */}
      <AnimatePresence>
        {justMarked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 text-center text-lime-400 font-medium"
          >
            ✓ Отмечено на сегодня!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Range picker */}
      <AnimatePresence>
        {showRange && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl">
              <h3 className="text-sm font-medium text-white mb-3">Отметить диапазон дней</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">С</label>
                  <input
                    type="date"
                    value={rangeStart}
                    onChange={(e) => setRangeStart(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50 [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">По</label>
                  <input
                    type="date"
                    value={rangeEnd}
                    onChange={(e) => setRangeEnd(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50 [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">Статус</label>
                  <select
                    value={rangeStatus}
                    onChange={(e) => setRangeStatus(e.target.value as DayStatus)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/50 [color-scheme:dark]"
                  >
                    <option value="SICK">Болезнь</option>
                    <option value="EXCUSED">Уважительная</option>
                    <option value="SKIPPED">Прогул</option>
                    <option value="HOLIDAY">Отмена</option>
                  </select>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRangeSubmit}
                className="mt-3 px-4 py-2 rounded-lg bg-lime-400 text-neutral-900 font-medium text-sm hover:bg-lime-300 transition-colors"
              >
                Применить
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
